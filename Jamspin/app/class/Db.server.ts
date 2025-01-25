import { Session, SessionData } from "@remix-run/node";
import { createClient } from "@supabase/supabase-js";
import { Spotify } from "./Spotify.server";
import { Playlist, DB_User, DB_Playlist } from "~/types";

export const supabase = createClient(
  process.env.SUPABASE_API_URL!,
  process.env.SUPABASE_API_KEY!
);

export class Db {
  static async CreateUser(
    accessToken: string,
    refreshToken: string,
    expiresAtMs: number
  ): Promise<string | null> {
    try {
      // get spotify account details
      const req = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!req.ok) {
        console.log(
          "error while getting spotify account details while creating account"
        );
        return null;
      }
      const res = await req.json();

      // make sure this account does not already exist
      const userCheck = await supabase
        .from("users")
        .select("*")
        .eq("spotify_account_id", res.id);

      if (userCheck.error) {
        console.log("error while checking if user exists");
        return null;
      }

      if (userCheck.data.length > 0) {
        console.log("account already exists with this spotify id");
        return res.id;
      }

      // insert user record
      const insertUser = await supabase.from("users").insert({
        spotify_account_id: res.id,
        spotify_access_token: accessToken,
        spotify_refresh_token: refreshToken,
        spotify_access_token_expires_at_ms: expiresAtMs,
      });

      if (insertUser.error) {
        console.log("error while saving user to database");
        console.log(insertUser.error);

        return null;
      }

      return res.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async AuthenticateUser(session: Session<SessionData>) {
    // will read incoming cookie and make sure the user exists in database
    // returns user id if cookie is valid

    try {
      const cookie = session.get("userId");
      if (cookie === undefined) {
        return null;
      }

      const user = await supabase
        .from("users")
        .select("*")
        .eq("spotify_account_id", cookie);

      if (user.error) {
        return null;
      }

      const userData: DB_User[] | null = user.data;

      // remove cookie from browser
      if (userData.length === 0) {
        console.log("invalid cookie stored on browser, removing");

        return null;
      }

      return {
        ...userData[0],
        spotify_access_token: userData[0].spotify_access_token,
        spotify_refresh_token: userData[0].spotify_refresh_token,
        spotify_access_token_expires_at_ms:
          userData[0].spotify_access_token_expires_at_ms,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async GetPlaylistData(user: DB_User) {
    // gets all playlists stored in db
    try {
      const token = await Spotify.RefreshToken(
        user.spotify_refresh_token,
        user.id,
        user.spotify_access_token_expires_at_ms,
        user.spotify_access_token
      );
      if (token === null) {
        return null;
      }

      // now get all the playlists a user has in library
      const usersPlaylists = await Spotify.GetUsersPlaylists(token.accessToken);

      const { data, error } = await supabase
        .from("users")
        .select("playlists(*)")
        .eq("id", user.id);
      if (error) {
        console.log(error);
        return null;
      }

      // filter out by the jamspin playlists from all playlists user has now
      const jamspinPlaylists: Playlist[] = [];
      for (let i = 0; i < usersPlaylists.items.length; i++) {
        const p = data[0].playlists.find(
          (x) => x.spotify_playlist_id === usersPlaylists.items[i].id
        );
        if (p) {
          jamspinPlaylists.push({
            id: p.id,
            image: usersPlaylists.items[i].images[0].url,
            name: usersPlaylists.items[i].name,
            description: usersPlaylists.items[i].description,
            created_at: p.created_at,
            next_refresh_at: p.next_refresh_at,
            spotify_playlist_id: p.spotify_playlist_id,
            refresh_frequency_hrs: p.refresh_frequency_hrs,
            last_refresh_at: p.last_refresh_at,
            num_of_songs: usersPlaylists.items[i].tracks.total,
            genres: p.genres,
          });
        }
      }

      // the next playlist to refresh should be shown first
      return jamspinPlaylists.sort((a, b) => {
        return (
          new Date(a.next_refresh_at).getTime() -
          new Date(b.next_refresh_at).getTime()
        );
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async SavePlaylist(
    userID: number,
    genres: string[],
    spotifyPlaylistID: string,
    refreshFrequency: number,
    numOfSongs: number
  ) {
    try {
      const refreshAt = new Date(
        new Date().getTime() + refreshFrequency * 60 * 60 * 1000
      ).toISOString();

      const { data, error } = await supabase
        .from("playlists")
        .insert({
          fk_user_id: userID,
          spotify_playlist_id: spotifyPlaylistID,
          genres,
          refresh_frequency_hrs: refreshFrequency,
          next_refresh_at: refreshAt,
          num_of_songs: numOfSongs,
        })
        .select();

      if (error || data === null) {
        console.log("there was an error while saving playlist to database!");
        return null;
      }
      const playlistData: Playlist = data[0];
      return playlistData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async UpdateUser(updateObj: object, userID: number) {
    try {
      const { error } = await supabase
        .from("users")
        .update(updateObj)
        .eq("id", userID);

      if (error) {
        console.log("error while refreshing spotify token");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async DeletePlaylist(playlistID: string) {
    try {
      const { error } = await supabase
        .from("playlists")
        .delete()
        .eq("spotify_playlist_id", playlistID);

      if (error) {
        console.log(error);
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async RefreshPlaylists() {
    // refreshes all playlists in database that need to be resfreshed!!!!!!!!!!!!!!!!!!!!!!

    try {
      const { error, data } = await supabase
        .from("users")
        .select("*, playlists(*)")
        .lt("playlists.next_refresh_at", new Date().toISOString());

      if (error) {
        console.log(error);
        return null;
      }

      if (data === null || data.length === 0) {
        console.log("no playlists to update");
        return null;
      }

      let numberOfPlaylistsUpaded = 0;

      // for each user, update all playlists returned
      for (let i = 0; i < data.length; i++) {
        const userToken = await Spotify.RefreshToken(
          data[i].spotify_refresh_token,
          data[i].id,
          data[i].spotify_access_token_expires_at_ms,
          data[i].spotify_access_token
        );

        if (userToken) {
          for (let j = 0; j < data[i].playlists.length; j++) {
            // remove all songs from playlist
            const playlistURIS = await Spotify.GetPlaylistTrackURIS(
              userToken.accessToken,
              data[i].playlists[j].spotify_playlist_id
            );

            if (playlistURIS.length > 0) {
              const deletedTracks = await Spotify.RemoveAllPlaylistTracks(
                playlistURIS,
                data[i].playlists[j].spotify_playlist_id,
                { ...userToken }
              );
              if (deletedTracks === null) {
                console.log("error while deleting tracks");
                return null;
              }

              // add new songs to playlist
              const addedSongs = await Spotify.AddSongsToPlaylist(
                data[i].playlists[j].spotify_playlist_id,
                data[i].playlists[j].genres,
                userToken.accessToken,
                data[i].playlists[j].num_of_songs
              );
              if (addedSongs === null) {
                console.log(
                  "error adding tracks to playlist while refreshing playlist"
                );
                return null;
              }

              // get new playlist thumbnail
              const thumbnail = await Spotify.GetPlaylistImage(
                data[i].playlists[j].spotify_playlist_id,
                userToken.accessToken
              );
              if (thumbnail === null) {
                return null;
              }

              // update db data on playlist
              const updatedPlaylistRecord = await Db.UpdateRefreshedPlaylist(
                data[i].playlists[j].id
              );
              if (updatedPlaylistRecord === null) {
                console.log("error while updating refreshed playlist record");
                return null;
              }

              numberOfPlaylistsUpaded++;
            }
          }
        }
      }

      return numberOfPlaylistsUpaded === 0
        ? "There are no playlists that need to be updated!"
        : `Successfully refreshed ${numberOfPlaylistsUpaded} playlists!`;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async UpdateRefreshedPlaylist(playlistSupdabaseID: number) {
    // udpates playlist record with new playlist data

    try {
      const { data, error } = await supabase
        .from("playlists")
        .select("*")
        .eq("id", playlistSupdabaseID)
        .single();

      if (error) {
        console.log(error);
        return null;
      }

      const newRefreshAt = new Date();
      newRefreshAt.setHours(
        newRefreshAt.getHours() + data.refresh_frequency_hrs
      );

      const { error: error2 } = await supabase
        .from("playlists")
        .update({
          next_refresh_at: newRefreshAt.toISOString(),
          last_refresh_at: new Date().toISOString(),
        })
        .eq("id", playlistSupdabaseID);

      if (error2) {
        console.log(error2);

        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async UpdatePlaylist(
    playlistID: number,
    updateObj: Partial<DB_Playlist>
  ) {
    try {
      // generate the unique object to update
      // not every update will include every column, so filter
      // what needs to be udpated

      const { error } = await supabase
        .from("playlists")
        .update(updateObj)
        .eq("id", playlistID);

      if (error) {
        console.log(error);
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
