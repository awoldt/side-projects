import React from "react";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";

const PrivatePoll = () => {
  const [p, setP] = useState();

  async function checkP() {
    const data = await axios.post("/api/poll-data", {
      action: "password_submission",
      guess: p,
    });
    console.log(data);
    if (data.data.status === "ok") {
      Cookies.set(data.data.c, null, {expires: .1});
      window.location.reload();
    } else {
      alert("wrong password");
    }
  }

  return (
    <div>
      <p>Enter poll password</p>
      <input
        type="text"
        onChange={(e) => {
          setP(e.target.value);
        }}
      />{" "}
      <button
        onClick={() => {
          checkP();
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default PrivatePoll;
