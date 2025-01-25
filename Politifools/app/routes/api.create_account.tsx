/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { serverDb } from "~/serverDB";

interface FormData {
  t: string;
  rt: string;
}

export const action = async ({ request }: { request: Request }) => {
  try {
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

    const body = await request.json();
    const formData: FormData = body;

    // validate this user by the access token
    const { data, error } = await supabaseServer.auth.getUser(formData.t);
    if (error) {
      console.log("Not a legit access token");
      return new Response("Not a legit access token", { status: 400 });
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

        await supabaseServer.auth.admin.updateUserById(data.user.id, {
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

    return new Response("Account created!", { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(error.toString(), { status: 500 });
  }
};
