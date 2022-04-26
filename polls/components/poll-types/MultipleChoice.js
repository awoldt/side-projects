import React from "react";
import { useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";

const MultipleChoice = () => {
  const [pollTitle, setPolltitle] = useState("");
  const [pollTag, setPollTag] = useState(null);
  const [pollTagDisplay, setPollTagDisplay] = useState(null);
  const [pollDescription, setPollDescription] = useState("");
  const [privatePoll, setPrivatePoll] = useState(false);
  const [privatePassword, setPrivatePassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState([false, null]);

  const [responseChoices, setResponseChoices] = useState([
    { choice: "A", text: "" },
    { choice: "B", text: "" },
    { choice: "C", text: "" },
    { choice: "D", text: "" },
  ]);

  async function createPoll() {
    setLoading(true);
    const data = await axios.post("/api/poll-data", {
      action: "create_poll",
      type: "multiple_choice",
      poll_data: {
        title: pollTitle,
        tag: pollTag,
        tagDisplay: pollTagDisplay,
        description: pollDescription,
        response_choices: responseChoices,
      },
      private_poll: privatePoll,
      private_poll_password: privatePassword,
    });
    setLoading(false);
    console.log(data.data);
    if (data.data.status !== "error") {
      setResponseMsg([true, data.data.poll_url]);
    } else {
      alert(data.data.msg);
    }
  }

  return (
    <div>
      <h1>Multiple Choice</h1>
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
          setPollTagDisplay(e.target.selectedOptions[0].text);
        }}
      >
        <option defaultValue value={null}></option>
        <option value="entertainment">Entertainment</option>
        <option value="politics">Politics</option>
        <option value="gaming">Gaming</option>
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
      {responseChoices.map((x, index) => {
        return (
          <div key={index}>
            <label style={{ marginRight: "25px" }} htmlFor={"input_" + index}>
              Question {x.choice}
            </label>
            <input
              type="text"
              style={{
                borderRight: "0px",
                borderLeft: "0px",
                borderTop: "0px",
              }}
              id={"input_" + index}
              onChange={(e) => {
                var x = [...responseChoices];
                x[index].text = e.target.value;
                setResponseChoices(x);
              }}
            />
          </div>
        );
      })}
      <br></br>
      <input
        type="checkbox"
        id="private_poll_checkbox"
        name="pp"
        value={true}
        onChange={(e) => {
          setPrivatePoll(e.target.checked);
        }}
      />{" "}
      <label htmlFor="private_poll_checkbox">
        Private poll{" "}
        <span className="text-secondary" style={{ fontSize: "12px" }}>
          Can only be accessed with password
        </span>
      </label>
      {privatePoll && (
        <>
          <br></br>
          <input
            onChange={(e) => {
              setPrivatePassword(e.target.value);
            }}
          />
        </>
      )}
      <br></br>
      <br></br>
      {loading === false && (
        <button
          onClick={() => {
            const x = [...responseChoices];
            if (
              pollTitle === "" ||
              pollDescription === "" ||
              x[0].text === "" ||
              x[1].text === "" ||
              x[2].text === "" ||
              x[3].text === ""
            ) {
              alert("Missing input values");
            } else if (privatePoll && privatePassword === "") {
              alert("Must enter private password");
            } else {
              createPoll();
            }
          }}
        >
          Create poll!
        </button>
      )}
      {loading && <Spinner animation="border" variant="primary" />}
      <br></br>
      {responseMsg[0] && (
        <p>
          Poll can be found at{" "}
          <a href={String(responseMsg[1])}>{responseMsg[1]}</a>
        </p>
      )}
    </div>
  );
};

export default MultipleChoice;
