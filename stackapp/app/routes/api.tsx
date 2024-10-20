/* eslint-disable no-case-declarations */

/* 
    This route handles all the requests made to the Stackapp api
*/

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { ObjectId } from "mongodb";
import { accountsCollection, stacksCollection } from "~/utils/db.server";
import {
  CreateNewAccount,
  CreateStack,
  DeleteProfile,
  DeleteStack,
  EditStack,
  IsSignedIn,
} from "~/utils/functions.server";
import { commitSession, destroySession, getSession } from "~/utils/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));

  const action = new URL(request.url).searchParams.get("action");
  if (action === null) {
    return new Response("Bad request", { status: 400 });
  }

  switch (action) {
    case "authenticate_github":
      if (account !== null) return redirect("/profile");

      // take code query from url query github sends
      const code = new URL(request.url).searchParams.get("code");
      if (code === null) {
        return json(
          { message: "Error getting GitHub code url query" },
          { status: 400 }
        );
      }

      const newAccount = await CreateNewAccount(
        process.env.GITHUB_CLIENT_ID!,
        process.env.GITHUB_CLIENT_SECRET!,
        code
      );
      if (newAccount === null) {
        return json(
          {
            message:
              "Error while creating new Stack account with GitHub connection",
          },
          { status: 400 }
        );
      }

      if (newAccount?.status === "github_account_already_in_use") {
        // ACCOUNT ALREADY EXISTS WITH THIS GITHUB ID
        // SEND ACCOUNT COOKIE
        session.set("a_id", String(newAccount.data));
        return redirect("/profile", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      } else {
        // NEW ACCOUNT CREATED
        session.set("a_id", String(newAccount.data));
        return redirect("/profile", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }

    default:
      return json(
        {
          message: "Bad request",
        },
        { status: 400 }
      );
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));
  if (account === null) {
    return json(
      { message: "Must be signed in to create a stack" },
      { status: 400 }
    );
  }

  const action = new URL(request.url).searchParams.get("action");
  if (action === null) {
    return json({ message: "Bad request", status: 500 });
  }

  const stackID = new URL(request.url).searchParams.get("stack_id");

  switch (action) {
    case "create_stack":
      // cannot create new stack if github profile data is null or undefined
      if (account === null) {
        return json({
          message:
            "There was an error while creating new stack, need github username to fetch repo data",
          staus: 500,
        });
      }

      const data = await request.formData();
      const newStack = await CreateStack(
        data,
        account._id.toString(),
        account.github_access_token,
        account.username
      );
      if (newStack === null) {
        return json(
          { message: "There was an error while creating new stack" },
          { status: 500 }
        );
      }

      return json({
        status: 200,
        message: "Stack successfully created!",
        stackId: newStack,
      });

    case "delete_stack":
      if (stackID === null) {
        return json({ message: "Bad request", status: 400 });
      }

      // make sure stack attemping to be deleted belongs to user signed in
      const stack = await stacksCollection.findOne({
        _id: new ObjectId(stackID),
      });
      if (stack === null) {
        return json({ message: "Bad request", status: 400 });
      }
      if (stack.aid !== account._id.toString()) {
        return json({ message: "Bad request", status: 400 });
      }

      const deletedStack = await DeleteStack(stack, stackID);
      if (deletedStack === null) {
        return json({
          message: "There was an error while deleting stack",
          status: 500,
        });
      }
      if (!deletedStack.acknowledged) {
        return json({
          message: "There was an error while deleting stack",
          status: 500,
        });
      }

      return json({
        status: 200,
        message: "Stack successfully deleted!",
      });

    case "delete_profile":
      if (account === null) {
        return json({ message: "Error while deleting stack" }, { status: 400 });
      }

      const deltedAccount = await DeleteProfile(account._id.toString());
      if (!deltedAccount?.acknowledged) {
        return json({
          message: "There was an error while deleting account",
          status: 500,
        });
      }

      return new Response(
        JSON.stringify({
          status: 200,
          message: "Account successfully deleted!",
        }),
        {
          status: 200,
          headers: {
            "Set-Cookie": await destroySession(session),
            "Content-Type": "application/json",
          },
        }
      );

    case "like_stack":
      if (stackID === null) {
        return json({ message: "Stack does not exist", status: 400 });
      }

      const likedStack = await stacksCollection.updateOne(
        { _id: new ObjectId(stackID!) },
        {
          $inc: { likes: 1 },
        }
      );
      if (!likedStack.acknowledged) {
        return json({ message: "Error while liking stack", status: 500 });
      }

      // add liked stacks to users liked stack array
      await accountsCollection.updateOne(
        { _id: new ObjectId(account._id) },
        {
          $push: { liked_stacks: stackID },
        }
      );

      return json({ message: "Successfully liked stack!", status: 200 });

    case "unlike_stack":
      if (stackID === null) {
        return json({ message: "Stack does not exist", status: 400 });
      }

      const unlikedStack = await stacksCollection.updateOne(
        { _id: new ObjectId(stackID!) },
        {
          $inc: { likes: -1 },
        }
      );
      if (!unlikedStack.acknowledged) {
        return json({ message: "Error while unliking stack", status: 500 });
      }

      // remove liked stack from users account
      await accountsCollection.updateOne(
        { _id: new ObjectId(account._id) },
        {
          $pull: { liked_stacks: stackID },
        }
      );

      return json({ message: "Successfully unliked stack!", status: 200 });

    case "edit_stack":
      if (stackID === null) {
        return json({ message: "Stack does not exist", status: 400 });
      }
      const data2 = await request.formData();
      const editStack = await EditStack(data2, stackID);
      return editStack
        ? json({ message: "Successfully unliked stack!", status: 200 })
        : json({ message: "Error while editing stack", status: 500 });

    default:
      return json({ message: "Bad request", status: 400 });
  }
}
