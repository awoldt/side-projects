import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Links, Meta, useLoaderData } from "@remix-run/react";
import {
  GetAllUsersStacks,
  GetProfileData,
  IsSignedIn,
} from "~/utils/functions.server";
import { getSession } from "~/utils/sessions";

import profileStyling from "../styles/profile.css";
import ProfileGrid from "~/components/profile/Grid";
import { UserProfile } from "~/models/profile";
import { Stack } from "~/models/stack";
import PublicProfileHeader from "../components/profile/PublicHeader";
import Nav from "~/components/Nav";

export function links() {
  return [{ rel: "stylesheet", href: profileStyling }];
}

interface LoaderData {
  profileData: UserProfile;
  stacks:
    | {
        stackData: Stack;
        techUsedDisplay: string[] | null;
      }[]
    | null;
  profileImg: string | null;
}

export default function PublicProfilePage() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <>
      <main>
        <Nav isSignedIn={true} profileImg={loaderData.profileImg} />
        <div className="container">
          <PublicProfileHeader profileData={loaderData.profileData} />
          {loaderData.stacks && (
            <>
              {loaderData.stacks.length === 0 && (
                <p>User has not created any stacks yet</p>
              )}
              {loaderData.stacks.length === 1 && <p>1 Stack created</p>}
              {loaderData.stacks.length > 1 && (
                <p>{loaderData.stacks.length} Stacks created</p>
              )}
            </>
          )}

          <ProfileGrid stacks={loaderData.stacks} />
        </div>
      </main>
    </>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));

  const profileID = params.profile_id;

  const profile = await GetProfileData(profileID);
  if (profile === null) {
    throw new Response(null, {
      status: 404,
    });
  }

  // if person signed in is attempting to view their profile
  // redirect to profile page
  if (account !== null) {
    if (profile._id.toString() === account._id.toString()) {
      return redirect("/profile");
    }
  }

  const returnData: LoaderData = {
    profileData: profile,
    stacks: await GetAllUsersStacks(profile._id.toString()),
    profileImg: account === null ? null : account.profile_img,
  };

  return returnData;
}

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body style={{ padding: "100px 0px 0px 25px" }}>
        <h1>Profile does not exist</h1>
        <a href="/">Return to homepage</a>
      </body>
    </html>
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data) {
    return [
      { title: `@${data.profileData.username} | Stackapp` },
      {
        name: "description",
        content: `Explore ${
          data.profileData.name ?? `@${data.profileData.username}`
        } application's tech stacks including programming languages, databases, apis, frameworks, and more.`,
      },
      {
        tagName: "link",
        rel: "canonical",
        href: `https://stackapp.xyz/profile/${data.profileData.public_id}`,
      },
      {
        property: "og:title",
        content: `Explore ${
          data.profileData.name ?? `@${data.profileData.username}`
        } application's tech stacks`,
      },
      {
        property: "og:url",
        content: `https://stackapp.xyz/profile/${data.profileData.public_id}`,
      },
      {
        property: "og:description",
        content: `Explore @${data.profileData.username}'s tech stacks`,
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:title",
        content: `Explore ${
          data.profileData.name ?? `@${data.profileData.username}`
        } application's tech stacks`,
      },
      {
        name: "twitter:description",
        content: `Explore @${data.profileData.username}'s tech stacks`,
      },
    ];
  }

  return [{ title: "Profile" }];
};
