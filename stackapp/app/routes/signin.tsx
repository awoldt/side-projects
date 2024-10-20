import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import { IsSignedIn } from "~/utils/functions.server";
import { getSession } from "~/utils/sessions";

export default function SignUpPage() {
  const githubClientId = useLoaderData<string>();

  return (
    <>
      <main style={{ alignItems: "center" }}>
        <Nav isSignedIn={false} profileImg={null} />
        <div className="content">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginBottom: "1rem",
                fontSize: "large",
              }}
            >
              <i className="fa-brands fa-github fa-2xl"></i>
            </div>
            <p>
              Stack is powered by GitHub.
              <br />
              Sign in with GitHub to start Stacking.
            </p>

            <a
              href={`https://github.com/login/oauth/authorize?client_id=${githubClientId}`}
              style={{
                border: "1px solid #171d1c40",
                marginTop: "1rem",
                marginBottom: "1rem",
                background: "white",
              }}
            >
              Sign In
            </a>
            <div>
              <p>New to GitHub?</p>
              <a
                href="https://github.com/signup"
                target="_blank"
                style={{ color: "blue", paddingLeft: "0.4rem" }}
                rel="noreferrer"
              >
                Create an Account.
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));
  if (account !== null) {
    return redirect("/profile");
  }

  return process.env.GITHUB_CLIENT_ID;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Sign in - Stackapp" },
    {
      name: "description",
      content:
        "Connect your GitHub and create a free Stackapp account. Use our integration with GitHub to display up-to-date information about your repositories.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://stackapp.xyz/signin",
    },
    {
      property: "og:title",
      content: "Sign in - Stackapp",
    },
    {
      property: "og:url",
      content: "https://stackapp.xyz/signin",
    },
    {
      property: "og:description",
      content:
        "Connect your GitHub and create a free Stackapp account. Use our integration with GitHub to display up-to-date information about your repositories.",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: "Sign in - Stackapp",
    },
    {
      name: "twitter:description",
      content:
        "Connect your GitHub and create a free Stackapp account. Use our integration with GitHub to display up-to-date information about your repositories.",
    },
  ];
};
