import { ActionFunctionArgs, json } from "@remix-run/node";
import { supabase } from "~/class/Db.server";
import { Spotify } from "~/class/Spotify.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();

    const {
      genres,
      spotifyUserID,
      userID,
      spotifyTokenDetails,
      playlistTitle,
      refreshFrequency,
      numOfSongs,
    } = body;

    if (
      genres === undefined ||
      genres.length === 0 ||
      spotifyUserID === undefined ||
      spotifyTokenDetails === undefined ||
      userID === undefined ||
      playlistTitle === undefined ||
      refreshFrequency === undefined ||
      numOfSongs === undefined
    ) {
      return json({ message: "Bad request" }, { status: 400 });
    }

    // make sure user does not have more than 10 playlists
    const { data, error } = await supabase
      .from("users")
      .select("playlists(*)")
      .eq("id", userID);

    if (error) {
      console.log(error);
      return json({ message: "Error on server" }, { status: 500 });
    }
    if (data[0].playlists.length >= 10) {
      return json(
        { message: "You cannot create anymore playlists" },
        { status: 400 }
      );
    }

    const userAccessToken = await Spotify.RefreshToken(
      spotifyTokenDetails.refreshToken,
      userID,
      spotifyTokenDetails.expiresAt,
      spotifyTokenDetails.accessToken
    );
    if (userAccessToken === null) {
      return null;
    }

    // create playlist
    const newPlaylist = await Spotify.CreatePlaylist(
      playlistTitle,
      userID,
      genres,
      userAccessToken.accessToken,
      refreshFrequency,
      numOfSongs,
      spotifyUserID
    );

    if (newPlaylist === null) {
      return json(
        { message: "Error while creating playlist" },
        { status: 500 }
      );
    }

    return json({
      message: "Successfully created playlist",
      data: newPlaylist,
    });
  } catch (error) {
    console.log(error);
    return json({ message: "Error while creating playlist" }, { status: 500 });
  }
}
