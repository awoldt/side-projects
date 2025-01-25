/* eslint-disable @typescript-eslint/no-explicit-any */
import { Playlist, SpotifyTokenDetails } from "~/types";
import { Db } from "./Db.server";

export class Spotify {
  static async ExchangeAccessToken(code: string) {
    try {
      const req = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.SPOTIFY_AUTH_HEADER}`,
        },
        body: new URLSearchParams({
          code: code,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
          grant_type: "authorization_code",
        }),
      });
      if (!req.ok) {
        console.log("error while getting spotify access token");

        return null;
      }

      const res: {
        access_token: string;
        expires_in: number;
        refresh_token: string;
      } = await req.json();

      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async CreatePlaylist(
    playlistTitle: string,
    userID: number,
    genres: string[],
    userAccessToken: string,
    refreshFrequency: number,
    numOfSongs: number,
    usersSpotifyAccountID: string
  ): Promise<Playlist | null> {
    const playlistDescription =
      genres.length === 1
        ? `Mix of ${genres[0]} tracks`
        : `Mix of ${genres.slice(0, genres.length - 1).join(", ")} and ${
            genres[genres.length - 1]
          } tracks`;

    try {
      const newPlaylistReq = await fetch(
        `https://api.spotify.com/v1/users/${usersSpotifyAccountID}/playlists`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${userAccessToken}`,
          },
          body: JSON.stringify({
            name: playlistTitle,
            public: false,
            description: playlistDescription,
          }),
        }
      );
      const newPlaylistData = await newPlaylistReq.json();
      console.log(newPlaylistData);

      if (!newPlaylistReq.ok) {
        console.log("error while creating new playlist");
        return null;
      }

      // now we need to add songs to the playlist
      await Spotify.AddSongsToPlaylist(
        newPlaylistData.id,
        genres,
        userAccessToken,
        numOfSongs
      );

      // get the playlist image AFTER the tracks have been added
      // (there is no playlist thumbnail until tracks are added)
      const playlistImage = await Spotify.GetPlaylistImage(
        newPlaylistData.id,
        userAccessToken
      );
      if (playlistImage === null) {
        return null;
      }

      // save playlist details to datbase
      // associate with the user id in users table
      const savePlaylist = await Db.SavePlaylist(
        userID,
        genres,
        newPlaylistData.id,
        refreshFrequency,
        numOfSongs
      );
      if (savePlaylist === null) {
        return null;
      }

      return {
        id: savePlaylist.id,
        image: playlistImage,
        name: playlistTitle,
        description: savePlaylist.description,
        created_at: savePlaylist.created_at,
        next_refresh_at: savePlaylist.next_refresh_at,
        spotify_playlist_id: savePlaylist.spotify_playlist_id,
        refresh_frequency_hrs: savePlaylist.refresh_frequency_hrs,
        last_refresh_at: savePlaylist.last_refresh_at,
        num_of_songs: savePlaylist.num_of_songs,
        genres,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async RefreshToken(
    refreshToken: string,
    userID: number,
    expiresAt: number,
    accessToken: string
  ): Promise<SpotifyTokenDetails | null> {
    // THIS FUNCTION WILL RESFRESH TOKEN IF NEEDED!
    // MIGHT NOT NEED TO REFRESH TOKEN....
    if (Date.now() < expiresAt) {
      return {
        accessToken,
        refreshToken,
        expiresAt,
      };
    }
    // NEED TO REFRESH!
    else {
      try {
        const req = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${process.env.SPOTIFY_AUTH_HEADER!}`,
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID!,
          }),
        });
        const res = await req.json();

        if (!req.ok) {
          console.log("bad requset to fresh spotify token");
          return null;
        }

        // update user's account
        const newExpiresAt = Date.now() + res.expires_in * 1000;
        const updatedUser = await Db.UpdateUser(
          {
            spotify_access_token: res.access_token,
            spotify_refresh_token: res.refresh_token,
            spotify_access_token_expires_at_ms: newExpiresAt,
          },
          userID
        );
        if (updatedUser === null) {
          return null;
        }

        return {
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
          expiresAt: newExpiresAt,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  }

  static async AddSongsToPlaylist(
    playlistID: string,
    genres: string[],
    userAccessToken: string,
    numOfSongs: number
  ) {
    try {
      const req = await fetch(
        `https://api.spotify.com/v1/recommendations?${new URLSearchParams({
          seed_genres: genres.join(","),
          limit: numOfSongs.toString(),
        })}`,
        {
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        }
      );
      if (!req.ok) {
        console.log(
          "There was an error while getting songs to add to playlist"
        );
        return null;
      }

      const res = await req.json();

      const spotifySongsUris: string[] = res.tracks.map((x: any) => {
        return x.uri;
      });

      await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userAccessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          uris: spotifySongsUris,
        }),
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async DeletePlaylist(playlistID: string, accessToken: string) {
    try {
      const req = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}/followers
`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!req.ok) {
        console.log("error while removing playlist");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async GetPlaylistImage(playlistID: string, userAccessToken: string) {
    try {
      const req = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userAccessToken}`,
          },
        }
      );
      if (!req.ok) {
        console.log("error while getting playlist image");
        return null;
      }

      const res = await req.json();

      return res.images[0].url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async GetPlaylistTrackURIS(
    jamSpinAccessToken: string,
    playlistID: string
  ) {
    // returns all tracks on a playlist
    // only returns uri string

    try {
      const req = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}`,
        {
          headers: {
            Authorization: `Bearer ${jamSpinAccessToken}`,
          },
        }
      );
      const data = await req.json();

      if (!req.ok) {
        console.log("error while getting playlist details");
        return null;
      }

      return data.tracks.items.map((x: any) => {
        return {
          uri: x.track.uri,
        };
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async RemoveAllPlaylistTracks(
    playlistURIS: string[],
    playlistID: string,
    userAccessToken: SpotifyTokenDetails
  ) {
    try {
      const req = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userAccessToken.accessToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            tracks: playlistURIS,
          }),
        }
      );

      if (!req.ok) {
        console.log("error while remove all tracks from playlist");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async GetUsersPlaylists(userToken: string) {
    try {
      const req = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!req.ok) {
        console.log("bad request to get users playlists");
        return null;
      }

      const res = await req.json();

      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async UpdatePlaylist(
    title: string,
    userToken: string,
    spotifyPlaylistID: string
  ) {
    try {
      const req = await fetch(
        `https://api.spotify.com/v1/playlists/${spotifyPlaylistID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: title,
          }),
        }
      );
      if (!req.ok) {
        console.log("error while updating spotify playlist");
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
