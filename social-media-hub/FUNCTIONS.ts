import axios from "axios";
import { MongoClient, ObjectId } from "mongodb";
import account_settings from "./interface/account_settings";
import discord_me from "./interface/discord/me";
import reddit_me from "./interface/reddit/me";
import { recent_post } from "./interface/reddit/recent_posts";
import twitter_me from "./interface/twitter/me";
import recent_tweets from "./interface/twitter/recent_tweets";
import user from "./interface/user";
const client = new MongoClient(process.env.MONGODB_CONNECTION!);
export const USERS = client.db(process.env.DB).collection<user>("users");

export async function connectToDatabase() {
  try {
    console.log("==== connecting to database ====");
    await client.connect();
    console.log("==== successfully connected to database! ====");
  } catch (e) {
    console.log("could not connect to database :(");
  }
}

export async function IS_USER_SIGNED_IN(cookies: any) {
  try {
    if (cookies.account_id === undefined) {
      return false;
    } else {
      //make sure account id is valid in database
      const acct = await USERS.find({
        _id: new ObjectId(cookies.account_id),
      }).toArray();

      if (acct.length === 0) {
        return false;
      } else {
        return true;
      }
    }
  } catch (e) {
    console.log("ERROR: could not detect if user is signed in :(");
    return false;
  }
}

export async function CREATE_ACCOUNT(email: string, password: string) {
  try {
    const x: user = {
      email: email.trim(),
      password: password.trim(),
      twitter: {
        access_token: null,
        refresh_token: null,
        expires_at: null,
      },
      discord: {
        access_token: null,
        refresh_token: null,
        expires_at: null,
        owned_text_channels: null,
      },
      reddit: {
        access_token: null,
        refresh_token: null,
        expires_at: null,
      },
    };
    const newAccount = await USERS.insertOne(x);

    //return the id of new account document to save as cookie
    return newAccount.insertedId.toString();
  } catch (e) {
    console.log("ERROR: could not create account :(");
    return null;
  }
}

export async function GET_TWITTER_ACCESS_TOKEN(accountID: string) {
  try {
    const users: user[] = await USERS.find({
      _id: new ObjectId(accountID),
    }).toArray();
    if (users[0].twitter.access_token === null) {
      return null;
    } else {
      //TOKEN EXPIRED
      if (users[0].twitter.expires_at! < Date.now()) {
        console.log("TWITTER TOKEN HAS EXPIRED!");

        const refreshURL = encodeURI(
          "https://api.twitter.com/2/oauth2/token?refresh_token=" +
            users[0].twitter.refresh_token +
            "&grant_type=refresh_token&client_id=" +
            process.env.TWITTER_OATH2_CLIENT_ID
        );

        const refreshTokenData = await fetch(refreshURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + process.env.TWITTER_BASIC_BASE64_TOKEN,
          },
        });

        const refreshedToken = await refreshTokenData.json();

        //save new access and resfresh tokens to account
        await USERS.updateOne(
          { _id: new ObjectId(accountID) },
          {
            $set: {
              twitter: {
                access_token: refreshedToken.access_token,
                expires_at: Date.now() + 7200000,
                refresh_token: refreshedToken.refresh_token,
              },
            },
          }
        );

        return refreshedToken.access_token;
      }
      //TOKEN VALID
      else {
        console.log("TWITTER TOKEN STILL VALID!");

        return users[0].twitter.access_token;
      }
    }
  } catch (e) {
    console.log("ERROR: could not get twitter access token :(");
    return null;
  }
}

export async function GET_DISCORD_ACCESS_TOKEN(accountID: string) {
  try {
    const users: user[] = await USERS.find({
      _id: new ObjectId(accountID),
    }).toArray();
    if (users[0].discord.access_token === null) {
      return null;
    } else {
      //TOKEN EXPIRED
      if (users[0].discord.expires_at! < Date.now() / 1000) {
        console.log("DISCORD TOKEN HAS EXPIRED!");

        //exchange refresh token for new access token
        const tokenData = await axios.post(
          "https://discord.com/api/oauth2/token/revoke",
          {
            client_id: String(process.env.DISCORD_CLIENT_ID),
            client_secret: String(process.env.DISCORD_CLIENT_SECRET),
            grant_type: "refresh_token",
            refresh_token: String(users[0].discord.refresh_token),
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        //save new access and resfresh tokens to account
        await USERS.updateOne(
          { _id: new ObjectId(accountID) },
          {
            $set: {
              discord: {
                access_token: tokenData.data.access_token,
                expires_at: Date.now() / 1000 + tokenData.data.expires_in,
                refresh_token: tokenData.data.refresh_token,
                owned_text_channels: users[0].discord.owned_text_channels,
              },
            },
          }
        );

        return tokenData.data.access_token;
      }
      //TOKEN VALID
      else {
        console.log("DISCORD TOKEN STILL VALID!");

        return users[0].discord.access_token;
      }
    }
  } catch (e) {
    console.log("ERROR: could not get discord access token :(");
    return null;
  }
}

export async function GET_REDDIT_ACCESS_TOKEN(accountID: string) {
  try {
    const users: user[] = await USERS.find({
      _id: new ObjectId(accountID),
    }).toArray();
    if (users[0].reddit.access_token === null) {
      return null;
    } else {
      //TOKEN EXPIRED
      if (users[0].reddit.expires_at! < Date.now() / 1000) {
        console.log("REDDIT TOKEN HAS EXPIRED!");

        //exchange refresh token for new access token
        const refreshToken = await axios.post(
          "https://www.reddit.com/api/v1/access_token",
          {
            grant_type: "refresh_token",
            refresh_token: users[0].reddit.refresh_token,
          },
          {
            headers: {
              Authorization: "Basic " + process.env.REDDIT_BASIC_BASE64_TOKEN,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        //save new access and resfresh tokens to account
        await USERS.updateOne(
          { _id: new ObjectId(accountID) },
          {
            $set: {
              reddit: {
                access_token: refreshToken.data.access_token,
                expires_at: Date.now() / 1000 + refreshToken.data.expires_in,
                refresh_token: refreshToken.data.refresh_token,
              },
            },
          }
        );

        return refreshToken.data.access_token;
      }
      //TOKEN VALID
      else {
        console.log("REDDIT TOKEN STILL VALID!");

        return users[0].reddit.access_token;
      }
    }
  } catch (e) {
    console.log("ERROR: could not get reddit access token :(");
    return null;
  }
}

export async function GET_CURRENT_TWITTER_USER(account_id: string) {
  try {
    const token = await GET_TWITTER_ACCESS_TOKEN(account_id);
    const me = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
    });

    //use the me twitter id to get more info about current user
    const meInfo = await axios.get(
      "https://api.twitter.com/2/users/" +
        me.data.data.id +
        "?user.fields=profile_image_url,name",
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "application/json",
        },
      }
    );

    const data: twitter_me = {
      id: meInfo.data.data.id,
      profile_image_url: meInfo.data.data.profile_image_url,
      username: meInfo.data.data.username,
      name: meInfo.data.data.name,
    };

    return data;
  } catch (e) {
    console.log("could not get current signed twitter user :(");
    return null;
  }
}

export async function GET_CURRENT_DISCORD_USER(account_id: string) {
  try {
    const token = await GET_DISCORD_ACCESS_TOKEN(account_id);

    const me = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const x: discord_me = {
      username: me.data.username,
      id: me.data.id,
      avatar: me.data.avatar,
    };
    return x;
  } catch (e) {
    console.log("could not get current signed discord user :(");
    return null;
  }
}

export async function GET_CURRENT_REDDIT_USER(account_id: string) {
  try {
    const token = await GET_REDDIT_ACCESS_TOKEN(account_id);

    const me = await axios.get("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const x: reddit_me = {
      name: me.data.name,
      avatar: me.data.icon_img,
    };
    return x;
  } catch (e) {
    console.log("could not get current signed reddit user :(");
    return null;
  }
}

export async function GET_RECENT_USER_TWEETS(
  account_id: string,
  twitter_account_id: string
) {
  try {
    const token = await GET_TWITTER_ACCESS_TOKEN(account_id);
    const recentTweetData = await axios.get(
      "https://api.twitter.com/2/users/" + twitter_account_id + "/tweets",
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-type": "application/json",
        },
      }
    );

    let recentTweets: recent_tweets[] | null = null; //will only be populated with recent tweets if user actually has recent tweets3

    if (recentTweetData.data.data.length !== 0) {
      const data: recent_tweets[] = recentTweetData.data.data.map((x: any) => {
        const y: recent_tweets = {
          id: x.id,
          text: x.text,
        };
        return y;
      });
      recentTweets = data;
    }

    return recentTweets;
  } catch (e) {
    console.log("ERROR -> could not get recent user tweets :(");
    return null;
  }
}

export async function GET_RECENT_USER_REDDIT_POSTS(user: string) {
  try {
    const recentPosts = await axios.get(
      "https://www.reddit.com/user/" + user + "/submitted.json"
    );

    const recentData: recent_post[] = recentPosts.data.data.children
      .map((x: any) => {
        if (x.data.selftext !== "[removed]") {
          const y: recent_post = {
            text: x.data.selftext,
            subreddit: x.data.subreddit,
            href: x.data.url,
          };
          return y;
        }
        return null;
      })
      .filter((z: any) => {
        return z!;
      });

    return recentData;
  } catch (e) {
    //this could mean this is a newer account that has no tweets yet
    return null;
  }
}

export function GET_RECENT_SUBREDDITS_POSTED_TO(recentPostData: recent_post[]) {
  //filter all the posts to each subreddit posted to
  //NO DUPLICATES

  let subreddits: string[] = [];
  recentPostData.forEach((x) => {
    if (subreddits.indexOf(x.subreddit) === -1) {
      subreddits.push(x.subreddit);
    }
  });
  //sorts subreddits alphabetically
  subreddits.sort();

  return subreddits;
}

export async function GET_ACCOUNT_SETTINGS(accountID: string) {
  try {
    const account = await USERS.find({
      _id: new ObjectId(accountID),
    }).toArray();
    if (account.length !== 0) {
      const x: account_settings = {
        email: account[0].email,
        hasConnectedTwitterAccount:
          account[0].twitter.access_token !== null ? true : false,
        hasConnectedDiscordAccount:
          account[0].discord.access_token !== null ? true : false,
        hasConnectedRedditAccount:
          account[0].reddit.access_token !== null ? true : false,
      };
      return x;
    } else {
      return null;
    }
  } catch (e) {
    console.log("ERROR -> could not get user account settings :(");
    return null;
  }
}

export async function DELETE_ACCOUNT(accountID: string) {
  try {
    const account = await USERS.find({
      _id: new ObjectId(accountID),
    }).toArray();

    if (account.length !== 0) {
      await USERS.deleteOne({ _id: new ObjectId(accountID) });

      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log("ERROR -> could not delete account :(");
    return false;
  }
}
