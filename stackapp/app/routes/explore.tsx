import { getSession } from "~/utils/sessions";
import exploreCss from "../styles/explore.css";
import { GetExplorePageStacks, IsSignedIn } from "~/utils/functions.server";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import ExploreGrid from "~/components/explore/Grid";
import { Stack } from "~/models/stack";
import { UserProfile } from "~/models/profile";

export function links() {
  return [{ rel: "stylesheet", href: exploreCss }];
}

interface LoaderData {
  isSignedIn: boolean;
  profileImg: string | null;
  recentStacks:
    | {
        stackData: Stack;
        githubProfileData: UserProfile;
        techUsedDisplay: string[] | null;
      }[]
    | null;
}

export default function Explore() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <>
      <main>
        <Nav
          isSignedIn={loaderData.isSignedIn}
          profileImg={loaderData.profileImg}
        />

        <div className="container" style={{ width: "100%" }}>
          {loaderData.recentStacks === null && (
            <p>There was an error while getting recently created stacks</p>
          )}
          {loaderData.recentStacks !== null && (
            <>
              {loaderData.recentStacks.length === 0 && (
                <p>There are no Stacks at this time</p>
              )}
              {loaderData.recentStacks.length > 0 && (
                <ExploreGrid recentStacks={loaderData.recentStacks} />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));

  let returnData: LoaderData;

  if (account === null) {
    returnData = {
      isSignedIn: false,
      profileImg: null,
      recentStacks: await GetExplorePageStacks(),
    };

    return json(returnData);
  }

  returnData = {
    isSignedIn: true,
    profileImg: account.profile_img,
    recentStacks: await GetExplorePageStacks(),
  };

  return json(returnData);
}

export const meta: MetaFunction = () => {
  return [
    { title: "Explore Application's Tech Stacks - Stackapp" },
    {
      name: "description",
      content:
        "Explore diverse tech stacks. Uncover databases, languages, APIs, frameworks, and construction insights from fellow Stackapp creators.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://stackapp.xyz/explore",
    },
    {
      property: "og:title",
      content: "Explore Stacks Made by the Community",
    },
    {
      property: "og:url",
      content: "https://stackapp.xyz/explore",
    },
    {
      property: "og:description",
      content:
        "Explore diverse tech stacks. Uncover databases, languages, APIs, frameworks, and construction insights from fellow Stackapp creators.",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: "Explore Stacks",
    },
    {
      name: "twitter:description",
      content:
        "Explore diverse tech stacks. Uncover databases, languages, APIs, frameworks, and construction insights from fellow Stackapp creators.",
    },
  ];
};
