import { auth } from "twitter-api-sdk";

export const authClient = new auth.OAuth2User({
  client_id: process.env.TWITTER_OATH2_CLIENT_ID!,
  client_secret: process.env.TWITTER_OATH2_CLIENT_SECRET!,
  callback: process.env.TWITTER_URL_CALLBACK!,
  scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
});
