import Nav from "~/components/Nav";
import StackHeader from "~/components/stackpage/Header";
import Thumbnails from "~/components/stackpage/Thumbnails";
import MoreStacks from "~/components/stackpage/MoreStacks";

import styling from "../styles/stack_.$stack_id.css";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Links, Meta, useLoaderData } from "@remix-run/react";
import { getSession } from "~/utils/sessions";
import {
  GetMoreStacksByUser,
  GetStackData,
  IsSignedIn,
  StackDetails,
} from "~/utils/functions.server";
import { Stack } from "~/models/stack";

interface LoaderData {
  stackID: string;
  stackDetails: StackDetails | null;
  isUsersStack: boolean;
  isSignedIn: boolean;
  signedInUsersProfileImg: string | null;
  hasLikedStack: boolean;
  otherStacksByUser:
    | {
        stackData: Stack;
        techUsedDisplay: string[] | null;
      }[]
    | null;
  justCreated: boolean; // when user first creates new stack and redirected from create page
}

export default function Home() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <>
      <main>
        <Nav
          isSignedIn={loaderData.isSignedIn}
          profileImg={loaderData.signedInUsersProfileImg}
        />
        {loaderData.stackDetails === null && (
          <p>There was an error while fetching Stack data</p>
        )}
        {loaderData.stackDetails !== null && (
          <>
            <div className="container" style={{ paddingTop: "0rem" }}>
              <StackHeader
                isUsersStack={loaderData.isUsersStack}
                stackData={loaderData.stackDetails}
                hasLiked={loaderData.hasLikedStack}
                techDescriptions={loaderData.stackDetails.techDecriptions}
                isSignedIn={loaderData.isSignedIn}
              />
              <Thumbnails
                thumbnails={loaderData.stackDetails.stackData.thumbnails}
              />
              {loaderData.otherStacksByUser &&
                loaderData.otherStacksByUser.length > 0 && (
                  <MoreStacks
                    username={loaderData.stackDetails.profileData!.username}
                    stacks={loaderData.otherStacksByUser}
                  />
                )}

              {loaderData.justCreated && (
                <dialog open className="dialog">
                  <div className="dialogContent">
                    <p className="subtitle" style={{ opacity: 1 }}>
                      Stack regularly pulls information from GitHub
                      repositories, ensuring that all related content is kept
                      up-to-date with the latest GitHub changes. Expect a delay
                      of up to 30 minutes for any changes made on GitHub to be
                      fully integrated and reflected on the Stack website. This
                      delay might be due to scheduled synchronization intervals,
                      processing time, or other factors involved in the data
                      integration process. During this time frame, users should
                      anticipate that the website&apos;s data will gradually
                      align with the most recent updates from the GitHub
                      repositories.
                    </p>
                    <form method="dialog">
                      <button>
                        <img
                          src="/imgs/icons/x.svg"
                          alt="plus"
                          style={{ width: "10px" }}
                        />
                      </button>
                    </form>
                  </div>
                </dialog>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export function links() {
  return [{ rel: "stylesheet", href: styling }];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const stackID = params.stack_id;
  if (stackID === undefined) {
    throw new Response(null, {
      status: 404,
    });
  }

  const stackDetails = await GetStackData(stackID);
  if (stackDetails === null) {
    throw new Response(null, {
      status: 500,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));

  const isUsersStack =
    account === null
      ? false
      : String(account._id) === stackDetails.stackData.aid
      ? true
      : false;

  const hasLikedStack = isUsersStack
    ? false
    : account?.liked_stacks.includes(stackID)
    ? true
    : false;

  const returnData: LoaderData = {
    stackID: stackID,
    stackDetails: stackDetails,
    isUsersStack: isUsersStack,
    isSignedIn: account === null ? false : true,
    signedInUsersProfileImg: account === null ? null : account.profile_img,
    otherStacksByUser: await GetMoreStacksByUser(
      stackDetails.stackData.aid,
      stackID
    ),
    hasLikedStack: hasLikedStack,
    justCreated: new URL(request.url).searchParams.get("success")
      ? true
      : false,
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
        <Nav isSignedIn={false} profileImg={null} />
        <h1>Stack not found :(</h1>
      </body>
    </html>
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data) {
    return [
      {
        title: `${data.stackDetails?.stackData.repo_name} Tech Stack | Stackapp`,
      },
      {
        name: "description",
        content: `Discover the technology used to build ${data.stackDetails?.stackData.repo_name} from user @${data.stackDetails?.profileData?.username} - including programming languages, databases, APIs and more.`,
      },
      {
        tagName: "link",
        rel: "canonical",
        href: `https://stackapp.xyz/stack/${data.stackDetails?.stackData._id}`,
      },
      {
        property: "og:title",
        content: `${data.stackDetails?.stackData.repo_name} Tech Stack | Stackapp`,
      },
      {
        property: "og:url",
        content: `https://stackapp.xyz/stack/${data.stackDetails?.stackData._id}`,
      },
      {
        property: "og:description",
        content: `Discover the technology used to build ${data.stackDetails?.stackData.repo_name} from user @${data.stackDetails?.profileData?.username} - including programming languages, databases, APIs and more.`,
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:title",
        content: `${data.stackDetails?.stackData.repo_name} Tech Stack | Stackapp`,
      },
      {
        name: "twitter:description",
        content: `Discover the technology used to build ${data.stackDetails?.stackData.repo_name} from user @${data.stackDetails?.profileData?.username} - including programming languages, databases, APIs and more.`,
      },
    ];
  }

  return [{ title: "Stack Page" }];
};
