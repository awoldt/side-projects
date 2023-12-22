import axios from "axios";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { USERS } from "../../../FUNCTIONS";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.query.code === undefined) {
    console.log("there is no code in url");
    res.redirect("/");
  } else {
    try {
      //post this code to reddit and get access token in exchange
      const redditToken = await axios.post(
        "https://www.reddit.com/api/v1/access_token",
        {
          grant_type: "authorization_code",
          code: req.query.code,
          redirect_uri: process.env.REDDIT_REDIRECT_URI,
        },
        {
          headers: {
            Authorization: "Basic " + process.env.REDDIT_BASIC_BASE64_TOKEN,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      //update these access tokens in users mongod user docuemtn
      await USERS.updateOne(
        { _id: new ObjectId(req.cookies.account_id) },
        {
          $set: {
            reddit: {
              access_token: redditToken.data.access_token,
              expires_at: Date.now() / 1000 + redditToken.data.expires_in,
              refresh_token: redditToken.data.refresh_token,
            },
          },
        }
      );
      console.log("successfully authenticated reddit access token");

      res.redirect("/");
    } catch (e) {
      console.log(e);
      console.log("\nERROR: could not authenticate reddit access token");
      res.redirect("/");
    }
  }
}
