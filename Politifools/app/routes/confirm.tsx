import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

import type { LoaderFunctionArgs } from "react-router";
import { serverDb, supabase } from "~/serverDB";

export async function loader({ request }: LoaderFunctionArgs) {
  console.log(request);

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.error("No confirmation code found.");
    return null;
  }

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

  const { data, error } = await supabaseServer.auth.exchangeCodeForSession(
    code
  );

  if (error) {
    console.error("Error while exchanging code for session");
    return null;
  }

  // attempt at max 100 tries to generate a unique public url for the user
  // if it cant happen (fucking impossible), break out of loop and return error
  let success = false;
  for (let attempts = 0; attempts < 100; attempts++) {
    // generate unique public url for user
    // 6 digit random number
    let str = "";
    for (let i = 0; i < 6; i++) {
      str += String(Math.floor(Math.random() * 10));
    }

    // now see if this public url exists alread
    const existingUser = await serverDb.query(
      `
        SELECT * FROM auth.users
        WHERE raw_user_meta_data->>'public_profile_url' = $1;        
        `,
      [str]
    );

    if (existingUser.rowCount === 0) {
      // PUBLIC URL DOESNT EXIST! WHAT WE WANT
      // BREAK OUT OF LOOP

      await supabase.auth.admin.updateUserById(data.user.id, {
        user_metadata: {
          public_profile_url: str,
        },
      });
      success = true;
      break;
    }
  }

  if (!success) {
    return new Response("Could not generate a unqiue public url", {
      status: 500,
    });
  }

  return true;
}

export default function Page({ loaderData }: { loaderData: true | null }) {
  return (
    <>
      {loaderData === true && <p>Account successfully created!</p>}
      {loaderData === null && <p>Could not create account</p>}
    </>
  );
}
