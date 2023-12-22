import axios from "axios";
import { useState, useRef } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import twitter_me from "../../interface/twitter/me";
import recent_tweet from "../../interface/twitter/recent_tweets";

export default function TwitterInput({
  me,
  recentTweets,
}: {
  me: twitter_me | null;
  recentTweets: recent_tweet[] | null;
}) {
  const [tweetText, setTweetText] = useState<string>("");
  const [tweetResponse, setTweetResponse] = useState<string>(""); //the response msg from the post request submitting a tweet
  const [loading, setLoading] = useState<boolean>(false);

  const [pastTweets, setPastTweets] = useState<recent_tweet[] | null>(
    recentTweets
  );

  const tweetTextareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      style={{
        backgroundColor: "#1DA1F2",
        padding: "20px",
        borderRadius: "10px",
        border: "5px solid #126aa1",
      }}
    >
      <img src="/icons/twitter.svg" alt="twitter logo" />
      {me! && (
        <div style={{ float: "right" }}>
          <a
            rel="noreferrer"
            title="Visit Twitter profile page"
            href={"https://twitter.com/" + me.username}
            target={"_blank"}
            style={{
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
            }}
          >
            <img
              src={me.profile_image_url}
              alt={me.username + " twitter profile image"}
              style={{
                marginRight: "10px",
                borderRadius: "35px",
                width: "50px",
              }}
            />
            <span>{me.name}</span>
          </a>
        </div>
      )}
      <div style={{ padding: "15px" }}>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
          }}
        >
          <Form.Group className="mb-3">
            <Form.Control
              placeholder="Tweet"
              ref={tweetTextareaRef}
              as={"textarea"}
              onChange={(e) => {
                setTweetText(e.target.value);
              }}
              required
              style={{ border: "1px solid black" }}
              maxLength={280}
            />
          </Form.Group>

          {loading && <Spinner animation="grow" style={{ color: "#126aa1" }} />}
          {tweetText !== "" && !loading && (
            <Button
              style={{
                backgroundColor: "#126aa1",
                border: "none",
                marginBottom: "25px",
              }}
              type="submit"
              onClick={async () => {
                setLoading(true);
                const req = await axios.post("/api/twitter/postTweet", {
                  message: tweetText,
                });
                if (req.data.status === 200) {
                  setLoading(false);
                  setTweetText("");
                  setTweetResponse(req.data.msg);
                  const x = [...pastTweets!];
                  x.pop();
                  x.unshift(req.data.new_tweet_data);
                  setPastTweets(x);
                  tweetTextareaRef.current!.value = "";
                } else {
                  setLoading(false);
                  setTweetResponse(req.data.msg);
                  tweetTextareaRef.current!.value = "";
                }
              }}
            >
              Tweet
            </Button>
          )}
          {tweetResponse !== "" && tweetText === "" && (
            <code
              style={{ color: "white", marginBottom: "25px", display: "block" }}
            >
              <b>{tweetResponse}</b>
            </code>
          )}

          {pastTweets !== null && (
            <>
              <p style={{ color: "white" }}>
                Here are {pastTweets!.length} of your most recent tweets
              </p>
              {pastTweets!.map((x, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#87cbf5",
                      marginBottom: "5px",
                      padding: "1px 1px 1px 10px",
                    }}
                  >
                    <a
                      href={"https://twitter.com/awoldt23/status/" + x.id}
                      style={{ textDecoration: "none", color: "black" }}
                      rel="noreferrer"
                      target={"_blank"}
                    >
                      <p>{x.text}</p>
                    </a>
                  </div>
                );
              })}
            </>
          )}
          {pastTweets === null && (
            <p>You have not yet tweeted from this account</p>
          )}
        </Form>
      </div>
    </div>
  );
}
