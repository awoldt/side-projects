import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import {
  GetAllUsersStacks,
  GetUsersLikedStacks,
  IsSignedIn,
} from "~/utils/functions.server";
import { getSession } from "~/utils/sessions";

import profileStyling from "../styles/profile.css";
import ProfileHeader from "~/components/profile/Header";
import ProfileGrid from "~/components/profile/Grid";
import { UserProfile } from "~/models/profile";
import { Stack } from "~/models/stack";
import { useState } from "react";
import LikedGrid from "~/components/profile/LikedGrid";

export function links() {
  return [{ rel: "stylesheet", href: profileStyling }];
}

interface LoaderData {
  profileData: UserProfile | null;
  userStacks:
    | {
        stackData: Stack;
        techUsedDisplay: string[] | null;
      }[]
    | null;
  userLikedStacks:
    | {
        stackData: Stack;
        techUsedDisplay: string[] | null;
      }[]
    | null
    | "no_liked_stacks";
}

export default function ProfilePage() {
  const loaderData = useLoaderData<LoaderData>();

  const [view, setView] = useState<"your_stacks" | "liked_stacks">(
    "your_stacks"
  );

  return (
    <>
      <main>
        {loaderData.profileData === null && (
          <p>There was an error while fetching profile data</p>
        )}
        {loaderData.profileData !== null && (
          <>
            <Nav
              isSignedIn={true}
              profileImg={loaderData.profileData.profile_img}
            />

            <div className="container">
              <ProfileHeader
                profileData={loaderData.profileData}
                viewData={[view, setView]}
              />

              {view === "your_stacks" && (
                <>
                  {loaderData.userStacks === null && (
                    <p>There was an error while fetching your stacks</p>
                  )}
                  {loaderData.userStacks !== null && (
                    <>
                      <ProfileGrid stacks={loaderData.userStacks} />
                    </>
                  )}
                </>
              )}
              {view === "liked_stacks" && (
                <>
                  <LikedGrid stacks={loaderData.userLikedStacks} />
                </>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));
  if (account === null) {
    return redirect("/signin");
  }

  const returnData: LoaderData = {
    profileData: account,
    userStacks: await GetAllUsersStacks(account._id.toString()),
    userLikedStacks: await GetUsersLikedStacks(account._id.toString()),
  };

  return returnData;
}

export const meta: MetaFunction = () => {
  return [{ title: "Profile" }, { name: "robots", content: "noindex" }];
};
