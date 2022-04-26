import { useState, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Dropdown } from "react-bootstrap";
import contextProvider from "./resultsContext";

//custom components
import Keyboard from "./components/Keyboard";

function App() {
  const textResultsRef = useRef();

  const [theme, setTheme] = useState("Blue"); //defaults to blue keyboard

  var keyboardBackPlate = "rgb(0, 31, 77)",
    keyBorder = "3px solid rgb(0, 38, 255)",
    keys = "rgb(0, 102, 255)"; //defaults to blue layout

  //will change the keyboard theme color on each render
  switch (theme) {
    case "Blue":
      keyboardBackPlate = "rgb(0, 31, 77)";
      keyBorder = "4px solid rgb(0, 38, 255)";
      keys = "rgb(0, 102, 255)";
      break;

    case "Red":
      keyboardBackPlate = "#4d0000";
      keyBorder = "4px solid #800000";
      keys = "#b30000";
      break;

    case "Green":
      keyboardBackPlate = "#003300";
      keyBorder = "4px solid #006600";
      keys = "#009900";
      break;

    case "Orange":
      keyboardBackPlate = "#cc7a00";
      keyBorder = "4px solid #ff9900";
      keys = "#ffad33";
      break;
  }

  return (
    <Container fluid id="app-container">
      <Container
        id="results-container"
        style={{ paddingTop: "40px", overflow: "auto" }}
      >
        <div>
          <p
            style={{ fontSize: "40px", wordBreak: "break-word" }}
            ref={textResultsRef}
          >
            {" "}
          </p>
        </div>
      </Container>

      <Container fluid id="keyboard-container">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Theme
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={(e) => {
                setTheme(e.target.innerText);
              }}
            >
              Blue
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                setTheme(e.target.innerText);
              }}
            >
              Red
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                setTheme(e.target.innerText);
              }}
            >
              Green
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => {
                setTheme(e.target.innerText);
              }}
            >
              Orange
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <contextProvider.Provider
          value={[[keyboardBackPlate, keyBorder, keys], theme, textResultsRef]}
        >
          <Keyboard />
        </contextProvider.Provider>
      </Container>
    </Container>
  );
}

export default App;
