/* eslint-disable jsx-a11y/no-static-element-interactions */
import TechUsed from "./Tech";
import CommitHistory from "./CommitHistory";
import LikeButton from "./LikeButton";
import { StackDetails } from "~/utils/functions.server";
import { useState } from "react";

interface PropData {
  isSignedIn: boolean;
  isUsersStack: boolean;
  hasLiked: boolean;
  stackData: StackDetails;
  techDescriptions:
    | {
        name: string;
        description: string;
      }[]
    | null;
}

export default function StackHeader(props: PropData) {
  const [extraCommits, setExtraCommits] = useState<boolean>(false);
  const [commitContainer, setCommitContainer] = useState<boolean>(false);

  const toggleShowCommits = () => {
    setExtraCommits(!extraCommits);
    setCommitContainer(!commitContainer);
  };
  const extraCommitsStyles: React.CSSProperties = {
    maxHeight: extraCommits ? "fit-content" : "0rem",
    opacity: extraCommits ? 1 : 0,
    transition: extraCommits ? "500ms ease-in-out" : "150ms ease-in-out",
  };
  const commitContainerStyles: React.CSSProperties = {
    height: commitContainer ? "22rem" : "8.75rem",
  };

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const toggleShowSettings = () => {
    setShowSettings(!showSettings);
  };
  const showSettingsStyles: React.CSSProperties = {
    display: showSettings ? "block" : "none",
  };

  return (
    <>
      <dialog open className="dialogShare" style={showSettingsStyles}>
        <div className="dialogContentHolder">
          <div className="dialogContent">
            <div className="profileButtonHolder" style={{ gap: "1rem" }}>
              <div>
                <a href={`/stack/${props.stackData.stackData._id}/edit`}>
                  <img
                    src="/imgs/icons/edit.svg"
                    alt="edit icon"
                    width={"12px"}
                  />

                  <p>&ensp;Edit Stack</p>
                </a>
              </div>

              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
              <div
                style={{ cursor: "pointer" }}
                className="likeButtonActive"
                onClick={async () => {
                  const userConfirm = window.confirm(
                    "Are you sure you want to delete this Stack?"
                  );
                  if (userConfirm) {
                    const userConfirm2 = window.confirm(
                      "This action can not be undone. Are you sure?"
                    );
                    if (userConfirm2) {
                      const req = await fetch(
                        `/api?action=delete_stack&stack_id=${props.stackData.stackData._id}`,
                        { method: "post" }
                      );
                      const res = await req.json();
                      if (res.status == 200) {
                        window.location.assign("/profile");
                      } else {
                        alert(res.message);
                      }
                    }
                  }
                }}
              >
                <img
                  src="/imgs/icons/trash.svg"
                  alt="trash icon"
                  width={"12px"}
                />

                <p>&ensp;Delete Stack</p>
              </div>
            </div>
          </div>
        </div>
        <button onClick={toggleShowSettings} className="dialogButton">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </dialog>

      <div className="headerHolder">
        <div className="header">
          <div className="profile">
            <a
              href={`/profile/${props.stackData.profileData?.public_id}`}
              style={{ padding: "0rem" }}
            >
              <img
                className="profileImage"
                src={
                  props.stackData.profileData?.profile_img === undefined
                    ? "/imgs/icons/noprofile.png"
                    : props.stackData.profileData?.profile_img
                }
                width="50"
                height="50"
                alt="profile"
              />
            </a>
            <div className="profileTextHolder">
              <p className="profileTextTitle">
                {props.stackData.profileData?.name}
              </p>
              <p className="profileTextUsername">
                @{props.stackData.profileData?.username}
              </p>
            </div>
          </div>
          <div className="profileButtonHolder">
            <div>
              {!props.isUsersStack && props.isSignedIn && (
                <LikeButton
                  stackID={props.stackData.stackData._id}
                  hasLiked={props.hasLiked}
                  numberOfLikes={props.stackData.stackData.likes}
                />
              )}
              {!props.isSignedIn && (
                <>
                  <button className="likeButton">
                    <svg
                      className="svgLike"
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      viewBox="0 0 512 512"
                    >
                      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                    </svg>
                  </button>
                  <span>{props.stackData.stackData.likes.toString()}</span>
                </>
              )}
            </div>

            {props.isUsersStack && (
              <div>
                <button className="shareButton" onClick={toggleShowSettings}>
                  <img
                    src="/imgs/icons/gear.svg"
                    alt="gear icon"
                    width={"12px"}
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="content" style={{ borderTop: "0px", marginTop: "0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.8rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: "1rem",
            }}
          >
            <h1>{props.stackData.stackData.repo_name}</h1>
            {props.stackData.stackData.website_url !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "fit-content",
                }}
              >
                <img
                  src="/imgs/icons/link.svg"
                  alt="external link icon"
                  style={{ width: "14px" }}
                />
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={props.stackData.stackData.website_url}
                  style={{ padding: "0", color: "#2667ff" }}
                >
                  &nbsp;
                  {props.stackData.stackData.website_url}
                </a>
              </div>
            )}
          </div>
          <div className="topicHolder">
            {props.stackData.stackData.repo_topics &&
              props.stackData.stackData.repo_topics.map((x, index) => {
                return (
                  <span className="topic" key={index}>
                    {x}
                  </span>
                );
              })}
          </div>
        </div>
        <div style={{ marginTop: "0.4rem" }}>
          <p>{props.stackData.stackData.repo_description}</p>
        </div>

        <CommitHistory
          commits={props.stackData.stackData.repo_commits}
          defaultBranch={props.stackData.stackData.repo_default_branch}
          toggleShowCommits={toggleShowCommits}
          extraCommitsStyles={extraCommitsStyles}
          commitContainerStyles={commitContainerStyles}
        />

        {props.stackData.stackData === undefined && (
          <p>There was an error while fetching technology used in your stack</p>
        )}
        {props.stackData.stackData !== undefined && (
          <TechUsed
            stackData={props.stackData.stackData}
            descriptions={props.techDescriptions}
          />
        )}
      </div>
    </>
  );
}
