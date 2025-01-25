// this splat route is very important
// takes users to the following:
/*
  - gov level page (/state)
  - gov positions page (/state/governor)
  - politician page (/state/governor/mark_gordon)
*/
// can't figure out how this stupid fucking remix routing works so this will have to do

import { Container } from "@mantine/core";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import type { LoaderFunctionArgs } from "react-router";
import { AppContextProvider } from "~/context/PoliticianPageContext";
import {
  GetGovLevelIndividuals,
  GetGovPositionIndividuals,
  GetPoliticianPageData,
} from "~/serverUtilts";

import type {
  GovernmentLevelPageData,
  GovernmentPositionPageData,
  PoliticianPageData,
} from "~/types";

import GovernmentLevelsPage from "~/views/GovernmentLevelsPage";
import GovernmentPositionsPage from "~/views/GovernmentPositionsPage";
import PoliticianPage from "~/views/PoliticianPage";

interface ReturnPage {
  view: "gov_levels" | "gov_positions" | "politician_page";
  pageData:
    | PoliticianPageData
    | GovernmentPositionPageData
    | GovernmentLevelPageData;
  user: User | null;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const filePath = params["*"];
  if (filePath === undefined) {
    throw new Response(null, {
      status: 500,
      statusText: "Error while getting data",
    });
  }

  const paths = filePath
    .trim()
    .split("/")
    .filter((x) => x !== "");

  let PAGE_DATA: ReturnPage | null = null;

  const supabaseServer = createServerClient(
    "https://elsxssomogmdzputaijs.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsc3hzc29tb2dtZHpwdXRhaWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA4NjgwNzAsImV4cCI6MjA0NjQ0NDA3MH0.Br2TzV9lOuyqvr68BK9r5dPYUCNI0uAjyTj9Pl7tdLM",
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );
  const user = await supabaseServer.auth.getUser();

  switch (paths.length) {
    // gov level page
    case 1: {
      const pageData = await GetGovLevelIndividuals(paths[0]);

      if (pageData === null) {
        throw new Response(null, {
          status: 500,
          statusText: "Error while getting data",
        });
      }

      PAGE_DATA = { view: "gov_levels", pageData, user: user.data.user };
      return PAGE_DATA;
    }

    // gov positions page
    case 2: {
      const pageData = await GetGovPositionIndividuals(paths[1]);
      if (pageData === null) {
        throw new Response(null, {
          status: 500,
          statusText: "Error while getting data",
        });
      }

      PAGE_DATA = {
        view: "gov_positions",
        pageData,
        user: user.data.user,
      };
      return PAGE_DATA;
    }

    // politician page
    case 3: {
      const pageData = await GetPoliticianPageData(
        paths[0],
        paths[1],
        paths[2],
        user.data.user?.id ?? null
      );

      if (pageData === null) {
        throw new Response(null, {
          status: 500,
          statusText: "Error while getting data",
        });
      }
      if (pageData === "404") {
        throw new Response(null, {
          status: 404,
          statusText: "Not Found",
        });
      }

      PAGE_DATA = {
        view: "politician_page",
        pageData,
        user: user.data.user,
      };
      return PAGE_DATA;
    }

    default: {
      return null;
    }
  }
}

export function meta({ data }: { data: ReturnPage }) {
  switch (data.view) {
    case "gov_levels":
      data.pageData = data.pageData as GovernmentLevelPageData;
      return [
        {
          title: data.pageData.gov_level_name! + " Politicians | Politifools",
        },
      ];

    case "gov_positions":
      data.pageData = data.pageData as GovernmentPositionPageData;
      return [
        {
          title: data.pageData.title! + " Politicians | Politifools",
        },
      ];

    case "politician_page":
      data.pageData = data.pageData as PoliticianPageData;
      return [
        {
          title: data.pageData.name! + " | Politifools",
        },
      ];
  }
}

export default function Splat({
  loaderData,
}: {
  loaderData: ReturnPage | null;
}) {
  return (
    <>
      {loaderData === null && (
        <p>There was an error while rendering this page</p>
      )}
      {loaderData !== null && (
        <>
          {loaderData.view === "politician_page" && (
            <AppContextProvider
              backendData={loaderData.pageData as PoliticianPageData}
              userData={loaderData.user}
            >
              <PoliticianPage />
            </AppContextProvider>
          )}
          {loaderData.view === "gov_positions" && (
            <GovernmentPositionsPage
              pageData={loaderData.pageData as GovernmentPositionPageData}
            />
          )}
          {loaderData.view === "gov_levels" && (
            <GovernmentLevelsPage
              pageData={loaderData.pageData as GovernmentLevelPageData}
            />
          )}
        </>
      )}
    </>
  );
}
