import { Button } from "react-bootstrap";
import axios from "axios";

const Keys = ({
  value,
  cs,
  charIndexData,
  scs,
  srs,
  ri,
  rs,
  snawa,
  w,
  cr,
  scr,
  sri,
  nawa,
  scg,
  bgColor,
  topRowData,
  middleRowData,
  bottomRowData,
  showDescription
}) => {
  if (value === "ENTER") {
    return (
      <Button
        style={{
          border: "none",
          padding: "9px",
          margin: "2px",
          width: "70px",
          height: "44px",
          backgroundColor: "#999999",
        }}
        onClick={async () => {
          try {
            const cw = await axios.post("/is-word", {
              word: cs.toLowerCase(),
            });

            if (cw.data.status == "error") {
              snawa(!nawa);
            } else {
              console.log(w);
              console.log(cs);

              //user got all questions right
              //GAME OVER
              if (w === cs.toLowerCase()) {
                alert("game over");
                const x = [...cr];
                x[ri] = true;
                scr(x);
                charIndexData[1](0);
                sri(ri + 1);
                scs("");
                scg(true);
                sri(6); //makes virtual keyboard disapear
              } else {
                //change color code for each key
                const word = w.split("");
                const spelling = cs.toLowerCase().split("");
                console.log(word);
                console.log(spelling);

                //for each char user has spelled, compare with actual word
                spelling.forEach((x, index) => {
                  //GREEN
                  if (x === word[index]) {
                    topRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase()) {
                        const z = [...topRowData[0]];
                        z[index2].color = "#538d4e";
                        topRowData[1](z);
                      }
                    });
                    middleRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase()) {
                        const z = [...middleRowData[0]];
                        z[index2].color = "#538d4e";
                        middleRowData[1](z);
                      }
                    });
                    bottomRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase()) {
                        const z = [...bottomRowData[0]];
                        z[index2].color = "#538d4e";
                        bottomRowData[1](z);
                      }
                    });
                    //YELLOW
                  } else if (word.indexOf(x) !== -1) {
                    topRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase() && y.color === "#999999") {
                        const z = [...topRowData[0]];
                        z[index2].color = "#b59f3b";
                        topRowData[1](z);
                      }
                    });
                    middleRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase() && y.color === "#999999") {
                        const z = [...middleRowData[0]];
                        z[index2].color = "#b59f3b";
                        middleRowData[1](z);
                      }
                    });
                    bottomRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase() && y.color === "#999999") {
                        const z = [...bottomRowData[0]];
                        z[index2].color = "#b59f3b";
                        bottomRowData[1](z);
                      }
                    });
                    //BLACK
                  } else {
                    topRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase() && y.color === "#999999") {
                        const z = [...topRowData[0]];
                        z[index2].color = "#3a3a3c";
                        topRowData[1](z);
                      }
                    });
                    middleRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase() && y.color === "#999999") {
                        const z = [...middleRowData[0]];
                        z[index2].color = "#3a3a3c";
                        middleRowData[1](z);
                      }
                    });
                    bottomRowData[0].forEach((y, index2) => {
                      if (y.key === x.toUpperCase() && y.color === "#999999") {
                        const z = [...bottomRowData[0]];
                        z[index2].color = "#3a3a3c";
                        bottomRowData[1](z);
                      }
                    });
                  }
                });

                const x = [...cr];
                x[ri] = true;
                scr(x);
                charIndexData[1](0);
                sri(ri + 1);
                scs("");
              }
            }
          } catch (e) {
            console.log(e);
          }
        }}
      >
        {value}
      </Button>
    );
  } else if (value === "BACKSPACE") {
    return (
      <Button
        style={{
          border: "none",
          padding: "9px",
          margin: "2px",
          width: "36px",
          height: "44px",
          backgroundColor: "#999999",
        }}
        onClick={() => {
          if (cs.length !== 0) {
            var x = [...cs];
            x.pop();
            x = x.join("");
            var y = [...rs];

            //figure out last index with char
            var l = false;
            var i = 4;
            while (l == false) {
              if (y[ri][i] == "") {
                i -= 1;
              } else {
                l = true;
              }
            }

            y[ri].splice(i, 1, "");
            srs(y);
            scs(x);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-arrow-left-square"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
          />
        </svg>
      </Button>
    );
  } else {
    return (
      <Button
        style={{
          border: "none",
          padding: "9px",
          margin: "2px",
          width: "30px",
          height: "44px",
          backgroundColor: bgColor,
        }}
        onClick={(e) => {
          showDescription(false); //will make app description disapear on first key click
          if (cs.length !== 5) {
            charIndexData[1]((charIndexData[0] += 1));
            scs((cs += e.target.innerText));
            const x = [...rs];
            const y = ["", "", "", "", ""];
            for (var i = 0; i < cs.length; ++i) {
              y[i] = cs[i];
            }
            x[ri] = y;
            srs(x);
          }
        }}
      >
        {value}
      </Button>
    );
  }
};

export default Keys;
