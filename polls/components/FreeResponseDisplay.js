import React from "react";
import { Container } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

const FreeResponseDisplay = ({ data, account_cookie }) => {
  const [userResponse, setUserResponse] = useState("");

  async function postNewResponse() {
    //user is signed in, allow post
    if (account_cookie !== false) {
      if (userResponse !== "") {
        const x = await axios.post("/api/poll-data", {
          action: "response",
          response: userResponse,
          poll_id: data.poll_data._id,
        });

        console.log(x);
      }
    } else {
      alert("You must be signed in to respond");
    }
  }

  return (
    <Container>
      <h1>{data.poll_data.title}</h1>
      <p>{data.poll_data.description}</p>
      <hr></hr>
      <i>
        please remeber to be respectful! posts that are offensive or hateful
        will be deleted
      </i>
      <textarea
        rows="10"
        cols="100"
        onChange={(e) => {
          setUserResponse(e.target.value);
        }}
      />
      <br></br>
      <br></br>
      <br></br>

      <h2>Responses ({data.poll_data.responses.length})</h2>
      {data.poll_data.responses.length === 0 && (
        <p style={{ color: "red" }}>There are no repsonse yet</p>
      )}
      {data.poll_data.responses.length !== 0 &&
        data.poll_data.responses.map((x, index) => {
          return <p key={index}>{x}</p>;
        })}

      <button
        onClick={() => {
          postNewResponse(userResponse);
        }}
      >
        Post
      </button>
    </Container>
  );
};

export default FreeResponseDisplay;
