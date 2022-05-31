import "./App.css";
import { Container, Alert, Button } from "react-bootstrap";
import { useState } from "react";
import VirtualKeys from "./components/VirtualKeys";
import WordleSquareGrid from "./components/WordleSqaureGrid";
import { useEffect } from "react";
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";

function App() {
  const [word, setWord] = useState(); //put word inside for this in dev mode to work
  const [rowSpellings, setRowSpellings] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);
  const [rowIndex, setRowIndex] = useState(0);
  const [currentSpelling, setCurrentSpelling] = useState(""); //how user has spelled word already
  const [charIndex, setCharIndex] = useState(0);
  const [completedRows, setCompletedRows] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [notAWordAlert, setNotAWordAlert] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false); //will be true if user guesses word correctly
  const [showDescription, setShowDescription] = useState(true);

  if (notAWordAlert == true) {
    const t = setTimeout(() => {
      setNotAWordAlert(!notAWordAlert);
    }, 1000);
  }

  useEffect(() => {
    async function getWord() {
      const x = await axios.get("/word");
      setWord(x.data.word);

      return x.data;
    }

    getWord();
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Free Wordle Game with Unlimited Words</title>
        <meta
          name="description"
          content="Play a free wordle game with unlimited words. After each game hit the retry button and play again with new word."
        />
        <link
          rel="canonical"
          href="https://react-wordle-4hregy3tga-ue.a.run.app/"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>
      <Container>
        <div>
          <WordleSquareGrid rs={rowSpellings} cr={completedRows} w={word} />
        </div>
        {notAWordAlert && <Alert variant="danger">Not in word list</Alert>}

        {rowIndex === 6 && (
          <>
            <div className="text-center mt-4 mb-4">
              <p>
                {correctGuess && (
                  <span style={{ color: "green" }}>
                    Congrats!<br></br>
                  </span>
                )}
                The word was <b>{word}</b>
              </p>
            </div>
            <div className="text-center">
              <Button
                onClick={async () => {
                  const x = await axios.get("/word");
                  setWord(x.data.word);
                  setRowSpellings([
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                    ["", "", "", "", ""],
                  ]);
                  setRowIndex(0);
                  setCurrentSpelling("");
                  setCharIndex(0);
                  setCompletedRows([false, false, false, false, false, false]);
                  setNotAWordAlert(false);
                  setCorrectGuess(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-arrow-counterclockwise"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
                </svg>{" "}
                Retry
              </Button>
            </div>
          </>
        )}

        {rowIndex !== 6 && (
          <VirtualKeys
            rs={rowSpellings}
            srs={setRowSpellings}
            ri={rowIndex}
            scs={setCurrentSpelling}
            cs={currentSpelling}
            charIndexData={[charIndex, setCharIndex]}
            nawa={notAWordAlert}
            snawa={setNotAWordAlert}
            w={word}
            cr={completedRows}
            scr={setCompletedRows}
            sri={setRowIndex}
            scg={setCorrectGuess}
            ssd={setShowDescription}
          />
        )}
        <div
          className="text-center"
          style={{ marginTop: "50px", marginBottom: "50px" }}
        >
          {showDescription && (
            <p>
              Unlimited words version of Wordle. Compete with friends and see
              who can guess the most words.{" "}
            </p>
          )}
          <p
            style={{
              marginTop: "100px",
              fontFamily: "Trebuchet MS, sans-serif",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-brush"
              viewBox="0 0 16 16"
            >
              <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z" />
            </svg>{" "}
            Made by{" "}
            <a
              href="https://awoldt.com"
              rel="noreferrer"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              Awoldt
            </a>
          </p>
        </div>
      </Container>
    </HelmetProvider>
  );
}

export default App;
