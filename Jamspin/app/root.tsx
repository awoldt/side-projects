import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { destroySession, getSession } from "./utils.server";
import { Db } from "./class/Db.server";
import { Playlist, IndexPageData, AppContext } from "./types";
import { useState } from "react";

import styles from "./styles/tailwind.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles/index.css" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const backendData = useLoaderData<IndexPageData>();

  const [playlistData, setPlaylistData] = useState<Playlist[] | null>(
    backendData.playlistData
  );
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [playlistBeingEdited, setPlaylistBeingEdited] =
    useState<Playlist | null>(null);

  const APP_CONTEXT: AppContext = {
    ...backendData,
    playlistData,
    showCreatePlaylistModal,
    playlistBeingEdited,
    setPlaylistBeingEdited,
    setPlaylistData,
    setShowCreatePlaylistModal,
  };

  return <Outlet context={APP_CONTEXT} />;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const validUser = await Db.AuthenticateUser(session);

  const PAGEDATA: IndexPageData = {
    userDetails: validUser,
    playlistData:
      validUser === null ? null : await Db.GetPlaylistData(validUser),
    spotifyClientID: validUser === null ? process.env.SPOTIFY_CLIENT_ID! : null,
    spotifyRedirectURI:
      validUser === null ? process.env.SPOTIFY_REDIRECT_URI! : null,
  };

  if (!validUser) {
    // remove cookie if valid user is null
    return json(PAGEDATA, {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  return json(PAGEDATA);
}
