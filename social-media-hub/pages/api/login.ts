import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: number;

  account_id?: string;
};

import { connectToDatabase, USERS } from "../../FUNCTIONS";
connectToDatabase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const BODY = await JSON.parse(req.body);

  //400
  if (BODY.email === undefined || BODY.password === undefined) {
    res.json({ status: 400 });
  }
  //200
  else {
    const acct = await USERS.find({
      email: BODY.email.trim(),
      password: BODY.password.trim(),
    }).toArray();

    //400
    if (acct.length === 0) {
      res.json({ status: 400 });
    }
    //200
    else {
      res.json({ status: 200, account_id: acct[0]._id.toString() });
    }
  }
}
