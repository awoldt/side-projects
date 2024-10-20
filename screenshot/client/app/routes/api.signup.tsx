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

    // create new supabase auth user
    const newAuthUser = await SupabaseService.CreateUser(email, password);
    if (newAuthUser === null || newAuthUser.user === null)
      return json("Error while making new user in auth table", { status: 500 });

    // now insert into the users table
    const newUser = await SupabaseService.InsertRecord("users", {
      created_at: newAuthUser.user.created_at,
      fk_authuser_id: newAuthUser.user.id,
    });
    if (newUser === null)
      return json("Error while inserting new user into users table", {
        status: 500,
      });

    // save cookie to browser
    // cookie value is the id of the auth user record
    const session = await getSession(request.headers.get("Cookie"));
    session.set("__session", newAuthUser.user.id);

    return json("Successfully created new user!", {
      status: 200,
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.log(error);

    return json(error, { status: 500 });
  }
};
