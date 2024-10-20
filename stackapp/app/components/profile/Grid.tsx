import { Stack } from "~/models/stack";
import TechUsedDisplay from "../TechUsedDisplay";

export default function ProfileGrid({
  stacks,
}: {
  stacks:
    | {
        stackData: Stack;
        techUsedDisplay: string[] | null;
      }[]
    | null;
}) {
  return (
    <>
      {stacks === null && <p>Error while getting users Stacks</p>}
      {stacks !== null && (
        <>
          {stacks.length === 0 && (
            <div
              className="container1"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <div
                className="content"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  background: "none",
                  border: "0px",
                  backdropFilter: "none",
                }}
              >
                <img
                  src="/imgs/icons/plus.svg"
                  width={"64px"}
                  style={{
                    borderRadius: "100px",
                    padding: "1rem",
                    paddingLeft: "1.1rem",
                    paddingRight: "1.1rem",
                    border: "1px solid #171d1c40;",
                    marginBottom: "1rem",
                  }}
                  alt="plus icon"
                />
                <span style={{ lineHeight: 1.4 }}>Create Stack</span>
                <p>When you create Stacks, they will appear on your profile.</p>
                <div style={{ marginTop: "2rem" }}>
                  <a href="/create" style={{ color: "blue" }}>
                    Create your first Stack
                  </a>
                </div>
              </div>
            </div>
          )}
          {stacks.length > 0 && (
            <div className="cardHolder">
              {stacks.map((x, index) => {
                return (
                  <div className="card" key={index}>
                    <a href={`/stack/${x.stackData._id}`}>
                      <div className="cardContent">
                        <img
                          src={`${x.stackData.thumbnails[0]}`}
                          className="img-thumbnail"
                          width="415"
                          height="265"
                          alt="stack thumbnail"
                          style={{ marginBottom: "10px" }}
                        />
                        <div className="cardTitleHolder">
                          <div className="cardTitle">
                            <span
                              className="title"
                              style={{ marginBottom: "25px"}}
                            >
                              {x.stackData.repo_name}
                            </span>
                          </div>

                          <div className="cardTitleHolder">
                            <div className="likeHolder">
                              <img
                                src="/imgs/icons/heart.svg"
                                width={"14"}
                                alt="like icon"
                              />
                              <p className="likeText">
                                &nbsp;{x.stackData.likes}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {x.techUsedDisplay && (
                        <TechUsedDisplay t={x.techUsedDisplay} />
                      )}
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </>
  );
}
