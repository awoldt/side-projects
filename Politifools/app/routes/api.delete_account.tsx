/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export const action = async ({ request }: { request: Request }) => {
  console.log(request);

  try {
    const supabaseServer = createServerClient(
      "https://elsxssomogmdzputaijs.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsc3hzc29tb2dtZHpwdXRhaWpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMDg2ODA3MCwiZXhwIjoyMDQ2NDQ0MDcwfQ.rroJRU9iJILytAYyZ2NeWHijLjEKtDYD97FrB_o4u5w",
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
    const { userID } = body;

    // delete all likes
    await supabaseServer.from("likes").delete().eq("fk_user_id", userID);
    // delete all comments
    await supabaseServer.from("comments").delete().eq("fk_user_id", userID);

    // delete actual account
    await supabaseServer.auth.admin.deleteUser(userID);

    return new Response("Deleted account!", { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(error.toString(), { status: 500 });
  }
};
