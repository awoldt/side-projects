import { ActionFunctionArgs, json } from "@remix-run/node";
import { Db } from "~/class/Db.server";
import { Spotify } from "~/class/Spotify.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();

    const { playlistID, userAccessToken, userID } = body;

    if (
      playlistID === undefined ||
      userAccessToken === undefined ||
      userID === undefined
    ) {
      return json(
        {
          message: "Bad request",
        },
        { status: 400 }
      );
    }

    const token = await Spotify.RefreshToken(
      userAccessToken.refreshToken,
      userID,
      userAccessToken.expiresAt,
      userAccessToken.accessToken
    );
    if (token === null) {
      return json(
        {
          message: "Error on server",
        },
        { status: 500 }
      );
    }

    // remove playlist from user's spotify library
    const removedPlaylist = await Spotify.DeletePlaylist(
      playlistID,
      token.accessToken
    );
    if (removedPlaylist === null) {
      return json(
        {
          message: "Bad request",
        },
        { status: 400 }
      );
    }

    // now delete playlist from db
    const deletedRecord = await Db.DeletePlaylist(playlistID);
    if (deletedRecord === null) {
      return json(
        {
          message: "Bad request",
        },
        { status: 400 }
      );
    }

    return json({
      message: "Successfully deleted playlist",
      playlistID,
    });
  } catch (error) {
    console.log(error);
    return json({ message: "Error while creating playlist" }, { status: 500 });
  }
}
