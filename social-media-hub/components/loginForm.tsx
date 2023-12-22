import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function LoginForm({ secureCookie }: { secureCookie: boolean }) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [cookies, setCookie, removeCookie] = useCookies(["account_id"]);

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <h2 style={{ marginTop: "25px" }}>Sign in</h2>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const data = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });
          const req = await data.json();

          if (req.status === 200) {
            setCookie("account_id", req.account_id, {
              secure: secureCookie,
              maxAge: 2630000,
            });

            window.location.assign("/");
          } else {
            setLoading(false);
            alert("account does not exist");
          }
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email address</Form.Label>
          <input
            id="email"
            style={{ marginLeft: "10px" }}
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <input
            id="password"
            type="password"
            style={{ marginLeft: "10px" }}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {loading && <Spinner animation="border" variant="light" />}
          {!loading && <span>Sign in</span>}
        </Button>
      </Form>
    </>
  );
}
