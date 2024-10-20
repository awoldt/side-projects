import { json, ActionFunction } from "@remix-run/node";

import { getSession, commitSession } from "../sessions.server";
import { SupabaseService } from "../services/Supabase.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const { email, password } = await request.json();
    if (
      email === undefined ||
      email === "" ||
      password === undefined ||
      password === ""
    ) {
      return json("Missing email and password", { status: 400 });
    }

    // get user record
    const user = await SupabaseService.SignIn(email, password);
    if (user === null)
      return json("Error while getting user record", { status: 500 });

    console.log(user);
    

    // save cookie to browser
    // cookie value is the id of the auth user record
    const session = await getSession(request.headers.get("Cookie"));
    session.set("__session", user.user.id);

    return json("Successfully signed in", {
      status: 200,
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return json(error, { status: 500 });
  }
};
