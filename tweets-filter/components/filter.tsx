import { TweetV2 } from "../node_modules/twitter-api-v2";

export default function Filter({
  tweetsShallowCopy,
  displayErrorMessage,
  setTweetsShallowCopy,
  setFilterToDisplay,
  setNumOfTweetsToDisplay,
}: {
  tweetsShallowCopy: TweetV2[] | null;
  displayErrorMessage: boolean;
  setTweetsShallowCopy: React.Dispatch<React.SetStateAction<TweetV2[] | null>>;
  setFilterToDisplay: React.Dispatch<React.SetStateAction<string>>;
  setNumOfTweetsToDisplay: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <>
      {tweetsShallowCopy! && displayErrorMessage !== true && (
        <div>
          <label htmlFor="tweet_filter">Sort tweets by</label>
          <select
            id="tweet_filter"
            style={{
              marginRight: "20px",
              marginBottom: "5px",
              display: "block",
            }}
            onChange={(e) => {
              if (e.target.value == "likes") {
                let x = [...tweetsShallowCopy!];
                x.sort((a: any, b: any) => {
                  return (
                    b.public_metrics.like_count - a.public_metrics.like_count
                  );
                });
                setTweetsShallowCopy(x);
                setFilterToDisplay("likes");
              }
              if (e.target.value == "replies") {
                let x = [...tweetsShallowCopy!];
                x.sort((a: any, b: any) => {
                  return (
                    b.public_metrics.reply_count - a.public_metrics.reply_count
                  );
                });
                setTweetsShallowCopy(x);
                setFilterToDisplay("replies");
              }
              if (e.target.value == "retweets") {
                let x = [...tweetsShallowCopy!];
                x.sort((a: any, b: any) => {
                  return (
                    b.public_metrics.retweet_count -
                    a.public_metrics.retweet_count
                  );
                });
                setTweetsShallowCopy(x);
                setFilterToDisplay("retweets");
              }
            }}
          >
            <option value={"likes"}>Likes</option>
            <option value={"replies"}>Replies</option>
            <option value={"retweets"}>Retweets</option>
          </select>
          <label htmlFor="results_per_page">Results per page</label>
          <select
            id="results_per_page"
            style={{ display: "block", marginBottom: "25px" }}
            onChange={(e) => {
              setNumOfTweetsToDisplay(Number(e.target.value));
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={75}>75</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
    </>
  );
}
