import React from "react";
import PrivatePoll from "./PrivatePoll";
import Head from "next/head";
import { Container, Row, Col, Button } from "react-bootstrap";
import SocialShareBtns from "./SocialShareBtns";
import { useState, useEffect } from "react";
import Chart from "./chart";
import axios from "axios";

const MultipleChoiceDisplay = ({
  data,
  already_voted,
  social_share_data,
  vote_percentage,
  account_cookie, //this is just account document id if not false
}) => {
  const [answer, setAnswer] = useState(null);
  const [value, setValue] = useState(null);
  const [recentVote, setRecentVote] = useState(null);

  console.log(data);

  async function vote(poll) {
    //user is signed in
    if (account_cookie !== false) {
      const data = await axios.post("/api/poll-data", {
        action: "vote",
        id: poll._id,
        answer: answer,
        value: value,
        account: account_cookie,
      });
      console.log(data);

      if (data.data.status === "ok") {
        window.location.reload();
      }
    }
    //user is not signed in
    else {
      alert("You must be signed in to vote");
    }
  }

  useEffect(() => {
    const getAnswer = async (acct_id) => {
      const data = await axios.post("/api/account", {
        action: "get_current_vote",
        id: acct_id,
      });
      console.log(data);
      setRecentVote(data.data.user_vote);
    };

    //if user has already voted, display recent vote
    if (already_voted) {
      getAnswer(account_cookie);
    }
  }, []);

  if (data.private_poll) {
    return <PrivatePoll />;
  } else {
    //USER HAS ALREADY VOTED
    //MEANS USER HAS TO BE SIGNED IN
    if (already_voted) {
      return (
        <>
          <Head>
            <title>{data.poll_data.title}</title>
          </Head>
          <Container className="p-4">
            <Row>
              <Col lg={true}>
                <h1>{data.poll_data.title}</h1>
                <i className="text-secondary">
                  poll created on {data.poll_data.createdAtClean}
                </i>{" "}
                {data.poll_data.tagDisplay !== "" && (
                  <a
                    href={"/p?tag=" + data.poll_data.tag}
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                        backgroundColor: "red",
                        padding: "5px",
                        borderRadius: "10px",
                        color: "white",
                        marginLeft: "15px",
                      }}
                    >
                      {data.poll_data.tagDisplay}
                    </span>
                  </a>
                )}
                <SocialShareBtns site_url={social_share_data} />
                <p>{data.poll_data.description}</p>
                <ul style={{ listStyleType: "none" }}>
                  {data.poll_data.responseChoices.map((x, index) => {
                    return (
                      <li key={index}>
                        <Button style={{ marginBottom: "10px" }}>
                          {x.text}
                        </Button>{" "}
                        {data.poll_data.responseAnswers.length !== 0 && (
                          <span style={{ marginLeft: "15px" }}>
                            {data.vote_percentages[index]}%
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <i style={{ color: "red" }}>
                  You have already voted ({recentVote})
                </i>
              </Col>
              <Col lg={true}>
                {data.poll_data.responseAnswers.length !== 0 && (
                  <Chart
                    title={data.poll_data.title}
                    dataPoints={data.poll_data.responseChoices}
                    dataAnswers={data.poll_data.responseAnswers}
                  />
                )}
                {data.poll_data.responseAnswers.length === 0 && (
                  <p>Chart will apear after votes come in</p>
                )}
              </Col>
            </Row>
          </Container>
        </>
      );
      //USER HAS NOT VOTED YET
    } else {
      return (
        <>
          <Head>
            <title>{data.poll_data.title}</title>
            <meta
              property="og:title"
              content={"Poll: " + data.poll_data.title}
            />
          </Head>
          <Container className="p-4">
            <Row>
              <Col lg={true}>
                <h1>{data.poll_data.title}</h1>
                <i className="text-secondary">
                  poll created on {data.poll_data.createdAtClean}
                </i>{" "}
                {data.poll_data.tagDisplay !== "" && (
                  <a
                    href={"/p?tag=" + data.poll_data.tag}
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                        backgroundColor: "red",
                        padding: "5px",
                        borderRadius: "10px",
                        color: "white",
                        marginLeft: "15px",
                      }}
                    >
                      {data.poll_data.tagDisplay}
                    </span>
                  </a>
                )}
                <SocialShareBtns site_url={social_share_data} />
                <p>{data.poll_data.description}</p>
                <ul style={{ listStyleType: "none" }}>
                  {data.poll_data.responseChoices.map((x, index) => {
                    return (
                      <li key={index} style={{ marginBottom: "10px" }}>
                        <Button
                          onClick={() => {
                            setAnswer(x.choice);
                            setValue(x.text);
                          }}
                          variant="light"
                          style={{ border: "1px solid black" }}
                          onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#0d6efd";
                          }}
                          onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#f8f9fa";
                          }}
                        >
                          {x.text}
                        </Button>{" "}
                        {data.poll_data.responseAnswers.length !== 0 && (
                          <span style={{ marginLeft: "15px" }}>
                            {data.vote_percentages[index]}%
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <p>
                  There are {data.poll_data.responseAnswers.length} votes on
                  this poll
                </p>
                <br></br>
                <p>answer - {answer}</p>
                <Button
                  variant="danger"
                  onClick={() => {
                    vote(data.poll_data);
                  }}
                >
                  Submit
                </Button>
              </Col>
              <Col lg={true}>
                {data.poll_data.responseAnswers.length !== 0 && (
                  <Chart
                    title={data.poll_data.title}
                    dataPoints={data.poll_data.responseChoices}
                    dataAnswers={data.poll_data.responseAnswers}
                  />
                )}
                {data.poll_data.responseAnswers.length === 0 && (
                  <p>Chart will apear after votes come in</p>
                )}
              </Col>
            </Row>
          </Container>
        </>
      );
    }
  }
};

export default MultipleChoiceDisplay;
