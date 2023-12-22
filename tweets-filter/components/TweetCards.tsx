import { Card } from "react-bootstrap";
import { TweetV2 } from "twitter-api-v2";

export default function TweetCard({
  tweets,
  filterOption,
  username,
}: {
  tweets: TweetV2[] | null;
  filterOption: String;
  username: String;
}) {
  return (
    <>
      <hr></hr>
      {tweets! && (
        <div className="mb-4">
          <code>
            Showing {tweets.length} of the most recent tweets from @{username}{" "}
            sorted by most {filterOption}
          </code>
        </div>
      )}
      {tweets! &&
        tweets.map((x, index) => {
          return (
            <Card
              key={index}
              style={{ maxWidth: "500px", marginBottom: "25px" }}
            >
              <Card.Body>
                <p>{x.text}</p>
                {x.entities! && x.entities!.urls! && (
                  <a
                    href={x.entities.urls[0].expanded_url}
                    style={{ display: "block", marginBottom: "15px" }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {x.entities.urls[0].display_url}
                  </a>
                )}
                <span style={{ display: "inline-block", marginRight: "15px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="red"
                    className="bi bi-heart-fill"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                    />
                  </svg>{" "}
                  {x
                    .public_metrics!.like_count.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  likes
                </span>
                <span style={{ display: "inline-block", marginRight: "15px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="#0099ff"
                    className="bi bi-chat"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                  </svg>{" "}
                  {x
                    .public_metrics!.reply_count.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  replies
                </span>
                <span style={{ display: "inline-block" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="green"
                    className="bi bi-arrow-repeat"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                    <path
                      fillRule="evenodd"
                      d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                    />
                  </svg>{" "}
                  {x
                    .public_metrics!.retweet_count.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  retweets
                </span>
                <p className="mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-clock"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                  </svg>{" "}
                  Posted on{" "}
                  {new Date(x.created_at!).getMonth() +
                    1 +
                    "/" +
                    new Date(x.created_at!).getUTCDate() +
                    "/" +
                    new Date(x.created_at!).getFullYear()}
                </p>
              </Card.Body>
            </Card>
          );
        })}
    </>
  );
}
