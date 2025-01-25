import { ActionFunctionArgs, json } from "@remix-run/node";
import { Db } from "~/class/Db.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const body = await request.json();
    const { refresh_playlist_key } = body;
    if (
      refresh_playlist_key === undefined ||
      refresh_playlist_key !== process.env.REFRESH_PLAYLIST_KEY
    ) {
      return json({ message: "Bad request" }, { status: 400 });
    }
    const refresh = await Db.RefreshPlaylists();
    if (refresh === null) {
      return json(
        { message: "Error while refreshing playlists" },
        { status: 500 }
      );
    }

    return json({
      message: refresh,
    });
  } catch (error) {
    console.log(error);
    return json(
      { message: "Error while refreshing playlists" },
      { status: 500 }
    );
  }
}
