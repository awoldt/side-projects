import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { USERS } from "../../../FUNCTIONS";
import { ObjectId } from "mongodb";
import { text_channel_data } from "../../../interface/user";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //500
  if (req.query.code === undefined) {
    console.log("there is no code in url");
    res.redirect("/");
  }
  //200
  else {
    try {
      //exchange code for access token
      const tokenData = await axios.post(
        "https://discord.com/api/oauth2/token",
        {
          client_id: String(process.env.DISCORD_CLIENT_ID),
          client_secret: String(process.env.DISCORD_CLIENT_SECRET),
          grant_type: "authorization_code",
          code: req.query.code,
          redirect_uri: process.env.DISCORD_REDIRECT_URI,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      //get the text channel from the selected server
      const serverChannels = await axios.get(
        "https://discord.com/api/guilds/" +
          tokenData.data.guild.id +
          "/channels",
        {
          headers: {
            Authorization: "Bot " + process.env.DISCORD_BOT_TOKEN,
          },
        }
      );

      let channelInfo: text_channel_data | null = null;
      //add the first channel that has type === 0 (text channel)
      for (let index = 0; index < serverChannels.data.length; index++) {
        if (serverChannels.data[index].type === 0) {
          const x: text_channel_data = {
            server_name: tokenData.data.guild.name,
            id: serverChannels.data[index].id,
          };
          channelInfo = x;

          break;
        }
      }

      const account = await USERS.find({
        _id: new ObjectId(req.cookies.account_id),
      }).toArray();

      //first channel added to account (first time user has connected discord account)
      if (account[0].discord.owned_text_channels === null) {
        await USERS.updateOne(
          { _id: new ObjectId(req.cookies.account_id) },
          {
            $set: {
              discord: {
                access_token: tokenData.data.access_token,
                expires_at: Date.now() / 1000 + tokenData.data.expires_in,
                refresh_token: tokenData.data.refresh_token,
                owned_text_channels: [channelInfo!],
              },
            },
          }
        );
        console.log("successfully authenticated discord access token");

        res.redirect("/");
      }
      //user already has channels added
      else {
        //only add channel to account if user has not already authorized it

        let alreadyAdded: boolean = false;
        for (
          let index = 0;
          index < account[0].discord.owned_text_channels.length;
          index++
        ) {
          if (
            account[0].discord.owned_text_channels[index].id === channelInfo!.id
          ) {
            alreadyAdded = true;
            break;
          }
        }

        //user has not added this channel yet
        if (!alreadyAdded) {
          let channels = account[0].discord.owned_text_channels;
          channels.push(channelInfo!);

          await USERS.updateOne(
            { _id: new ObjectId(req.cookies.account_id) },
            {
              $set: {
                discord: {
                  access_token: account[0].discord.access_token,
                  expires_at: account[0].discord.expires_at,
                  refresh_token: account[0].discord.refresh_token,
                  owned_text_channels: channels,
                },
              },
            }
          );

          res.redirect("/");
        }
        //this channel is already added to users account
        //simply redirect and dont change anything in database
        else {
          console.log("user has already added discord channel to account");

          res.redirect("/");
        }
      }
    } catch (e) {
      console.log("\nERROR: could not authenticate discord access token");
      res.redirect("/");
    }
  }
}
