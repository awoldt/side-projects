/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Form, Button, Container, Row, Col, Tabs, Tab } from "react-bootstrap";

const HandleSubmit = async (
  e: any,
  type: string,
  email: string,
  password: string
) => {
  e.preventDefault();
  if (email !== "" && password !== "") {
    const endpoint = type === "login" ? "/api/signin" : "/api/signup";
    const req  =await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    if(req.ok) {
      window.location.reload();
    }
  }
};

const LoginSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("login");

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={4}>
          <div className="border p-4 rounded">
            <Tabs
              id="login-signup-tabs"
              activeKey={key}
              onSelect={(k: any) => setKey(k)}
              className="mb-4"
            >
              <Tab eventKey="login" title="Login">
                <h2 className="text-center mb-4">Sign in</h2>
                <Form onSubmit={(e) => HandleSubmit(e, key, email, password)}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      required
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                  >
                    Login
                  </Button>
                </Form>
              </Tab>
              <Tab eventKey="signup" title="Signup">
                <h2 className="text-center mb-4">Sign up</h2>
                <p>Create a free account!</p>
                <Form
                  onSubmit={(e) => HandleSubmit(e, "signup", email, password)}
                >
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      required
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                  >
                    Signup
                  </Button>
                </Form>
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginSignup;
