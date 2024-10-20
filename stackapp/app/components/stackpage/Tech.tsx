import { Stack } from "~/models/stack";

export default function TechUsed({
  stackData,
  descriptions,
}: {
  stackData: Stack;
  descriptions:
    | {
        name: string;
        description: string;
      }[]
    | null;
}) {
  return (
    <div className="techContainer">
      <div className="techHolder">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/imgs/icons/dot.svg"
            width={"14px"}
            height={"14px"}
            alt="three dots icon"
          />
          <p className="subtitle">LANGUAGES</p>
        </div>
        <hr />
        <div className="tech">
          {stackData.languages_used.map((x, index) => {
            let description: string | null = null;
            let descriptionName: string | null = null;
            if (descriptions) {
              for (let i = 0; i < descriptions.length; i++) {
                if (x === descriptions[i].name) {
                  description = descriptions[i].description;
                  descriptionName = descriptions[i].name;
                  break;
                }
              }
            }

            return (
              <div className="techDetails" key={index}>
                <img
                  className="techImage"
                  src={`/imgs/tech/${x}.svg`}
                  width="60"
                  height="60"
                  alt={`${x} logo`}
                />
                {/* <p className="techSubtitle">{x}</p> */}
                {description && (
                  <div className="techTooltip">
                    <p className="title">{descriptionName}</p>
                    <hr />
                    <p>{description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {stackData!.databases_used && (
        <div className="techHolder">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/imgs/icons/dot.svg"
              width={"14px"}
              height={"14px"}
              alt="three dots icon"
            />
            <p className="subtitle">DATABASES</p>
          </div>
          <hr />
          <div className="tech">
            {stackData!.databases_used.map((x, index) => {
              let description: string | null = null;
              let descriptionName: string | null = null;
              if (descriptions) {
                for (let i = 0; i < descriptions.length; i++) {
                  if (x === descriptions[i].name) {
                    description = descriptions[i].description;
                    descriptionName = descriptions[i].name;
                    break;
                  }
                }
              }

              return (
                <div className="techDetails" key={index}>
                  <img
                    className="techImage"
                    src={`/imgs/tech/${x}.svg`}
                    width="60"
                    height="60"
                    alt={`${x} logo`}
                  />
                  {/* <p className="techSubtitle">{x}</p> */}
                  {descriptions && (
                    <div className="techTooltip">
                      <p className="title">{descriptionName}</p>
                      <hr />
                      <p>{description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {stackData!.apis_used && (
        <div className="techHolder">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/imgs/icons/dot.svg"
              width={"14px"}
              height={"14px"}
              alt="three dots icon"
            />
            <p className="subtitle">APIS</p>
          </div>
          <hr />
          <div className="tech">
            {stackData!.apis_used.map((x, index) => {
              let description: string | null = null;
              let descriptionName: string | null = null;
              if (descriptions) {
                for (let i = 0; i < descriptions.length; i++) {
                  if (x === descriptions[i].name) {
                    description = descriptions[i].description;
                    descriptionName = descriptions[i].name;
                    break;
                  }
                }
              }

              return (
                <div className="techDetails" key={index}>
                  <img
                    className="techImage"
                    src={`/imgs/tech/${x}.svg`}
                    width="60"
                    height="60"
                    alt={`${x} logo`}
                  />
                  {/* <p className="techSubtitle">{x}</p> */}
                  {descriptions && (
                    <div className="techTooltip">
                      <p className="title">{descriptionName}</p>
                      <hr />
                      <p>{description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stackData!.frameworks_used && (
        <div className="techHolder">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/imgs/icons/dot.svg"
              width={"14px"}
              height={"14px"}
              alt="three dots icon"
            />
            <p className="subtitle">FRAMEWORKS</p>
          </div>
          <hr />
          <div className="tech">
            {stackData!.frameworks_used.map((x, index) => {
              let description: string | null = null;
              let descriptionName: string | null = null;
              if (descriptions) {
                for (let i = 0; i < descriptions.length; i++) {
                  if (x === descriptions[i].name) {
                    description = descriptions[i].description;
                    descriptionName = descriptions[i].name;
                    break;
                  }
                }
              }

              return (
                <div className="techDetails" key={index}>
                  <img
                    className="techImage"
                    src={`/imgs/tech/${x}.svg`}
                    width="60"
                    height="60"
                    alt={`${x} logo`}
                  />
                  {/* <p className="techSubtitle">{x}</p> */}
                  {descriptions && (
                    <div className="techTooltip">
                      <p className="title">{descriptionName}</p>
                      <hr />
                      <p>{description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stackData!.clouds_used && (
        <div className="techHolder">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="/imgs/icons/dot.svg"
              width={"14px"}
              height={"14px"}
              alt="three dots icon"
            />
            <p className="subtitle">CLOUD SERVICES</p>
          </div>
          <hr />
          <div className="tech">
            {stackData!.clouds_used.map((x, index) => {
              let description: string | null = null;
              let descriptionName: string | null = null;
              if (descriptions) {
                for (let i = 0; i < descriptions.length; i++) {
                  if (x === descriptions[i].name) {
                    description = descriptions[i].description;
                    descriptionName = descriptions[i].name;
                    break;
                  }
                }
              }

              return (
                <div className="techDetails" key={index}>
                  <img
                    className="techImage"
                    src={`/imgs/tech/${x}.svg`}
                    width="60"
                    height="60"
                    alt={`${x} logo`}
                  />
                  {/* <p className="techSubtitle">{x}</p> */}
                  {descriptions && (
                    <div className="techTooltip">
                      <p className="title">{descriptionName}</p>
                      <hr />
                      <p>{description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
