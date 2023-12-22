import type { NextPage } from "next";
import { useState, useEffect } from "react";
import axios from "axios";
import { TweetV2 } from "../node_modules/twitter-api-v2";
import { Container, Spinner, Alert, Row, Col } from "react-bootstrap";
import TweetCard from "../components/TweetCards";
import { author_data } from "../interfaces";
import AuthorBanner from "../components/AuthorBanner";
import Head from "next/head";
import Filter from "../components/filter";

const Home: NextPage = () => {
  const [usernameQuery, setUsernameQuery] = useState<string>("");
  const [tweets, setTweets] = useState<TweetV2[] | null>(null); //contains all 100 tweets returned
  const [authorData, setAuthorData] = useState<author_data | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tweetsShallowCopy, setTweetsShallowCopy] = useState<TweetV2[] | null>(
    null
  ); //the tweets being displayed on screen, could be 25, 50, 75, or all 100 tweets displayed
  const [numOfTweetsToDisplay, setNumOfTweetsToDisplay] = useState<number>(25); //default is 25
  const [filterToDisplay, setFilterToDisplay] = useState<string>("likes"); //default is filtered by likes
  const [usernameToDisplay, setUsernameToDisplay] = useState<string>("");
  const [displayErrorMessage, setDisplayErrorMessage] =
    useState<boolean>(false);

  useEffect(() => {
    if (tweets!) {
      const x = [...tweets];
      if (x.length < numOfTweetsToDisplay) {
        setTweetsShallowCopy(x);
      } else {
        x.length = numOfTweetsToDisplay;
        setTweetsShallowCopy(x);
      }
    }
  }, [numOfTweetsToDisplay]);

  return (
    <>
      <Head>
        <title>Tweet Filter</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>
      <Container
        style={{ backgroundColor: "#1DA1F2", padding: "25px 0px 25px 0px" }}
        fluid
      >
        <Container>
          <div className="mt-5 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              fill="white"
              className="bi bi-twitter"
              viewBox="0 0 16 16"
            >
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </div>
          <p style={{ maxWidth: "400px" }}>
            Search for any public profile&apos;s username and get their most
            recent tweets filtered by the amount of likes, replies, or retweets.
          </p>

          {!loading && (
            <div style={{ marginBottom: "25px" }}>
              <input
                type="text"
                placeholder="ex: elonmusk"
                onChange={(e) => {
                  setUsernameQuery(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    if (usernameQuery !== "") {
                      displayErrorMessage == true
                        ? setDisplayErrorMessage(false)
                        : null;
                      setLoading(true);
                      try {
                        const data = await axios.get(
                          "/api/timeline?username=" +
                            usernameQuery +
                            "&filter=" +
                            filterToDisplay
                        );
                        console.log(data.data);
                        setTweets(data.data.tweetData);
                        setAuthorData(data.data.authorData);
                        setUsernameToDisplay(usernameQuery);
                        setLoading(false);
                        const x = [...data.data.tweetData];
                        if (x.length < numOfTweetsToDisplay) {
                          setTweetsShallowCopy(x);
                        } else {
                          x.length = numOfTweetsToDisplay;
                          setTweetsShallowCopy(x);
                        }
                      } catch (e) {
                        setLoading(false);
                        setDisplayErrorMessage(true);
                      }
                    }
                  }
                }}
              />
              <button
                style={{ marginLeft: "5px" }}
                onClick={async () => {
                  if (usernameQuery !== "") {
                    displayErrorMessage == true
                      ? setDisplayErrorMessage(false)
                      : null;
                    setLoading(true);
                    try {
                      const data = await axios.get(
                        "/api/timeline?username=" +
                          usernameQuery +
                          "&filter=" +
                          filterToDisplay
                      );
                      console.log(data.data);
                      setTweets(data.data.tweetData);
                      setAuthorData(data.data.authorData);
                      setUsernameToDisplay(usernameQuery);
                      setLoading(false);
                      const x = [...data.data.tweetData];
                      if (x.length < numOfTweetsToDisplay) {
                        setTweetsShallowCopy(x);
                      } else {
                        x.length = numOfTweetsToDisplay;
                        setTweetsShallowCopy(x);
                      }
                    } catch (e) {
                      setLoading(false);
                      setDisplayErrorMessage(true);
                    }
                  }
                }}
              >
                Search
              </button>
            </div>
          )}

          {loading && <Spinner animation="border" variant="light" />}

          {displayErrorMessage && (
            <Alert variant="danger">
              Cannot fetch tweets with current username. This could be due to
              account not existing or no tweets.
            </Alert>
          )}
        </Container>
      </Container>
      <Container fluid style={{ backgroundColor: "white" }}>
        <Container style={{ paddingTop: "25px" }}>
          <Row>
            <Col lg={6}>
              {authorData! && <AuthorBanner authorData={authorData} />}
            </Col>
            <Col lg={6}>
              {tweetsShallowCopy! && displayErrorMessage !== true && (
                <>
                  <Filter
                    tweetsShallowCopy={tweetsShallowCopy}
                    displayErrorMessage={displayErrorMessage}
                    setTweetsShallowCopy={setTweetsShallowCopy}
                    setFilterToDisplay={setFilterToDisplay}
                    setNumOfTweetsToDisplay={setNumOfTweetsToDisplay}
                  />
                  <TweetCard
                    tweets={tweetsShallowCopy}
                    filterOption={filterToDisplay}
                    username={usernameToDisplay}
                  />
                </>
              )}
            </Col>
          </Row>

          <p
            className="text-secondary"
            style={{ marginTop: "100px", marginBottom: "0px" }}
          >
            All data gathered using Twitter API. This site has no affiliation
            with Twitter.
          </p>

          <span
            style={{
              display: "block",
              marginTop: "10px",
              marginBottom: "25px",
            }}
          >
            <a
              href="https://awoldt.com/"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", color: "#6c757d" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-brush"
                viewBox="0 0 16 16"
              >
                <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04zM4.705 11.912a1.23 1.23 0 0 0-.419-.1c-.246-.013-.573.05-.879.479-.197.275-.355.532-.5.777l-.105.177c-.106.181-.213.362-.32.528a3.39 3.39 0 0 1-.76.861c.69.112 1.736.111 2.657-.12.559-.139.843-.569.993-1.06a3.122 3.122 0 0 0 .126-.75l-.793-.792zm1.44.026c.12-.04.277-.1.458-.183a5.068 5.068 0 0 0 1.535-1.1c1.9-1.996 4.412-5.57 6.052-8.631-2.59 1.927-5.566 4.66-7.302 6.792-.442.543-.795 1.243-1.042 1.826-.121.288-.214.54-.275.72v.001l.575.575zm-4.973 3.04.007-.005a.031.031 0 0 1-.007.004zm3.582-3.043.002.001h-.002z" />
              </svg>
              Made by awoldt
            </a>
          </span>
        </Container>
      </Container>
    </>
  );
};

export default Home;
