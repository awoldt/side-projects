import axios from "axios";
import { useRef, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import flairs from "../../interface/reddit/flair";
import reddit_me from "../../interface/reddit/me";
import { recent_post } from "../../interface/reddit/recent_posts";

export default function RedditInput({
  me,
  recentPosts,
  recentSubreddits,
}: {
  me: reddit_me | null;
  recentPosts: recent_post[] | null;
  recentSubreddits: string[] | null;
}) {
  const [subredditToPost, setSubredditToPost] = useState<string>("");
  const [redditTitle, setRedditTitle] = useState<string>("");
  const [redditText, setRedditText] = useState<string>("");

  const [recentPostData, setRecentPostData] = useState<recent_post[] | null>(
    recentPosts
  );

  const [subredditPostRequirementsHref, setSubredditPostRequirementsHref] =
    useState<string>("");

  const [showFlairInput, setShowFlairInput] = useState<boolean>(false);
  const [flairID, setFlairID] = useState<string | null>(null);
  const [subredditFlairs, setSubredditFlairs] = useState<flairs[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [postResponse, setPostResponse] = useState<string>("");

  const subredditInputRef = useRef<HTMLInputElement>(null);
  const subredditTitleRef = useRef<HTMLInputElement>(null);
  const subredditTextRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div
      style={{
        backgroundColor: "#FF4500",
        padding: "20px",
        borderRadius: "10px",
        border: "5px solid #942800",
      }}
    >
      <img src="/icons/reddit.svg" alt="reddit logo" />
      {me! && (
        <div style={{ float: "right" }}>
          <a
            title="Visit Reddit profile page"
            href={"https://www.reddit.com/user/" + me.name}
            target={"_blank"}
            rel="noreferrer"
            style={{
              textDecoration: "none",
              color: "black",
              fontWeight: "bold",
            }}
          >
            <img
              src={me.avatar}
              alt={me.name + " reddit profile image"}
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

      {recentSubreddits! && (
        <div className="text-center">
          <p style={{ color: "white", marginBottom: "0px" }}>
            Recent subreddits
          </p>
          <select
            style={{ marginBottom: "25px" }}
            onChange={(e) => {
              setSubredditToPost(e.target.value);
              subredditInputRef.current!.value = e.target.value;
            }}
          >
            <option></option>
            {recentSubreddits!.map((x: string, index: number) => {
              return (
                <option key={index} value={x}>
                  r/{x}
                </option>
              );
            })}
          </select>
        </div>
      )}
      <div style={{ padding: "15px" }}>
        <Form
          onSubmit={async (e) => {
            e.preventDefault();
          }}
          style={{ backgroundColor: "#FF4500", padding: "20px" }}
        >
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              onChange={(e) => {
                setSubredditToPost(e.target.value);
              }}
              ref={subredditInputRef}
              required
              placeholder="Subreddit"
              style={{
                border: "1px solid black",
                marginBottom: "5px",
                maxWidth: "80%",
              }}
            />
            <Form.Control
              type="text"
              ref={subredditTitleRef}
              onChange={(e) => {
                setRedditTitle(e.target.value);
              }}
              required
              placeholder="Title"
              style={{
                border: "1px solid black",
                marginBottom: "5px",
                maxWidth: "80%",
              }}
            />
            <Form.Control
              as={"textarea"}
              ref={subredditTextRef}
              onChange={(e) => {
                setRedditText(e.target.value);
              }}
              required
              placeholder="Post"
              style={{ border: "1px solid black", marginBottom: "5px" }}
            />
            {showFlairInput && (
              <>
                <p style={{ color: "white", marginTop: "50px" }}>
                  Please attach a flair to your post
                </p>
                <Form.Select
                  onChange={(e) => {
                    setFlairID(e.target.value);
                  }}
                >
                  {subredditFlairs.map((x, index) => {
                    return (
                      <option key={index} value={x.id}>
                        {x.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </>
            )}
          </Form.Group>

          {postResponse !== "" &&
            subredditToPost === "" &&
            redditTitle === "" &&
            redditText === "" && (
              <>
                <code style={{ color: "white" }}>
                  <b>{postResponse}</b>
                </code>
                {subredditPostRequirementsHref !== "" &&
                  postResponse.includes("minimum karma") && (
                    <p style={{ color: "white", marginTop: "15px" }}>
                      Check{" "}
                      <a
                        href={subredditPostRequirementsHref}
                        target="_blank"
                        rel="noreferrer"
                      >
                        here
                      </a>{" "}
                      to learn more about post requirements for this subreddit
                    </p>
                  )}
              </>
            )}
          {loading && <Spinner animation="grow" style={{ color: "#942800" }} />}
          {redditTitle !== "" &&
            subredditToPost !== "" &&
            redditText !== "" &&
            !loading && (
              <Button
                style={{
                  backgroundColor: "#942800",
                  border: "none",
                  marginBottom: "10px",
                }}
                type="submit"
                onClick={async () => {
                  setLoading(true);
                  const req = await axios.post("/api/reddit/submitPost", {
                    sr: subredditToPost,
                    title: redditTitle,
                    text: redditText,
                    flair_id: flairID,
                  });

                  if (req.data.status === 200) {
                    const x = [...recentPostData!];
                    x.pop();
                    x.unshift({
                      text: redditText,
                      subreddit: subredditToPost,
                      href: req.data.NEW_POST_URL,
                    });
                    setRecentPostData(x);

                    setPostResponse(req.data.msg);
                    setSubredditToPost("");
                    setRedditTitle("");
                    setRedditText("");

                    if (subredditPostRequirementsHref !== "") {
                      setSubredditPostRequirementsHref("");
                    }

                    if (showFlairInput) {
                      setShowFlairInput(false);
                      setFlairID(null);
                    }

                    subredditInputRef.current!.value = "";
                    subredditTitleRef.current!.value = "";
                    subredditTextRef.current!.value = "";
                    setLoading(false);
                  }
                  //need to add flair
                  else if (req.data.status === 569) {
                    setShowFlairInput(true);
                    setSubredditFlairs(req.data.flair_data);
                    setFlairID(req.data.flair_data[0].id); //default flair is the first one returned

                    if (subredditPostRequirementsHref !== "") {
                      setSubredditPostRequirementsHref("");
                    }

                    setLoading(false);
                  }
                  //subreddit does not exist
                  else if (req.data.status === 404) {
                    setSubredditToPost("");
                    setRedditTitle("");
                    setRedditText("");
                    setPostResponse(req.data.msg);
                    subredditInputRef.current!.value = "";
                    subredditTitleRef.current!.value = "";
                    subredditTextRef.current!.value = "";
                    setLoading(false);
                  }
                  //any other error message
                  else {
                    setSubredditToPost("");
                    setRedditTitle("");
                    setRedditText("");
                    setPostResponse(req.data.msg);
                    //add link to subreddit for post help
                    setSubredditPostRequirementsHref(req.data.subreddit_href);
                    subredditInputRef.current!.value = "";
                    subredditTitleRef.current!.value = "";
                    subredditTextRef.current!.value = "";
                    setLoading(false);
                  }
                }}
              >
                Post to r/{subredditToPost}
              </Button>
            )}

          {recentPostData !== null && recentPostData.length > 0 && (
            <>
              <p style={{ color: "white", marginBottom: "0px" }}>
                Some of the recent posts to Reddit
              </p>
              {recentPostData!.map((x: recent_post, index: number) => {
                if (x.href === "new_post") {
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#fc7c4c",
                        marginBottom: "5px",
                        padding: "1px 1px 1px 10px",
                      }}
                    >
                      <code
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <b>New post</b>
                      </code>
                      <a
                        href={""}
                        style={{ textDecoration: "none", color: "black" }}
                        rel="noreferrer"
                        target={"_blank"}
                      >
                        <span>
                          Posted to <b>r/{x.subreddit}</b>
                        </span>
                        <p>{x.text}</p>
                      </a>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#fc7c4c",
                        marginBottom: "5px",
                        padding: "1px 1px 1px 10px",
                      }}
                    >
                      <a
                        href={x.href}
                        style={{ textDecoration: "none", color: "black" }}
                        rel="noreferrer"
                        target={"_blank"}
                      >
                        <span>
                          Posted to <b>r/{x.subreddit}</b>
                        </span>
                        <p>{x.text}</p>
                      </a>
                    </div>
                  );
                }
              })}
            </>
          )}

          {recentPostData !== null && recentPostData.length === 0 && (
            <p>You have not yet posted to any subreddit</p>
          )}
        </Form>
      </div>
    </div>
  );
}
