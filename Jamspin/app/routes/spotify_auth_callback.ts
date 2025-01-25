import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";

import { getSession, commitSession } from "../utils.server";
import { Db } from "~/class/Db.server";
import { Spotify } from "~/class/Spotify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const code = new URL(request.url).searchParams.get("code");

  if (code === null) {
    return json(
      {
        msg: "bad request",
      },
      { status: 400 }
    );
  }

  const token = await Spotify.ExchangeAccessToken(code);
  if (token === null) {
    return json(
      {
        msg: "bad request",
      },
      { status: 500 }
    );
  }

  const newUser = await Db.CreateUser(
    token.access_token,
    token.refresh_token,
    Date.now() + token.expires_in * 1000
  );

  if (newUser === null) {
    return json(
      {
        msg: "bad request",
      },
      { status: 500 }
    );
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", newUser);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
