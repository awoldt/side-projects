import type { NextApiRequest, NextApiResponse } from "next";
import { TwitterApi } from "twitter-api-v2";
import { TweetV2 } from "../../node_modules/twitter-api-v2";
import { author_data } from "../../interfaces";

type Data = {
  tweetData: TweetV2[] | null;
  authorData: author_data | null;
};

///////////////////////////////////////////////////////////////////////////

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const userClient = new TwitterApi(String(process.env.TWITTER_TOKEN));
    const readOnlyClient = userClient.readOnly;

    //MAKE SURE THERE IS A USERNAME QUERY IN URL
    //200
    if (req.query.hasOwnProperty("username")) {
      //1. GET USER ID FROM USERNAME
      try {
        const data = await readOnlyClient.v2.userByUsername(
          String(req.query.username)
        );
        //2. GET TIMELINE BASED ON USER ID
        try {
          const data2 = await readOnlyClient.v2.userTimeline(data.data.id, {
            exclude: ["replies", "retweets"],
            max_results: 100,
            "tweet.fields": ["public_metrics", "entities", "created_at"],
          });

          //depending on filter set on frontend, filter tweets sent back
          //based on filterToDisplay state on index page
          if (req.query.filter!) {
            if (req.query.filter == "likes") {
              data2.data.data.sort((a: any, b: any) => {
                return (
                  b.public_metrics.like_count - a.public_metrics.like_count
                );
              });
            } else if (req.query.filter == "replies") {
              data2.data.data.sort((a: any, b: any) => {
                return (
                  b.public_metrics.reply_count - a.public_metrics.reply_count
                );
              });
            } else if (req.query.filter == "retweets") {
              data2.data.data.sort((a: any, b: any) => {
                return (
                  b.public_metrics.retweet_count -
                  a.public_metrics.retweet_count
                );
              });
            }
            //just return by likes
            else {
              console.log(
                "error while filtering tweets, sending by filtered by likes"
              );
              data2.data.data.sort((a: any, b: any) => {
                return (
                  b.public_metrics.like_count - a.public_metrics.like_count
                );
              });
            }
          } else {
            console.log(
              "error while filtering tweets, sending by filtered by likes"
            );
            data2.data.data.sort((a: any, b: any) => {
              return b.public_metrics.like_count - a.public_metrics.like_count;
            });
          }

          //3. GET AUTHOR DATA
          try {
            //profile pic
            const authorPROFILE = await readOnlyClient.v2.user(data.data.id, {
              "user.fields": ["profile_image_url"],
            });

            const a: author_data = {
              author_id: data.data.id,
              author_name: data.data.name,
              author_username: data.data.username,
              author_profile_picture: authorPROFILE.data.profile_image_url,
            };

            res.status(200).json({ tweetData: data2.data.data, authorData: a });
          } catch (e) {
            console.log("error getting artist media data :(");
            res.status(500).json({ tweetData: null, authorData: null });
          }
        } catch (e) {
          console.log("error while getting user timeline by user ID :(");
          res.status(500).json({ tweetData: null, authorData: null });
        }
      } catch (e) {
        console.log("error while getting user by username :(");
        res.status(500).json({ tweetData: null, authorData: null });
      }
    }
    //400
    else {
      res.status(400).json({ tweetData: null, authorData: null });
    }
  } catch (e) {
    console.log(e);
    console.log("could not authenticate twitter app :(");
    res.status(500).json({ tweetData: null, authorData: null });
  }
}
