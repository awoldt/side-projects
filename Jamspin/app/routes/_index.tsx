import { type MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import SignedOut from "~/components/_index/SignedOut";
import SignedIn from "~/components/_index/SignedIn";
import { AppContext } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "JamSpin - Auto-Refreshing Personalized Spotify Playlists" },
    {
      name: "description",
      content:
        "JamSpin creates personalized Spotify playlists that automatically refresh with new tracks based on the genres you select. Choose up to 5 genres and enjoy fresh music delivered to your playlist daily, weekly, or monthly.",
    },
  ];
};

export default function Index() {
  const context = useOutletContext<AppContext>();

  return (
    <div style={{ padding: "0px", display: "flex", flexDirection: "column" }}>
      {context.userDetails !== null && <SignedIn />}
      {context.userDetails === null && <SignedOut />}
    </div>
  );
}
