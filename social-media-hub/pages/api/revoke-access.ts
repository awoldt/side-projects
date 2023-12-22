import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: number;
  msg: string;
};

import { connectToDatabase, USERS } from "../../FUNCTIONS";
connectToDatabase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //must have platform to revoke in body
  if (
    req.body.platform === "twitter" ||
    req.body.platform === "discord" ||
    req.body.platform === "reddit"
  ) {
    if (req.body.platform === "twitter") {
      await USERS.updateOne(
        { _id: new ObjectId(req.cookies.account_id) },
        {
          $set: {
            twitter: {
              access_token: null,
              refresh_token: null,
              expires_at: null,
            },
          },
        }
      );
      res.json({
        status: 200,
        msg: "Twitter account successfully disconnected",
      });
    } else if (req.body.platform === "discord") {
      await USERS.updateOne(
        { _id: new ObjectId(req.cookies.account_id) },
        {
          $set: {
            discord: {
              access_token: null,
              refresh_token: null,
              expires_at: null,
              owned_text_channels: null,
            },
          },
        }
      );
      res.json({
        status: 200,
        msg: "Discord account successfully disconnected",
      });
    } else {
      await USERS.updateOne(
        { _id: new ObjectId(req.cookies.account_id) },
        {
          $set: {
            reddit: {
              access_token: null,
              refresh_token: null,
              expires_at: null,
            },
          },
        }
      );
      res.json({
        status: 200,
        msg: "Reddit account successfully disconnected",
      });
    }
  } else {
    res.json({ status: 400, msg: "Bad request" });
  }
}
