import { ActionFunctionArgs, json } from "@remix-run/node";
import { Db } from "~/class/Db.server";
import { Spotify } from "~/class/Spotify.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();

    const {
      title,
      genres,
      numOfSongs,
      userTokenDetails,
      userID,
      spotifyPlaylistID,
      playlistID,
    } = body;

    if (
      title === undefined ||
      genres === undefined ||
      numOfSongs === undefined ||
      userTokenDetails === undefined ||
      userID === undefined ||
      spotifyPlaylistID === undefined ||
      playlistID === undefined
    ) {
      return json({ message: "Bad request" }, { status: 400 });
    }

    const token = await Spotify.RefreshToken(
      userTokenDetails.refreshToken,
      userID,
      userTokenDetails.expiresAt,
      userTokenDetails.accessToken
    );
    if (token === null) {
      return json({ message: "Error on server" }, { status: 500 });
    }

    // update details on spotify
    const updateSpotifyDetails = await Spotify.UpdatePlaylist(
      title,
      token.accessToken,
      spotifyPlaylistID
    );

    if (updateSpotifyDetails === null) {
      return json(
        { message: "Error while updating data on spotify" },
        { status: 500 }
      );
    }

    // update playlist record in database
    const updateDbDetails = await Db.UpdatePlaylist(playlistID, {
      genres,
      num_of_songs: numOfSongs,
    });
    if (updateDbDetails === null) {
      return json(
        { message: "Error while updating playlist details in database" },
        { status: 500 }
      );
    }

    return json({
      message: "Successfully created playlist",
      data: "asdf",
    });
  } catch (error) {
    console.log(error);
    return json({ message: "Error while creating playlist" }, { status: 500 });
  }
}
