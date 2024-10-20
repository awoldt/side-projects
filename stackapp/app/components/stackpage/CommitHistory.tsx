import { CommitData } from "~/models/stack";

export default function CommitHistory({
  commits,
  defaultBranch,
  toggleShowCommits,
  extraCommitsStyles,
  commitContainerStyles,
}: {
  commits: CommitData[];
  defaultBranch: string;
  toggleShowCommits: () => void;
  extraCommitsStyles: React.CSSProperties;
  commitContainerStyles: React.CSSProperties;
}) {
  return (
    <div className="commitContainer" style={commitContainerStyles}>
      <p className="subtitle">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/imgs/icons/dot.svg"
            width={"14px"}
            height={"14px"}
            alt="three dots icon"
          />
          COMMIT HISTORY
        </div>
      </p>
      <hr />

      <div
        className="profileButtonHolder"
        style={{ marginTop: "0.4rem", gap: "0" }}
      >
        <div className="commitBranch">
          <p className="commitBranchText">
            <img
              src="/imgs/icons/branch.svg"
              alt="branch icon"
              style={{ width: "12px" }}
            />
            &ensp;
            {defaultBranch}
          </p>
        </div>
        <button onClick={toggleShowCommits} style={{ fontSize: "12px" }}>
          View More&nbsp;<i className="fa-solid fa-chevron-down fa-xs"></i>
        </button>
      </div>

      {commits.length > 0 && (
        <div className="commitRow" key={0}>
          <p className="commitRowMessage">
            <img
              src="/imgs/icons/commit.svg"
              alt="commit svg"
              style={{ width: "12px" }}
            />
            &ensp;{commits[0].message}
          </p>

          <div>
            <p className="commitRowSha">
              {commits[0].url.split("/")[
                // eslint-disable-next-line no-unexpected-multiline
                commits[0].url.split("/").length - 1
              ].substring(0, 7)}
            </p>
            <p className="commitRowDate">
              &ensp;&middot;&ensp;{commits[0].date}
            </p>
            <button className="commitRowButton">
              <a
                href={commits[0].url}
                target="_blank"
                rel="noreferrer"
                style={{ padding: "0.6rem" }}
              >
                {" "}
                <img
                  src="/imgs/icons/external-link.svg"
                  alt="external link icon"
                  style={{ width: "12px", color: "#2667ff" }}
                />
              </a>
            </button>
          </div>
        </div>
      )}

      <div className="extraCommits" style={extraCommitsStyles}>
        {commits.slice(1, 5).map((x, index) => {
          return (
            <div className="commitRow" key={index}>
              <p className="commitRowMessage">
                <img
                  src="/imgs/icons/commit.svg"
                  alt="commit svg"
                  style={{ width: "12px" }}
                />
                &ensp;{x.message}
              </p>

              <div>
                <p className="commitRowSha">
                  {x.url.split("/")[
                    // eslint-disable-next-line no-unexpected-multiline
                    x.url.split("/").length - 1
                  ].substring(0, 7)}
                </p>
                <p className="commitRowDate">&ensp;&middot;&ensp;{x.date}</p>
                <button className="commitRowButton">
                  <a
                    href={x.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ padding: "0.6rem" }}
                  >
                    {" "}
                    <img
                      src="/imgs/icons/external-link.svg"
                      alt="external link icon"
                      style={{ width: "12px" }}
                    />
                  </a>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
