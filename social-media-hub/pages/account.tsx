import axios from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Button, Container, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { GET_ACCOUNT_SETTINGS, IS_USER_SIGNED_IN } from "../FUNCTIONS";
import account_settings from "../interface/account_settings";

export default function Account({
  settingsData,
}: {
  settingsData: account_settings;
}) {
  const [areYouSure, setAreYouSure] = useState<boolean>(false);
  const [accountDeleted, setAccountDeleted] = useState<boolean>(false);
  const [cookies, setCookie, removeCookie] = useCookies(["account_id"]);
  const [loading, setLoading] = useState<boolean>(false);

  const [revokeTwitterLoading, setRevokeTwitterLoading] =
    useState<boolean>(false);
  const [revokeRedditLoading, setRevokeRedditLoading] =
    useState<boolean>(false);
  const [revokeDiscordLoading, setRevokeDiscordLoading] =
    useState<boolean>(false);

  const [connectedAccountsStatus, setConnectedAccountStatus] =
    useState<account_settings>(settingsData);

  return (
    <Container fluid style={{ backgroundColor: "#EDEDE9" }}>
      <Container>
        <a
          href={"/"}
          style={{ textDecoration: "none", display: "block" }}
          className="mt-3 mb-1"
        >
          Return home
        </a>
        {accountDeleted && <p>Account has been successfully deleted</p>}
        {!accountDeleted && (
          <>
            <h1>Account</h1>
            <div style={{ marginBottom: "25px" }}>
              <b>Email:</b> {settingsData.email}
            </div>
            <hr></hr>
            <u>Connected socials</u>
            <div>
              <img src={"/icons/discord_og.svg"} />
              {connectedAccountsStatus.hasConnectedDiscordAccount && (
                <span>
                  <img src={"/icons/check.svg"} />
                  Connected
                  <Button
                    variant="link"
                    style={{ marginLeft: "10px" }}
                    onClick={async () => {
                      setRevokeDiscordLoading(true);
                      const req = await axios.post("/api/revoke-access", {
                        platform: "discord",
                      });
                      if (req.data.status === 200) {
                        const x: account_settings = {
                          hasConnectedDiscordAccount: false,
                          hasConnectedRedditAccount:
                            connectedAccountsStatus.hasConnectedRedditAccount,
                          hasConnectedTwitterAccount:
                            connectedAccountsStatus.hasConnectedTwitterAccount,
                        };
                        setConnectedAccountStatus(x);
                        setRevokeDiscordLoading(false);
                      } else {
                        alert(req.data.msg);
                        setRevokeDiscordLoading(false);
                      }
                    }}
                  >
                    {!revokeDiscordLoading && "Revoke access"}
                    {revokeDiscordLoading && (
                      <Spinner animation="border" variant="primary" />
                    )}
                  </Button>
                </span>
              )}
              {!connectedAccountsStatus.hasConnectedDiscordAccount && (
                <span>
                  <img src={"/icons/x.svg"} />
                  Not connected
                </span>
              )}
            </div>

            <div>
              <img src={"/icons/reddit_og.svg"} />
              {connectedAccountsStatus.hasConnectedRedditAccount && (
                <span>
                  <img src={"/icons/check.svg"} />
                  Connected
                  <Button
                    variant="link"
                    style={{ marginLeft: "10px" }}
                    onClick={async () => {
                      setRevokeRedditLoading(true);
                      const req = await axios.post("/api/revoke-access", {
                        platform: "reddit",
                      });
                      if (req.data.status === 200) {
                        const x: account_settings = {
                          hasConnectedDiscordAccount:
                            connectedAccountsStatus.hasConnectedDiscordAccount,
                          hasConnectedRedditAccount: false,
                          hasConnectedTwitterAccount:
                            connectedAccountsStatus.hasConnectedTwitterAccount,
                        };
                        setConnectedAccountStatus(x);
                        setRevokeRedditLoading(false);
                      } else {
                        alert(req.data.msg);
                        setRevokeRedditLoading(false);
                      }
                    }}
                  >
                    {!revokeRedditLoading && "Revoke access"}
                    {revokeRedditLoading && (
                      <Spinner animation="border" variant="primary" />
                    )}
                  </Button>
                </span>
              )}
              {!connectedAccountsStatus.hasConnectedRedditAccount && (
                <span>
                  <img src={"/icons/x.svg"} />
                  Not connected
                </span>
              )}
            </div>

            <div>
              <img src={"/icons/twitter_og.svg"} />
              {connectedAccountsStatus.hasConnectedTwitterAccount && (
                <span>
                  <img src={"/icons/check.svg"} />
                  Connected
                  <Button
                    variant="link"
                    style={{ marginLeft: "10px" }}
                    onClick={async () => {
                      setRevokeTwitterLoading(true);
                      const req = await axios.post("/api/revoke-access", {
                        platform: "twitter",
                      });
                      if (req.data.status === 200) {
                        const x: account_settings = {
                          hasConnectedDiscordAccount:
                            connectedAccountsStatus.hasConnectedDiscordAccount,
                          hasConnectedRedditAccount:
                            connectedAccountsStatus.hasConnectedRedditAccount,
                          hasConnectedTwitterAccount: false,
                        };
                        setConnectedAccountStatus(x);
                        setRevokeTwitterLoading(false);
                      } else {
                        alert(req.data.msg);
                        setRevokeTwitterLoading(false);
                      }
                    }}
                  >
                    {!revokeTwitterLoading && "  Revoke access"}
                    {revokeTwitterLoading && (
                      <Spinner animation="border" variant="primary" />
                    )}
                  </Button>
                </span>
              )}
              {!connectedAccountsStatus.hasConnectedTwitterAccount && (
                <span>
                  <img src={"/icons/x.svg"} />
                  Not connected
                </span>
              )}
            </div>
            {!areYouSure && (
              <Button
                variant="danger"
                style={{ marginTop: "50px" }}
                onClick={() => {
                  setAreYouSure(true);
                }}
              >
                Delete account
              </Button>
            )}
            {areYouSure && (
              <>
                <p style={{ marginTop: "50px" }}>
                  Are you sure you would like to delete your account? This
                  action is irreversible.
                </p>
                <Button
                  variant="danger"
                  style={{ marginRight: "10px" }}
                  onClick={async () => {
                    setLoading(true);
                    const req = await axios.get("/api/delete-account");
                    if (req.data.status === 200) {
                      removeCookie("account_id");
                      setAccountDeleted(true);
                      setLoading(false);
                    } else {
                      alert(req.data.msg);
                      setLoading(false);
                    }
                  }}
                >
                  {!loading && <span>Yes, delete account</span>}
                  {loading && <Spinner animation="border" variant="light" />}
                </Button>
                <Button
                  variant="link"
                  onClick={() => {
                    setAreYouSure(false);
                  }}
                >
                  No
                </Button>
              </>
            )}
          </>
        )}
      </Container>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  //signed in
  if (await IS_USER_SIGNED_IN(context.req.cookies)) {
    return {
      props: {
        settingsData: await GET_ACCOUNT_SETTINGS(
          context.req.cookies.account_id!
        ),
      },
    };
  }
  //not signed in
  else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
};
