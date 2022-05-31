import Keys from "./Keys";
import { useState } from "react";

const VirtualKeys = ({
  srs,
  rs,
  ri,
  scs,
  cs,
  charIndexData,
  snawa,
  w,
  cr,
  scr,
  sri,
  nawa,
  scg,
  ssd
}) => {
  const [topR, setTopR] = useState([
    { key: "Q", color: "#999999" },
    { key: "W", color: "#999999" },
    { key: "E", color: "#999999" },
    { key: "R", color: "#999999" },
    { key: "T", color: "#999999" },
    { key: "Y", color: "#999999" },
    { key: "U", color: "#999999" },
    { key: "I", color: "#999999" },
    { key: "O", color: "#999999" },
    { key: "P", color: "#999999" },
  ]);

  const [middleR, setMiddleR] = useState([
    { key: "A", color: "#999999" },
    { key: "S", color: "#999999" },
    { key: "D", color: "#999999" },
    { key: "F", color: "#999999" },
    { key: "G", color: "#999999" },
    { key: "H", color: "#999999" },
    { key: "J", color: "#999999" },
    { key: "K", color: "#999999" },
    { key: "L", color: "#999999" },
  ]);

  const [bottomR, setBottomR] = useState([
    { key: "ENTER", color: "#999999" },
    { key: "Z", color: "#999999" },
    { key: "X", color: "#999999" },
    { key: "C", color: "#999999" },
    { key: "V", color: "#999999" },
    { key: "B", color: "#999999" },
    { key: "N", color: "#999999" },
    { key: "M", color: "#999999" },
    { key: "BACKSPACE", color: "#999999" },
  ]);

  return (
    <>
      <div className="text-center mb-2">
        {topR.map((x) => {
          return (
            <Keys
              value={x.key}
              cs={cs}
              charIndexData={charIndexData}
              scs={scs}
              srs={srs}
              ri={ri}
              rs={rs}
              snawa={snawa}
              w={w}
              cr={cr}
              scr={scr}
              sri={sri}
              nawa={nawa}
              scg={scg}
              bgColor={x.color}
              showDescription={ssd}
            />
          );
        })}
      </div>
      <div className="text-center mb-2">
        {middleR.map((x) => {
          return (
            <Keys
              value={x.key}
              cs={cs}
              charIndexData={charIndexData}
              scs={scs}
              srs={srs}
              ri={ri}
              rs={rs}
              snawa={snawa}
              w={w}
              cr={cr}
              scr={scr}
              sri={sri}
              nawa={nawa}
              scg={scg}
              bgColor={x.color}
              showDescription={ssd}

            />
          );
        })}
      </div>
      <div className="text-center mb-2">
        {bottomR.map((x) => {
          return (
            <Keys
              value={x.key}
              cs={cs}
              charIndexData={charIndexData}
              scs={scs}
              srs={srs}
              ri={ri}
              rs={rs}
              snawa={snawa}
              w={w}
              cr={cr}
              scr={scr}
              sri={sri}
              nawa={nawa}
              scg={scg}
              bgColor={x.color}
              topRowData={[topR, setTopR]}
              middleRowData={[middleR, setMiddleR]}
              bottomRowData={[bottomR, setBottomR]}
              showDescription={ssd}

            />
          );
        })}
      </div>
    </>
  );
};

export default VirtualKeys;
