import React from "react";
import { Container } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import MultipleChoice from "../../components/poll-types/MultipleChoice";
import Head from "next/head";
import FreeResponse from "../../components/poll-types/FreeResponse";

const Index = ({ poll_type }) => {
  const [pollType, setPollType] = useState(poll_type);
  const [pageTitle, setPageTitle] = useState("Create a new poll"); //default unless poll type specified

  const multipleChoiceBtnRef = useRef();
  const freeResponseRef = useRef();

  function highlightSelectedPollType(x) {
    switch (x) {
      case "mc":
        multipleChoiceBtnRef.current.style.backgroundColor = "yellow";
        freeResponseRef.current.style.backgroundColor = "white";
        setPollType("multiple_choice");
        break;

      case "fr":
        multipleChoiceBtnRef.current.style.backgroundColor = "white";
        freeResponseRef.current.style.backgroundColor = "yellow";
        setPollType("free_response");
        break;
    }
  }

  useEffect(() => {
    switch (poll_type) {
      case "multiple_choice":
        setPageTitle("Create a Multiple Choice Poll");
        break;

      case "free_response":
        setPageTitle("Create a Free Response Poll");
        break;
    }
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Container>
        <h1>create a new poll</h1>
        <p>Select type</p>
        <button
          style={{ marginRight: "10px" }}
          ref={multipleChoiceBtnRef}
          onClick={() => {
            highlightSelectedPollType("mc");
            setPageTitle("Create a Multiple Choice Poll");
          }}
        >
          Multitple choice
        </button>
        <button
          ref={freeResponseRef}
          onClick={() => {
            highlightSelectedPollType("fr");
            setPageTitle("Create a Free Response Poll");
          }}
        >
          Free response
        </button>
        <hr></hr>
        {pollType === "multiple_choice" && <MultipleChoice />}
        {pollType === "free_response" && <FreeResponse />}
      </Container>
    </>
  );
};

export default Index;

export async function getServerSideProps({ query }) {
  var pollType;
  //checks url query to auto load desired poll type
  switch (query.type) {
    case "mc":
      pollType = "multiple_choice";
      break;

    case "fr":
      pollType = "free_response";
      break;

    default:
      pollType = null;
      break;
  }

  return {
    props: {
      poll_type: pollType,
    },
  };
}
