import { Stack } from "~/models/stack";
import TechUsedDisplay from "../TechUsedDisplay";

export default function StackMore({
  username,
  stacks,
}: {
  username: string;
  stacks:
    | {
        stackData: Stack;
        techUsedDisplay: string[] | null;
      }[]
    | null;
}) {
  return (
    <>
      {stacks && (
        <div className="content">
          <p className="subtitle">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/imgs/icons/dot.svg"
                width={"14px"}
                height={"14px"}
                alt="three dots icon"
              />
              <p className="subtitle">MORE FROM @{username}</p>
            </div>
          </p>
          <div
            style={{
              display: "flex",
              gap: "0rem",
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            {stacks.slice(0, 4).map(
              (
                x: {
                  stackData: Stack;
                  techUsedDisplay: string[] | null;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                    }}
                  >
                    <a href={`/stack/${x.stackData._id}`}>
                      <img
                        src={`${x.stackData.thumbnails[0]}`}
                        className="img-thumbnail"
                        width="275"
                        height="175"
                        alt="profile-img"
                        style={{
                          objectFit: "cover",
                          boxShadow: "0px 0px 10px 0px #00000010",
                          marginBottom: "0.4rem",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          marginTop: "0.4rem",
                        }}
                      >
                        <p className="title">{x.stackData.repo_name}</p>

                        {/* {x.techUsedDisplay && (
                          <TechUsedDisplay t={x.techUsedDisplay} />
                        )} */}
                      </div>
                    </a>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
}
