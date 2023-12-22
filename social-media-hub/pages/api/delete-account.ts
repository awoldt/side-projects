import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  status: number;
  msg: string;
};

import { connectToDatabase, DELETE_ACCOUNT } from "../../FUNCTIONS";
connectToDatabase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (await DELETE_ACCOUNT(req.cookies.account_id!)) {
    res.json({ status: 200, msg: "Account successfully deleted!" });
  } else {
    res.json({
      status: 500,
      msg: "There was an error while deleting your account",
    });
  }
}
