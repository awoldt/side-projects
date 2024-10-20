/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Alert,
  Button,
  Col,
  Form,
  Image,
  Row,
  Spinner,
  Container,
  Card,
  InputGroup,
} from "react-bootstrap";
import Login from "../components/Login";
import { getSession } from "../sessions.server";
import { TakeScreenshot } from "../utils.client";
import { SupabaseService } from "../services/Supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const styles = {
  container: {
    padding: "2rem",
  },
  header: {
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  },
  title: {
    color: "#343a40",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  apiKey: {
    fontWeight: "bold",
    color: "#007bff",
  },
  formContainer: {
    backgroundColor: "#e9ecef",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  },
  button: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  alert: {
    marginTop: "1rem",
  },
  image: {
    width: "100%",
    marginBottom: "1rem",
  },
  screenshotCard: {
    marginBottom: "1rem",
  },
};

export default function Index() {
  const loaderData = useLoaderData<IndexReponse>();

  const [user, setUser] = useState<UserData | null>(loaderData.userData);
  const [siteUrl, setSiteUrl] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string>();
  const [loading, setLoading] = useState(false);

  if (loaderData.signedIn) {
    return (
      <Container style={styles.container}>
        {!loaderData.success && (
          <p>There was an error while loading page data :(</p>
        )}
        {loaderData.success && (
          <>
            {user === null && <p>There was an error while getting user data</p>}
            {user && (
              <>
                <div style={styles.header}>
                  <Row>
                    <Col md={8}>
                      <h1 style={styles.title}>Screenshot API</h1>
                      <p>This is a basic screenshot API and very easy to use</p>
                    </Col>
                    <Col md={4} className="text-md-end">
                      <p>
                        Your API key:{" "}
                        <span style={styles.apiKey}>{user.api_key}</span>
                      </p>
                      <p>
                        You have <b>{user.screenshots_remaining}</b> remaining
                        screenshots
                      </p>
                    </Col>
                  </Row>
                </div>

                <div style={styles.formContainer}>
                  <p>Enter the site you want to take a screenshot of</p>
                  <Form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (siteUrl !== "" && loaderData.userData) {
                        await TakeScreenshot(
                          siteUrl,
                          loaderData.screenshotApiEndpoint!,
                          loaderData.userData.api_key,
                          setGeneratedImage,
                          setLoading,
                          setUser
                        );
                      }
                    }}
                  >
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="url"
                        placeholder="Enter site address"
                        required
                        disabled={loading}
                        onChange={(e) => {
                          setSiteUrl(e.target.value);
                        }}
                      />
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                        style={styles.button}
                      >
                        {loading && <Spinner animation="border" size="sm" />}
                        {!loading && <>Submit</>}
                      </Button>
                    </InputGroup>
                  </Form>
                </div>

                {generatedImage !== undefined && !loading && (
                  <Alert variant="success" style={styles.alert}>
                    <Row>
                      <Col>
                        <Image
                          src={generatedImage}
                          alt="generated screenshot"
                          fluid
                          style={styles.image}
                        />
                      </Col>
                      <Col>
                        <h2>Successfully generated image</h2>
                        <Button
                          variant="primary"
                          onClick={() => {
                            setGeneratedImage(undefined);
                          }}
                          style={styles.button}
                        >
                          Generate another
                        </Button>
                      </Col>
                    </Row>
                  </Alert>
                )}

                {user.screenshots_remaining === 0 && (
                  <b>You have no more remaining screenshots</b>
                )}

                {loaderData.userScreenshots && (
                  <>
                    <hr />
                    <p>
                      You have <b>{loaderData.userScreenshots.length}</b>{" "}
                      screenshots!
                    </p>
                    <Row>
                      {loaderData.userScreenshots.map((x, i) => (
                        <Col xs={12} md={6} lg={4} key={i}>
                          <Card style={styles.screenshotCard}>
                            <Card.Img variant="top" src={x.screenshot_url} />
                            <Card.Body>
                              <Card.Text>
                                Taken on{" "}
                                <i>{new Date(x.created_at).toDateString()}</i>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </>
                )}
              </>
            )}
          </>
        )}
      </Container>
    );
  } else {
    return <Login />;
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const res: IndexReponse = {
    success: true,
    signedIn: false,
    userData: null,
    userScreenshots: null,
    screenshotApiEndpoint: null,
  };
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("__session");

    if (userId === undefined) {
      return json(res);
    }

    const user = await SupabaseService.GetUser(userId);
    if (user === null) {
      console.log("User not found or error fetching user", user);
      return json({ ...res, success: false }, { status: 500 });
    }

    return json({
      ...res,
      signedIn: true,
      userData: user,
      userScreenshots: await SupabaseService.GetUsersScreenshots(user.id),
      screenshotApiEndpoint: process.env.SCREENSHOT_API_ENDPOINT,
    });
  } catch (error) {
    console.log(error);
    return json({
      ...res,
      success: false,
      signedIn: false,
      userData: null,
      userScreenshots: null,
      screenshotApiEndpoint: process.env.SCREENSHOT_API_ENDPOINT,
    });
  }
};

interface IndexReponse {
  success: boolean;
  signedIn: boolean;
  userData: UserData | null;
  userScreenshots: any[] | null;
  screenshotApiEndpoint: string | null;
}

export interface UserData {
  id: number;
  created_at: string;
  api_key: string;
  screenshots_remaining: number;
}
