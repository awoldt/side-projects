import axios from "axios";
import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useCookies } from "react-cookie";

export default function CreateAccountForm({
  secureCookie,
}: {
  secureCookie: boolean;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [cookies, setCookie, removeCookie] = useCookies(["account_id"]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <>
      <h2 style={{ marginTop: "25px" }}>Create an account</h2>
      <p className="text-secondary">
        All accounts are free and only require an email and strong password
      </p>
      <Form
        onSubmit={async (e) => {
          setLoading(true);
          e.preventDefault();

          if (password === confirmPassword) {
            const req = await axios.post("/api/create-account", {
              email: email,
              password: password,
              c_password: confirmPassword,
            });

            if (req.data.status === 200) {
              setCookie("account_id", req.data.account_id, {
                secure: secureCookie,
                maxAge: 2630000,
              });
              window.location.assign("/");
            } else {
              setLoading(false);
              alert(req.data.msg);
            }
          } else {
            setLoading(false);
            alert("Passwords must match");
          }
        }}
      >
        <Form.Group className="mb-3">
          <Form.Label htmlFor="email">Email address: </Form.Label>
          <input
            style={{ marginLeft: "10px" }}
            id="email"
            type="email"
            placeholder="Enter email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </Form.Group>
        <p>This password must follow the following criteria:</p>
        <ul>
          <li>Minimum 8 characters long</li>
          <li>At least 1 upper and lowercase character</li>
          <li>At least 1 number</li>
          <li>At least 1 symbol</li>
        </ul>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="password">Password</Form.Label>
          <input
            style={{ marginLeft: "10px" }}
            id="password"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="confirm_password">Confirm Password</Form.Label>
          <input
            style={{ marginLeft: "10px" }}
            id="confirm_password"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            required
          />
        </Form.Group>

        {loading && <Spinner animation="border" variant="primary" />}
        {!loading && (
          <Button variant="primary" type="submit">
            Create Account
          </Button>
        )}
      </Form>
    </>
  );
}
