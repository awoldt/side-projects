import type { NextApiRequest, NextApiResponse } from "next";
import { USERS } from "../../../FUNCTIONS";
import { ObjectId } from "mongodb";
import { authClient } from "../../../twitterAuthClient";

const authUrl = authClient.generateAuthURL({
  code_challenge_method: "s256",
  state: "vleck",
});

type Data = {
  name: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //if code query is not null, then request is redirect is from twitter auth page
  if (req.query.code !== undefined) {
    try {
      const accessToken = await authClient.requestAccessToken(
        String(req.query.code)
      );

      //save this access token in users mongodb document
      await USERS.updateOne(
        { _id: new ObjectId(req.cookies.account_id) },
        {
          $set: {
            twitter: {
              access_token: accessToken.token.access_token!,
              refresh_token: accessToken.token.refresh_token!,
              expires_at: accessToken.token.expires_at!,
            },
          },
        }
      );

      res.redirect("/");
    } catch (e) {
      console.log(e);
      console.log("\nERROR: could not authenticate twitter access token");
      res.redirect("/");
    }
  } else {
    //if no code then redirect to twitter auth page
    res.redirect(authUrl);
  }
}
