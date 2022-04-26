import React from "react";
import contextConsumer from "../resultsContext";

const KeboardBtns = ({ keyValue, action }) => {
  //changes the keyboard btn to a slghtly lighter color after clicking
  //resembles a real life key press visually
  const keypressColorChange = (key, event, theme) => {
    //* theme will determine what color will be displayed on mousedown and up

    if (theme === "Blue") {
      //on mouse click, darken background of key btn
      if (event === "down") {
        key.target.style.backgroundColor = "#0045ad";
        key.target.style.borderRadius = "10px";
      }
      //on mosue up, revert keyboard btn to original styling
      else if (event === "up") {
        key.target.style.backgroundColor = "#0066ff";
        key.target.style.borderRadius = "10px";
      }
    } else if (theme === "Red") {
      //on mouse click, darken background of key btn
      if (event === "down") {
        key.target.style.backgroundColor = "#990000";
        key.target.style.borderRadius = "10px";
      }
      //on mosue up, revert keyboard btn to original styling
      else if (event === "up") {
        key.target.style.backgroundColor = "#b30000";
        key.target.style.borderRadius = "10px";
      }
    } else if (theme === "Green") {
      //on mouse click, darken background of key btn
      if (event === "down") {
        key.target.style.backgroundColor = "#006100";
        key.target.style.borderRadius = "10px";
      }
      //on mosue up, revert keyboard btn to original styling
      else if (event === "up") {
        key.target.style.backgroundColor = "#009900";
        key.target.style.borderRadius = "10px";
      }
    } else if (theme === "Orange") {
      //on mouse click, darken background of key btn
      if (event === "down") {
        key.target.style.backgroundColor = "#ff9900";
        key.target.style.borderRadius = "10px";
      }
      //on mosue up, revert keyboard btn to original styling
      else if (event === "up") {
        key.target.style.backgroundColor = "#ffad33";
        key.target.style.borderRadius = "10px";
      }
    }
  };

  return (
    <contextConsumer.Consumer>
      {(func) => {
        return (
          <div
            style={{
              border: func[0][1],
              backgroundColor: func[0][2],
              fontSize: "30px",
            }}
            className="text-center keyboard-btn"
            onClick={() => {
              //action key (backspace, enter, etccc)
              if (action !== undefined) {
                switch (action) {
                  case "remove":
                    //results string has 1 or more chars
                    //if not dont do anything (ie no setState)
                    if (func[2].current.innerText.length >= 1) {
                      var z = func[2].current.innerText;
                      var l = z.slice(0, z.length - 1);
                      func[2].current.innerText = l;
                    }

                    break;
                }
                //letter key
                //add to results string
              } else {
                func[2].current.innerText += keyValue;
              }
            }}
            onMouseDown={(e) => {
              keypressColorChange(e, "down", func[1]);
            }}
            onMouseUp={(e) => {
              keypressColorChange(e, "up", func[1]);
            }}
            //simply revert to original key color is mouse leves div
            //prevents missing the mouseup event and key color press stays
            onMouseOut={(e) => {
              if (func[1] === "Blue") {
                e.target.style.backgroundColor = "#0066ff";
              } else if (func[1] === "Red") {
                e.target.style.backgroundColor = "#b30000";
              } else if (func[1] === "Green") {
                e.target.style.backgroundColor = "#009900";
              } else if (func[1] === "Orange") {
                e.target.style.backgroundColor = "#ffad33";
              }
            }}
          >
            {keyValue}
          </div>
        );
      }}
    </contextConsumer.Consumer>
  );
};

export default KeboardBtns;
