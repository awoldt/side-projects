import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  status: number;
  msg: string;
  new_tweet_data?: recent_tweet;
};

import { GET_TWITTER_ACCESS_TOKEN } from "../../../FUNCTIONS";
import recent_tweet from "../../../interface/twitter/recent_tweets";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //400
  if (req.cookies.account_id === undefined) {
    res.json({
      status: 400,
      msg: "You must sign in to Twitter before posting a tweet",
    });
  }
  //200
  else {
    const token = await GET_TWITTER_ACCESS_TOKEN(req.cookies.account_id!);

    //VALID TOKEN
    if (token!) {
      //make sure post is not more than 280 characters
      if (req.body.message.length <= 280) {
        try {
          const tweet = await axios.post(
            "https://api.twitter.com/2/tweets",
            {
              text: req.body.message.trim(),
            },
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-type": "application/json",
              },
            }
          );

          res.json({
            status: 200,
            msg: "Tweet successfully posted!",
            new_tweet_data: tweet.data.data,
          });
        } catch (e) {
          console.log("error while posting tweet :(");
          res.json({ status: 500, msg: "Error while posting tweet :(" });
        }
      }
      //more than 280 characters
      else {
        res.json({ status: 400, msg: "Tweets can only have 280 characters" });
      }
    }
    //INVALID TOKEN
    else {
      res.json({ status: 500, msg: "Error while posting tweet :(" });
    }
  }
}
