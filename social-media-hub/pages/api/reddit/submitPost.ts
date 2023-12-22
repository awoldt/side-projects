import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  status: number;
  msg: string;
  subreddit_href?: string;
  flair_data?: flairs[];
  NEW_POST_URL?: string | null;
};

import { GET_REDDIT_ACCESS_TOKEN, USERS } from "../../../FUNCTIONS";
import flairs from "../../../interface/reddit/flair";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //400
  if (req.cookies.account_id === undefined) {
    res.json({ status: 400, msg: "NOT OK!" });
  }
  //200
  else {
    const token = await GET_REDDIT_ACCESS_TOKEN(req.cookies.account_id!);

    //VALID TOKEN
    if (token!) {
      //make sure post requirements are met before submitting post
      try {
        const postRequirements = await axios.get(
          "https://oauth.reddit.com/api/v1/" +
            req.body.sr.trim() +
            "/post_requirements",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        let requiresFlair: boolean = false;
        let flairData: flairs[] = [];
        //1. FLAIR IS REQUIRED
        //send back flair ids for user to post on
        //only execute this if statement if flair_id is not present in req body
        if (postRequirements.data.is_flair_required) {
          requiresFlair = true;

          const flairRequirments = await axios.get(
            "https://oauth.reddit.com/r/" +
              req.body.sr.trim() +
              "/api/link_flair_v2.json",
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          //send back all flair ids and names
          flairData = flairRequirments.data.map((x: any) => {
            return {
              name: x.text,
              id: x.id,
            };
          });
        }

        //attempt to post message to subreddit
        try {
          const post = await axios.post(
            "https://oauth.reddit.com/api/submit",
            {
              sr: req.body.sr.trim(),
              title: req.body.title.trim(),
              kind: "self",
              text: req.body.text.trim(),
              flair_id: req.body.flair_id,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          if (post.data.success) {
            let NEW_POST_LINK: string | null = null;

            for (let index = 0; index < post.data.jquery.length; index++) {
              for (
                let index2 = 0;
                index2 < post.data.jquery[index].length;
                index2++
              ) {
                if (typeof post.data.jquery[index][index2] === "object") {
                  if (
                    post.data.jquery[index][index2].length !== 0 &&
                    post.data.jquery[index][index2][0].includes("https")
                  ) {
                    NEW_POST_LINK = post.data.jquery[index][index2][0];
                    break;
                  }
                }
              }
            }

            res.json({
              status: 200,
              msg: "Successfully posted on r/" + req.body.sr.trim(),
              NEW_POST_URL: NEW_POST_LINK,
            });
          } else {
            //post failed because user needs to add flair
            if (requiresFlair) {
              res.json({
                status: 569,
                msg:
                  "Could not post to r/" +
                  req.body.sr.trim() +
                  " becuase posts to this subreddit require a flair on each post. Check subreddit for flairs to use.",
                flair_data: flairData,
              });
            }
            //any other error that made it fail
            else {
              res.json({
                status: 500,
                msg:
                  "Could not post to r/" +
                  req.body.sr.trim() +
                  ", some subreddits require a minimum karma to post or each post must be approved by moderators.",
                subreddit_href:
                  "https://www.reddit.com/r/" + req.body.sr.trim(),
              });
            }
          }
        } catch (e) {
          res.json({
            status: 500,
            msg:
              "Error while posting to " +
              req.body.sr.trim() +
              ". That subreddit might not exist.",
          });
        }
      } catch (e) {
        console.log("could not verify post requirements for this subreddit :(");
        res.json({
          status: 404,
          msg: "r/" + req.body.sr.trim() + " does not exist",
        });
      }
    }
    //NOT VALID TOKEN
    else {
      res.json({ status: 400, msg: "not a valid token" });
    }
  }
}
