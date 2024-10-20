import { useRef, useState } from "react";
import createCss from "../styles/create.css";
import { getSession } from "~/utils/sessions";
import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  GetRepoSelectOptions,
  GetStackData,
  GetTechOffered,
  IsSignedIn,
  RepoSelectOptions,
} from "~/utils/functions.server";
import { Links, Meta, useLoaderData } from "@remix-run/react";
import Nav from "~/components/Nav";
import {
  CreateStackFormSubmit,
  StackFormRequest,
} from "~/utils/functions.client";
import ThumbnailInputs from "~/components/create/ThumbnailInputs";

interface LoaderData {
  navBarImg: string;
  repoOptions?: RepoSelectOptions[] | null;
  techOffered?: {
    languages: string[];
    databases: string[];
    apis: string[];
    frameworks: string[];
    clouds: string[];
  } | null;
  currentRepoName: string;
  stackId: string;
}

export function links() {
  return [{ rel: "stylesheet", href: createCss }];
}

export default function EditStack() {
  const loaderData = useLoaderData<LoaderData>();

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
      <Nav isSignedIn={true} profileImg={loaderData.navBarImg} />

      <main style={{ alignItems: "center" }}>
        <div
          className="container"
          style={{ width: "25%", minWidth: "fit-content" }}
        >
          <div className="content">
            {loaderData.repoOptions === null ||
              (loaderData.techOffered === null && (
                <p>
                  There was an error while loading edit stack page. Try again
                  later.
                </p>
              ))}
            {loaderData.repoOptions && loaderData.techOffered && (
              <>
                <p>
                  You currently have <b>{loaderData.currentRepoName}</b>{" "}
                  selected as your connected repository
                </p>
                <div style={{ marginTop: "50px" }}>
                  {" "}
                  <form
                    encType="multipart/form-data"
                    method="post"
                    ref={formRef}
                    onSubmit={(e) => {
                      CreateStackFormSubmit(
                        e,
                        techSelected,
                        formRef,
                        true,
                        loaderData.stackId
                      );
                    }}
                  >
                    <p>
                      Select all of the <b>Languages</b> used in the creation of
                      your tech stack.
                    </p>
                    <p className="required">&emsp;[Required]</p>
                    <hr />
                    <select
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
                              const { databases, apis, frameworks, clouds } =
                                techSelected;
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
                      Select all of the <b>Databases</b> used in the creation of
                      your tech stack.
                    </p>
                    <hr />
                    <select
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
                              const { languages, apis, frameworks, clouds } =
                                techSelected;
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
                      Select all of the <b>APIs</b> used in the creation of your
                      tech stack.
                    </p>
                    <hr />
                    <select
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
                      Select all of the <b>Frameworks</b> used in the creation
                      of your tech stack.
                    </p>
                    <hr />
                    <select
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
                      {loaderData.techOffered!.frameworks.map((x, index) => {
                        if (!techSelected.frameworks.includes(x)) {
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
                              const { languages, databases, apis, frameworks } =
                                techSelected;
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
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const stackID = params.stack_id;
  if (stackID === undefined) {
    throw new Response(null, {
      status: 404,
    });
  }

  const stackDetails = await GetStackData(stackID);
  if (stackDetails === null) {
    throw new Response(null, {
      status: 500,
    });
  }

  const session = await getSession(request.headers.get("Cookie"));
  const account = await IsSignedIn(session.get("a_id"));
  if (account === null) {
    return redirect(`/stack/${stackID}`);
  }

  const isUsersStack =
    account === null
      ? false
      : String(account._id) === stackDetails.stackData.aid
      ? true
      : false;

  // MUST be users stack to be able to edit
  if (!isUsersStack) {
    return redirect(`/stack/${stackID}`);
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
    throw new Response(null, {
      status: 500,
    });
  }

  const techOffered = await GetTechOffered();
  if (techOffered === null) {
    throw new Response(null, {
      status: 500,
    });
  }

  const returnData: LoaderData = {
    repoOptions: repoSelectOptions,
    navBarImg: account.profile_img,
    techOffered: await GetTechOffered(),
    currentRepoName: stackDetails.stackData.repo_name,
    stackId: stackDetails.stackData._id,
  };
  return json(returnData);
}

export const meta: MetaFunction = () => {
  return [{ title: "Profile" }, { name: "robots", content: "noindex" }];
};

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body style={{ padding: "100px 0px 0px 25px" }}>
        <Nav isSignedIn={false} profileImg={null} />
        <h1>There was an error while loading edit page for stack :(</h1>
      </body>
    </html>
  );
}
