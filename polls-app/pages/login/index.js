import React from "react";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function logIn(e, p) {
    const data = await axios.post("/api/account", {
      action: "log_in",
      email: e,
      password: p,
    });
    console.log(data);

    if (data.data.status === "ok") {
      Cookies.set("account", data.data.id);
      window.location.href = "/";
    }
  }

  return (
    <div>
      <label htmlFor="email">Email:</label>{" "}
      <input
        type="text"
        id="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br></br>
      <label htmlFor="password">Password:</label>{" "}
      <input
        type="text"
        id="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <br></br>
      <button
        onClick={() => {
          logIn(email, password);
        }}
      >
        Log In
      </button>
    </div>
  );
};

export default Index;
