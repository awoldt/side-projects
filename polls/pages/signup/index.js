import React from "react";
import { Container, Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";


const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  async function createAccount(e, p, cp) {
    const acct = [e, p, cp];
    console.log(acct);

    const data = await axios.post("/api/account", {
      action: "create_account",
      acct_data: acct
    });

    console.log(data)

    if(data.data.status === "ok") {
        Cookies.set("account", data.data.acct_id);
    }
    else {
        console.log(data.data.msg)
    }
  }

  return (
    <Container>
      <h1>Create a free account</h1>
      <label htmlFor="email">Email:</label> {"  "}
      <input
        type="text"
        id="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <br></br>
      <br></br>
      <label htmlFor="password">Password:</label> {"  "}
      <input type="text" id="password" onChange={(e) => {
          setPassword(e.target.value);
        }}/>
      <br></br>
      <br></br>
      <label htmlFor="confirmed-password">Confirm Password:</label> {"  "}
      <input type="text" id="confirmed-password" onChange={(e) => {
          setConfirmedPassword(e.target.value);
        }}/>
      <br></br>
      <br></br>
      <Button
        variant="warning"
        onClick={() => {
          createAccount(email, password, confirmedPassword);
        }}
      >
        Sign up
      </Button>
    </Container>
  );
};

export default Index;
