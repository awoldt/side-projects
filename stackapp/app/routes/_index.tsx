import { LoaderFunctionArgs, json } from "@remix-run/node";
import indexPageCss from "../styles/_index.css";
import StackHeaderCss from "../styles/stack_.$stack_id.css";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import { IsSignedIn } from "~/utils/functions.server";
import { getSession } from "~/utils/sessions";

export function links() {
  return [
    { rel: "stylesheet", href: indexPageCss },
    { rel: "stylesheet", href: StackHeaderCss },
  ];
}

interface LoaderData {
  signedIn: boolean;
  profileImg?: string;
}

export default function Home() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <>
      <Nav
        isSignedIn={loaderData.signedIn}
        profileImg={
          !loaderData.signedIn
            ? "/imgs/icons/noprofile.png"
            : loaderData.profileImg!
        }
      />

      <main
        style={{
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "4rem",
        }}
      >
        <div
          className="container"
          style={{
            marginTop: "14rem",
          }}
        >
          <div className="scrollbar"></div>
          <div
            className="content"
            style={{
              background: "none",
              border: "1px solid transparent",
              backdropFilter: "none",
            }}
          >
            <div className="titleHolder">
              <div>
                <h1 style={{ lineHeight: "1.4" }}>
                  Visualize Tech Stacks with Impact.
                </h1>
                <hr />
                <p>
                  Stackapp is a platform designed to help developers showcase
                  their tech stacks.
                </p>
                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <a
                    href={!loaderData.signedIn ? "/signin" : "/profile"}
                    className="buttonLarge"
                  >
                    Sign In
                  </a>
                </div>
              </div>
              <img
                src={"/imgs/icons/test.svg"}
                width="400"
                height="0"
                alt="profile-img"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </div>

            <div
              style={{
                marginTop: "10rem",
                display: "flex",
                justifyContent: "space-around",
                gap: "0.4rem",
                marginBottom: "14rem",
                flexWrap: "wrap",
              }}
            >
              <img
                src={"/imgs/icons/githubtext.svg"}
                width="150"
                height="0"
                alt="profile-img"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />

              <img
                src={"/imgs/icons/remix.svg"}
                width="200"
                height="0"
                alt="profile-img"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
              <img
                src={"/imgs/icons/mongo.svg"}
                width="200"
                height="0"
                alt="profile-img"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  color: "red",
                }}
              />
            </div>

            <div className="fade">
              <div className="hover">
                <div className="leftTop"></div>
                <div className="leftBottom"></div>
                <div className="rightTop"></div>
                <div className="rightBottom"></div>
                <div className="hoverContainer">
                  <p>
                    Stacks are visual representations of the technology used to
                    build your applications and serve as a central place to show
                    others behind the curtain how your app works and all the
                    technical details that go into it
                  </p>
                </div>
              </div>
            </div>

            <div className="fade">
              <span
                className="subtitle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  opacity: 1,
                  color: "#2667ff",
                  fontSize: "32px",
                }}
              >
                <img
                  src={"/imgs/icons/github.svg"}
                  width="30"
                  height="0"
                  alt="profile-img"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                &nbsp;GitHub
              </span>
              <hr />
              <p>
                Stacks are specifically designed with GitHub in mind. Connect
                your repositories and display relevant, up-to-date information
                about your app. Changes to your repo will reflect on the Stacks
                you&apos;ve made.{" "}
              </p>
            </div>

            <div
              className="fade"
              style={{
                marginTop: "14rem",
              }}
            >
              <div className="hover">
                <div className="leftTop"></div>
                <div className="leftBottom"></div>
                <div className="rightTop"></div>
                <div className="rightBottom"></div>
                <div className="hoverContainer">
                  <p>
                    Every Stack displays the five main building blocks of any
                    application: programming language, database, API, framework,
                    and cloud service
                    <br />
                    <br />
                    Thumbnail uploads allow for Stacks to showcase exactly how
                    your applications look to end users
                  </p>
                </div>
              </div>
            </div>

            <div
              className="fade"
              style={{
                marginTop: "14rem",
                marginBottom: "2rem",
              }}
            >
              <span
                className="subtitle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  opacity: 1,
                  color: "#2667ff",
                  fontSize: "32px",
                }}
              >
                <img
                  src={"/imgs/icons/smile.svg"}
                  width="30"
                  height="0"
                  alt="profile-img"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                &nbsp;Community
              </span>
              <hr />
              <p>
                Connect with other developers and explore popular Stacks from
                the community
              </p>
            </div>

            <div
              className="fade"
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "space-around",
              }}
            >
              <div className="hover">
                <div className="leftTop"></div>
                <div className="leftBottom"></div>
                <div className="rightTop"></div>
                <div className="rightBottom"></div>
                <div className="hoverContainer">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={"/imgs/icons/image.png"}
                      width="415"
                      height="265"
                      alt="profile-img"
                      style={{
                        objectFit: "cover",
                        maxWidth: "100%",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "415px",
                        maxWidth: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={"/imgs/icons/noprofile.png"}
                          width="25"
                          height="25"
                          alt="profile-img"
                          style={{
                            borderRadius: "50px",
                            marginRight: "0.2rem",
                          }}
                        />
                        <p style={{ fontWeight: "500", fontSize: "16px" }}>
                          Stack
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={"/imgs/icons/heart.svg"}
                          width="12"
                          height="0"
                          alt="profile-img"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                          }}
                        />
                        <p style={{ fontWeight: "500", fontSize: "12px" }}>
                          &nbsp;9.9k
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hover">
                <div className="leftTop"></div>
                <div className="leftBottom"></div>
                <div className="rightTop"></div>
                <div className="rightBottom"></div>
                <div className="hoverContainer">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={"/imgs/icons/image.png"}
                      width="415"
                      height="265"
                      alt="profile-img"
                      style={{
                        objectFit: "cover",
                        maxWidth: "100%",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "415px",
                        maxWidth: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={"/imgs/icons/noprofile.png"}
                          width="25"
                          height="25"
                          alt="profile-img"
                          style={{
                            borderRadius: "50px",
                            marginRight: "0.2rem",
                          }}
                        />
                        <p style={{ fontWeight: "500", fontSize: "16px" }}>
                          Stack
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={"/imgs/icons/heart.svg"}
                          width="12"
                          height="0"
                          alt="profile-img"
                          style={{
                            maxWidth: "100%",
                            height: "auto",
                          }}
                        />
                        <p style={{ fontWeight: "500", fontSize: "12px" }}>
                          &nbsp;9.9k
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="fade"
              style={{
                marginTop: "2rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <a href="/explore" className="buttonLarge">
                Explore Stacks
              </a>
            </div>

            <div
              className="fade"
              style={{
                marginTop: "14rem",
                marginBottom: "2rem",
              }}
            >
              <span
                className="subtitle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  opacity: 1,
                  color: "#2667ff",
                  fontSize: "32px",
                }}
              >
                <img
                  src={"/imgs/icons/hands.svg"}
                  width="30"
                  height="0"
                  alt="profile-img"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
                &nbsp;Stack
              </span>
              <hr />
              <p>
                GitHub integration allows for a high standard for each and every
                Stack created.
                <br />
                Sign in with GitHub to start Stacking today!
              </p>
            </div>
            <div
              className="fade"
              style={{
                marginTop: "2rem",
                marginBottom: "1rem",
                display: "flex",
              }}
            >
              <a
                className="buttonLarge"
                href={!loaderData.signedIn ? "/signin" : "/profile"}
              >
                Sign In
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
  if (account === null) {
    return json({ signedIn: false });
  }
  return json({ signedIn: true, profileImg: account.profile_img });
}

export const meta: MetaFunction = () => {
  return [
    { title: "Stackapp - A Platform for Modern Tech Stack Visualization" },
    {
      name: "description",
      content:
        "Stackapp offers developers a robust platform, enabling them to craft visually stunning web pages that highlight crucial details about their technological infrastructure. This includes information on coding languages, databases, frameworks, and various other components integral to their development environment.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://stackapp.xyz",
    },
    {
      property: "og:title",
      content: "Stackapp - A Platform for Modern Tech Stack Visualization",
    },
    {
      property: "og:url",
      content: "https://stackapp.xyz",
    },
    {
      property: "og:description",
      content:
        "Stackapp offers developers a robust platform, enabling them to craft visually stunning web pages that highlight crucial details about their technological infrastructure.",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: "Stackapp - A Platform for Modern Tech Stack Visualization",
    },
    {
      name: "twitter:description",
      content:
        "Stackapp offers developers a robust platform, enabling them to craft visually stunning web pages that highlight crucial details about their technological infrastructure.",
    },
  ];
};
