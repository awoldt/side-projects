import type { NextApiRequest, NextApiResponse } from "next";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";

type Data = {
  status: number;
  account_id?: string;
  msg: string | null;
};

import { connectToDatabase, CREATE_ACCOUNT, USERS } from "../../FUNCTIONS";
connectToDatabase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //400
  if (
    req.body.email === undefined ||
    req.body.password === undefined ||
    req.body.c_password === undefined
  ) {
    res.json({ status: 400, msg: "Missing credentials" });
  }
  //200
  else {
    //make sure valid email AND strong password AND password and c_password match
    if (
      isEmail(req.body.email) &&
      isStrongPassword(req.body.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      }) &&
      req.body.password === req.body.c_password
    ) {
      //MAKE SURE EMAIL NOT ALREADY IN USE
      const acctsWithSameEmail = await USERS.find({
        email: req.body.email,
      }).toArray();

      //email not in use
      if (acctsWithSameEmail.length === 0) {
        const newAccountID = await CREATE_ACCOUNT(
          req.body.email,
          req.body.password
        );

        //500
        if (newAccountID === null) {
          res.json({
            status: 500,
            msg: "Error while creating account. Try again later.",
          });
        }
        //200
        else {
          res.json({ status: 200, account_id: newAccountID, msg: null });
        }
      }
      //email in use
      else {
        res.json({
          status: 400,
          msg: "Email already in use",
        });
      }
    }
    //cant create account
    //bad email or password or password and c_password don't match
    else {
      res.json({
        status: 400,
        msg: "Could not create account. Try checking your email and password.",
      });
    }
  }
}
