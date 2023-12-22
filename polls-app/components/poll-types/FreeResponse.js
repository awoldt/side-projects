import React from "react";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import Head from "next/head";

const FreeResponse = () => {
  const [pollTitle, setPolltitle] = useState("");
  const [pollDescription, setPollDescription] = useState("");
  const [pollTag, setPollTag] = useState(null);

  async function createPoll() {
    if (pollTitle === "" || pollDescription === "") {
      alert("Missing inputs");
    } else {
      const data = await axios.post("/api/poll-data", {
        action: "create_poll",
        type: "free_response",
        poll_data: {
          title: pollTitle,
          tag: pollTag,
          description: pollDescription,
        },
      });

      console.log(data.data);
      if (data.data.status !== "ok") {
        alert(data.data.msg);
      }
    }
  }

  return (
    <div>
      <h1>Free response</h1>
      <label htmlFor="poll-title">Poll Title</label>{" "}
      <input
        type="text"
        id="poll-title"
        onChange={(e) => {
          setPolltitle(e.target.value);
        }}
        style={{ width: "400px" }}
      />
      <br></br>
      <br></br>
      <label htmlFor="poll-tag">Tag: </label>{" "}
      <select
        id="poll-tag"
        onChange={(e) => {
          setPollTag(e.target.value);
        }}
      >
        <option defaultValue value={null}></option>
        <option value="entertainment">Entertainment</option>
        <option value="politics">Politics</option>
        <option value="video_games">Video Games</option>
      </select>
      <br></br>
      <br></br>
      <label htmlFor="poll-description">Poll Description</label>
      <br></br>
      <textarea
        type="textArea"
        id="poll-description"
        onChange={(e) => {
          setPollDescription(e.target.value);
        }}
        style={{ width: "400px", height: "250px" }}
        maxLength="700"
      />
      <br></br>
      <button
        onClick={() => {
          createPoll();
        }}
      >
        Create poll
      </button>
    </div>
  );
};

export default FreeResponse;
