import { useRef, useState } from "react";
import createCss from "../styles/create.css";
import { getSession } from "~/utils/sessions";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import {
  GetRepoSelectOptions,
  GetTechOffered,
  IsSignedIn,
  RepoSelectOptions,
} from "~/utils/functions.server";
import { useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import {
  CreateStackFormSubmit,
  StackFormRequest,
} from "~/utils/functions.client";
import ThumbnailInputs from "~/components/create/ThumbnailInputs";

interface LoaderData {
  isSignedIn: boolean;
  navBarImg?: string;
  repoOptions?: RepoSelectOptions[] | null;
  techOffered?: {
    languages: string[];
    databases: string[];
    apis: string[];
    frameworks: string[];
    clouds: string[];
  } | null;
  githubClientId?: string;
}

export function links() {
  return [{ rel: "stylesheet", href: createCss }];
}

export default function CreateForm() {
  const loaderData = useLoaderData<LoaderData>();

  const DISABLEDFORM = loaderData.isSignedIn ? false : true;

  const [techSelected, setTechSelected] = useState<StackFormRequest>({
    languages: [],
    databases: [],
    apis: [],
    frameworks: [],
    clouds: [],
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <Nav
        isSignedIn={loaderData.isSignedIn}
        profileImg={loaderData.navBarImg ?? "/imgs/icons/noprofile.png"}
      />

      <main style={{ alignItems: "center" }}>
        <div
          className="container"
          style={{ width: "25%", minWidth: "fit-content" }}
        >
          <div className="content">
            {/* NOT SIGNED IN */}
            {!loaderData.isSignedIn && (
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
                  Sign in with GitHub to create your first Stack
                </p>

                <a
                  href={`https://github.com/login/oauth/authorize?client_id=${loaderData.githubClientId}`}
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
            )}

            {/* SIGNED IN */}
            {loaderData.isSignedIn && (
              <>
                {loaderData.repoOptions === null ||
                  (loaderData.techOffered === null && (
                    <p>
                      There was an error while loading create page. Try again
                      later.
                    </p>
                  ))}
                {loaderData.repoOptions && loaderData.techOffered && (
                  <>
                    {loaderData.repoOptions.length === 0 && (
                      <p>
                        You don&apos;t have any repos available to create a
                        Stack with. Make sure all your repos are public. This
                        can also be becuase you have used up all your pubilc
                        repos with other Stacks.
                      </p>
                    )}
                    {loaderData.repoOptions.length !== 0 && (
                      <form
                        encType="multipart/form-data"
                        method="post"
                        ref={formRef}
                        onSubmit={(e) => {
                          CreateStackFormSubmit(e, techSelected, formRef);
                        }}
                      >
                        <p>
                          Select a <b>GitHub Repository.</b>
                        </p>
                        <p className="required">&emsp;[Required]</p>
                        <hr />
                        {loaderData.repoOptions.length === 0 && (
                          <p>There are no more repos for you to use</p>
                        )}

                        <select
                          name="repo"
                          id=""
                          style={{ marginBottom: "3rem" }}
                          required
                          disabled={DISABLEDFORM}
                        >
                          <option value="" selected disabled hidden>
                            ---
                          </option>
                          {loaderData.repoOptions.map((x, index) => {
                            return (
                              <option value={x.name} key={index}>
                                {x.name}
                              </option>
                            );
                          })}
                        </select>

                        <p>
                          Select all of the <b>Languages</b> used in the
                          creation of your tech stack.
                        </p>
                        <p className="required">&emsp;[Required]</p>
                        <hr />
                        <select
                          disabled={DISABLEDFORM}
                          name="language"
                          id=""
                          onChange={(e) => {
                            setTechSelected((prev) => {
                              const {
                                languages,
                                databases,
                                apis,
                                frameworks,
                                clouds,
                              } = prev;

                              const r: StackFormRequest = {
                                languages: [...languages, e.target.value],
                                databases: databases,
                                apis: apis,
                                frameworks: frameworks,
                                clouds: clouds,
                              };
                              return r;
                            });
                          }}
                        >
                          <option value="" selected>
                            ---
                          </option>
                          {loaderData.techOffered!.languages.map((x, index) => {
                            if (!techSelected.languages.includes(x)) {
                              return (
                                <option value={x} key={index}>
                                  {x}
                                </option>
                              );
                            }
                          })}
                        </select>
                        <hr />

                        <div className="selectedHolder">
                          <p className="selected">[Selected]</p>
                          <div className="holder">
                            {techSelected.languages.map((language) => (
                              <button
                                key={language}
                                className="inputSelected"
                                onClick={() => {
                                  const {
                                    databases,
                                    apis,
                                    frameworks,
                                    clouds,
                                  } = techSelected;
                                  const t = [...techSelected.languages];

                                  t.splice(t.indexOf(language), 1);

                                  setTechSelected({
                                    languages: t,
                                    databases: databases,
                                    apis: apis,
                                    frameworks: frameworks,
                                    clouds: clouds,
                                  });
                                }}
                              >
                                {language}&ensp;
                                <img
                                  src="/imgs/icons/x.svg"
                                  alt="x"
                                  style={{ width: "6px" }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <p>
                          Select all of the <b>Databases</b> used in the
                          creation of your tech stack.
                        </p>
                        <hr />
                        <select
                          disabled={DISABLEDFORM}
                          name="database"
                          id=""
                          onChange={(e) =>
                            setTechSelected((prev) => {
                              const {
                                languages,
                                databases,
                                apis,
                                frameworks,
                                clouds,
                              } = prev;

                              const r: StackFormRequest = {
                                languages: languages,
                                databases:
                                  databases === null
                                    ? [e.target.value]
                                    : [...databases, e.target.value],
                                apis: apis,
                                frameworks: frameworks,
                                clouds: clouds,
                              };

                              return r;
                            })
                          }
                        >
                          <option value="" selected>
                            ---
                          </option>
                          {loaderData.techOffered!.databases.map((x, index) => {
                            if (!techSelected.databases.includes(x)) {
                              return (
                                <option value={x} key={index}>
                                  {x}
                                </option>
                              );
                            }
                          })}
                        </select>
                        <hr />

                        <div className="selectedHolder">
                          <p className="selected">[Selected]</p>
                          <div className="holder">
                            {techSelected.databases.map((database) => (
                              <button
                                key={database}
                                className="inputSelected"
                                onClick={() => {
                                  const {
                                    languages,
                                    apis,
                                    frameworks,
                                    clouds,
                                  } = techSelected;
                                  const t = [...techSelected.databases];

                                  t.splice(t.indexOf(database), 1);

                                  setTechSelected({
                                    languages: languages,
                                    databases: t,
                                    apis: apis,
                                    frameworks: frameworks,
                                    clouds: clouds,
                                  });
                                }}
                              >
                                {database}&ensp;
                                <img
                                  src="/imgs/icons/x.svg"
                                  alt="x"
                                  style={{ width: "6px" }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <p>
                          Select all of the <b>APIs</b> used in the creation of
                          your tech stack.
                        </p>
                        <hr />
                        <select
                          disabled={DISABLEDFORM}
                          name="api"
                          id=""
                          onChange={(e) => {
                            setTechSelected((prev) => {
                              const {
                                languages,
                                databases,
                                apis,
                                frameworks,
                                clouds,
                              } = prev;

                              const r: StackFormRequest = {
                                languages: languages,
                                databases: databases,
                                apis:
                                  apis === null
                                    ? [e.target.value]
                                    : [...apis, e.target.value],
                                frameworks: frameworks,
                                clouds: clouds,
                              };

                              return r;
                            });
                          }}
                        >
                          <option value="" selected>
                            ---
                          </option>
                          {loaderData.techOffered!.apis.map((x, index) => {
                            if (!techSelected.apis.includes(x)) {
                              return (
                                <option value={x} key={index}>
                                  {x}
                                </option>
                              );
                            }
                          })}
                        </select>
                        <hr />

                        <div className="selectedHolder">
                          <p className="selected">[Selected]</p>
                          <div className="holder">
                            {techSelected.apis.map((API) => (
                              <button
                                key={API}
                                className="inputSelected"
                                onClick={() => {
                                  const {
                                    languages,
                                    databases,
                                    frameworks,
                                    clouds,
                                  } = techSelected;
                                  const t = [...techSelected.apis];

                                  t.splice(t.indexOf(API), 1);

                                  setTechSelected({
                                    languages: languages,
                                    databases: databases,
                                    apis: t,
                                    frameworks: frameworks,
                                    clouds: clouds,
                                  });
                                }}
                              >
                                {API}&ensp;
                                <img
                                  src="/imgs/icons/x.svg"
                                  alt="x"
                                  style={{ width: "6px" }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <p>
                          Select all of the <b>Frameworks</b> used in the
                          creation of your tech stack.
                        </p>
                        <hr />
                        <select
                          disabled={DISABLEDFORM}
                          name="framework"
                          id=""
                          onChange={(e) => {
                            setTechSelected((prev) => {
                              const {
                                languages,
                                databases,
                                apis,
                                frameworks,
                                clouds,
                              } = prev;

                              const r: StackFormRequest = {
                                languages: languages,
                                databases: databases,
                                apis: apis,
                                frameworks:
                                  frameworks === null
                                    ? [e.target.value]
                                    : [...frameworks, e.target.value],
                                clouds: clouds,
                              };

                              return r;
                            });
                          }}
                        >
                          <option value="" selected>
                            ---
                          </option>
                          {loaderData.techOffered!.frameworks.map(
                            (x, index) => {
                              if (!techSelected.frameworks.includes(x)) {
                                return (
                                  <option value={x} key={index}>
                                    {x}
                                  </option>
                                );
                              }
                            }
                          )}
                        </select>
                        <hr />

                        <div className="selectedHolder">
                          <p className="selected">[Selected]</p>
                          <div className="holder">
                            {techSelected.frameworks.map((framework) => (
                              <button
                                key={framework}
                                className="inputSelected"
                                onClick={() => {
                                  const { languages, databases, apis, clouds } =
                                    techSelected;
                                  const t = [...techSelected.frameworks];

                                  t.splice(t.indexOf(framework), 1);

                                  setTechSelected({
                                    languages: languages,
                                    databases: databases,
                                    apis: apis,
                                    frameworks: t,
                                    clouds: clouds,
                                  });
                                }}
                              >
                                {framework}&ensp;
                                <img
                                  src="/imgs/icons/x.svg"
                                  alt="x"
                                  style={{ width: "6px" }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <p>
                          Select all of the <b>Cloud Services</b> used in the
                          creation of your tech stack.
                        </p>
                        <hr />
                        <select
                          disabled={DISABLEDFORM}
                          name="cloud"
                          id=""
                          onChange={(e) => {
                            setTechSelected((prev) => {
                              const {
                                languages,
                                databases,
                                apis,
                                frameworks,
                                clouds,
                              } = prev;

                              const r: StackFormRequest = {
                                languages: languages,
                                databases: databases,
                                apis: apis,
                                frameworks: frameworks,
                                clouds:
                                  clouds === null
                                    ? [e.target.value]
                                    : [...clouds, e.target.value],
                              };

                              return r;
                            });
                          }}
                        >
                          <option value="" selected>
                            ---
                          </option>
                          {loaderData.techOffered!.clouds.map((x, index) => {
                            if (!techSelected.clouds.includes(x)) {
                              return (
                                <option value={x} key={index}>
                                  {x}
                                </option>
                              );
                            }
                          })}
                        </select>
                        <hr />

                        <div className="selectedHolder">
                          <p className="selected">[Selected]</p>
                          <div className="holder">
                            {techSelected.clouds.map((cloud) => (
                              <button
                                key={cloud}
                                className="inputSelected"
                                onClick={() => {
                                  const {
                                    languages,
                                    databases,
                                    apis,
                                    frameworks,
                                  } = techSelected;
                                  const t = [...techSelected.clouds];

                                  t.splice(t.indexOf(cloud), 1);

                                  setTechSelected({
                                    languages: languages,
                                    databases: databases,
                                    apis: apis,
                                    frameworks: frameworks,
                                    clouds: t,
                                  });
                                }}
                              >
                                {cloud}&ensp;
                                <img
                                  src="/imgs/icons/x.svg"
                                  alt="x"
                                  style={{ width: "6px" }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <p>
                          Select up to <b>4 Images</b> that represent your tech
                          stack.
                        </p>
                        <hr />
                        <hr />
                        <ThumbnailInputs />

                        <div className="buttonHolder">
                          <p>Create Stack&ensp;</p>
                          <button className="createButton" type="submit">
                            {" "}
                            <img
                              src="/imgs/icons/plus.svg"
                              alt="plus"
                              style={{ width: "12px" }}
                            />
                          </button>
                        </div>
                      </form>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));

  const GITHUBCLIENTID = process.env.GITHUB_CLIENT_ID;

  let returnData: LoaderData;

  // user must be signed in to create stack
  if (account === null) {
    returnData = {
      isSignedIn: false,
      githubClientId: GITHUBCLIENTID,
    };
    return json(returnData);
  }

  // get repo select options
  // do not return page if this is null
  const repoSelectOptions = await GetRepoSelectOptions(
    account.username,
    account.github_access_token
  );
  if (repoSelectOptions === null) {
    console.log(
      "\n there was an error while getting repo select options from users github account"
    );
    returnData = {
      isSignedIn: true,
      repoOptions: null,
    };
    return json(returnData);
  }

  returnData = {
    isSignedIn: true,
    repoOptions: repoSelectOptions,
    navBarImg: account.profile_img,
    techOffered: await GetTechOffered(),
  };
  return json(returnData);
}

export const meta: MetaFunction = () => {
  return [
    { title: "Create a Stack" },
    {
      name: "description",
      content:
        "Create a Stack for your profile and showcase all the technology that went into building your app. Connect a GitHub repo and display recent commits, name, website url, and much more.",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://stackapp.xyz/create",
    },
    {
      property: "og:title",
      content: "Create a Stack",
    },
    {
      property: "og:url",
      content: "https://stackapp.xyz/create",
    },
    {
      property: "og:description",
      content:
        "Create a Stack for your profile and showcase all the technology that went into building your app.",
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: "Create a Stack",
    },
    {
      name: "twitter:description",
      content:
        "Create a Stack for your profile and showcase all the technology that went into building your app.",
    },
  ];
};
