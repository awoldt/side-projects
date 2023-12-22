import type { NextApiRequest, NextApiResponse } from "next";
import { USERS } from "../../../FUNCTIONS";
import { ObjectId } from "mongodb";

type Data = {
  status: number;
  channels?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //400
  if (req.cookies.account_id === undefined) {
    res.json({ status: 400 });
  }
  //200
  else {
    const acct = await USERS.find({
      _id: new ObjectId(req.cookies.account_id),
    }).toArray();

    //500
    if (acct.length === 0) {
      res.json({ status: 500 });
    }
    //200
    else {
      res.json({ status: 200, channels: acct[0].discord.owned_text_channels! });
    }
  }
}
