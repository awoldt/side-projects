import Head from "next/head";
import { useEffect, useState } from "react";
import { Container, Row, Col, ButtonGroup, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import CreateAccountForm from "../createAccountForm";
import LoginForm from "../loginForm";

export default function SignedOut({
  useSecureCookie,
}: {
  useSecureCookie: boolean;
}) {
  const [signInORUp, setSignInORUp] = useState<"signin" | "signup">("signup");
  const [cookies, setCookie, removeCookie] = useCookies(["account_id"]);

  useEffect(() => {
    removeCookie("account_id");
  }, []);

  return (
    <>
      <Head>
        <title>Social Hub</title>
        <link rel="icon" type="image/svg" href="/icons/logo.svg" />
        <meta
          name="description"
          content="Have all of your social media accounts connected into one single hub. Post to all of them with ease and security."
        ></meta>
      </Head>
      <Container
        style={{
          padding: "60px",
          borderRadius: "10px",
        }}
      >
        <h1 className="text-center">
          A Single Hub for All of Your Favorite Platforms
        </h1>
        <p
          style={{
            fontSize: "19px",
          }}
          className="text-center"
        >
          Easily share to all your favorite social media platforms without
          having to switch tabs or apps. All of your accounts are all connected
          at your finger tips. Connect your favorite platforms only once and
          begin posting!
        </p>
        <Row
          className="text-center"
          style={{
            marginBottom: "50px",
            backgroundColor: "rgb(214, 204, 194, .3)",
            padding: "25px",
            borderRadius: "10px",
          }}
        >
          <p
            className="text-center"
            style={{ fontWeight: "bold", marginBottom: "25px" }}
          >
            Featuring support for the following platforms
          </p>
          <Col>
            <img src="/icons/twitter_og.svg" alt="twitter logo" />
            <h2>Twitter</h2>

            <p>
              Post tweets and view most recent tweets sent from your account
            </p>
          </Col>
          <Col>
            <img src="/icons/discord_og.svg" alt="discord logo" />
            <h2>Discord</h2>

            <p>
              View all text channels belonging to you and post across any of
              them using our bot
            </p>
          </Col>
          <Col>
            <img src="/icons/reddit_og.svg" alt="discord logo" />
            <h2>Reddit</h2>

            <p>
              Post to any subreddit of your choice and add flairs to your post
              also
            </p>
          </Col>
        </Row>
        <hr></hr>
        {signInORUp === "signin" && (
          <>
            <ButtonGroup size="lg" className="mb-2">
              <Button
                variant="none"
                onClick={() => {
                  setSignInORUp("signup");
                }}
              >
                Sign Up
              </Button>
              <Button variant="none">
                <u>
                  <b>Sign In</b>
                </u>
              </Button>
            </ButtonGroup>
            <LoginForm secureCookie={useSecureCookie} />
          </>
        )}
        {signInORUp === "signup" && (
          <>
            <ButtonGroup size="lg" className="mb-2">
              <Button variant="none">
                <u>
                  <b>Sign Up</b>
                </u>
              </Button>
              <Button
                onClick={() => {
                  setSignInORUp("signin");
                }}
                variant="none"
              >
                Sign In
              </Button>
            </ButtonGroup>
            <CreateAccountForm secureCookie={useSecureCookie} />
          </>
        )}

        <footer
          style={{ maxWidth: "600px" }}
          className="text-center mx-auto text-muted mt-5"
        >
          <div className="text-center mb-4" style={{ marginTop: "50px" }}>
            <span
              style={{
                display: "block",
                marginTop: "100px",
                marginBottom: "10px",
              }}
            >
              <a
                href="https://awoldt.com/"
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: "none", color: "#6c757d" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-brush"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z" />
                </svg>
                Made by awoldt
              </a>
            </span>
            <a
              href={"/privacy"}
              className="text-center"
              style={{ textDecoration: "none" }}
            >
              Privacy
            </a>
          </div>

          <p>
            All trademarks, logos, and brand names are the property of their
            respective owners. All company, product, and service names used in
            this website are for identification and informational purposes only.
            Use of these names, trademarks, and brands does not imply
            endorsement.
          </p>
        </footer>
      </Container>
    </>
  );
}
