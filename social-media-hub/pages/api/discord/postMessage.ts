// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { GET_DISCORD_ACCESS_TOKEN } from "../../../FUNCTIONS";

type Data = {
  status: number;
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //400
  if (req.cookies.account_id === undefined) {
    res.json({ status: 400, msg: "You must be signed in" });
  }
  //200
  else {
    //even though you dont need a token to send message,
    //make sure user has token in account
    //dont unauthenticated requests made to this enpoint
    const token = await GET_DISCORD_ACCESS_TOKEN(req.cookies.account_id);

    //VALID TOKEN
    if (token!) {
      try {
        await axios.post(
          "https://discord.com/api/channels/" + req.body.guild_id + "/messages",
          {
            content: req.body.message,
          },
          {
            headers: {
              Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
            },
          }
        );

        res.json({ status: 200, msg: "Message successfully sent!" });
      } catch (e) {
        res.json({
          status: 500,
          msg: "You must allow access to channel before posting to it",
        });
      }
    }
    //NOT A VALID TOKEN
    else {
      res.json({
        status: 500,
        msg: "You must allow access to your discord account before posting",
      });
    }
  }
}
