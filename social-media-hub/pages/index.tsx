import type { GetServerSideProps } from "next";

import { Container } from "react-bootstrap";
import {
  GET_CURRENT_DISCORD_USER,
  GET_CURRENT_REDDIT_USER,
  GET_CURRENT_TWITTER_USER,
  GET_RECENT_SUBREDDITS_POSTED_TO,
  GET_RECENT_USER_REDDIT_POSTS,
  GET_RECENT_USER_TWEETS,
  IS_USER_SIGNED_IN,
  USERS,
} from "../FUNCTIONS";
import SignedOut from "../components/homepage/signedOut";
import SignedIn from "../components/homepage/signedIn";
import { ObjectId } from "mongodb";
import user from "../interface/user";

import { text_channel_data } from "../interface/user";
import twitter_me from "../interface/twitter/me";
import discord_me from "../interface/discord/me";
import reddit_me from "../interface/reddit/me";
import recent_tweets from "../interface/twitter/recent_tweets";
import { recent_post } from "../interface/reddit/recent_posts";
const Home = ({
  signedin,
  secureCookie,
  hasTwitterAccess,
  hasDiscordAccess,
  hasRedditAccess,
  redditAuthURL,
  discordAuthUrl,
  userOwnedDiscordServers,
  twitterMeProfile,
  dicordMeProfile,
  redditMeProfile,
  recentUserTweets,
  recentUserRedditPosts,
  recentSubredditsPostedTo,
}: {
  signedin: boolean | null;
  secureCookie: boolean;
  hasTwitterAccess: boolean | undefined;
  hasDiscordAccess: boolean | undefined;
  hasRedditAccess: boolean | undefined;
  redditAuthURL: string;
  discordAuthUrl: string;
  userOwnedDiscordServers: null | text_channel_data[];
  twitterMeProfile: twitter_me | null;
  dicordMeProfile: discord_me | null;
  redditMeProfile: reddit_me | null;
  recentUserTweets: recent_tweets[] | null;
  recentUserRedditPosts: recent_post[] | null;
  recentSubredditsPostedTo: string[] | null;
}) => {
  return (
    <Container fluid style={{ backgroundColor: "#EDEDE9" }}>
      {!signedin && <SignedOut useSecureCookie={secureCookie} />}
      {signedin && (
        <SignedIn
          twitter={hasTwitterAccess}
          discord={hasDiscordAccess}
          reddit={hasRedditAccess}
          REDDIT_AUTH_URL={redditAuthURL}
          DISCORD_AUTH_URL={discordAuthUrl}
          ownersDiscordServers={userOwnedDiscordServers}
          twitterMe={twitterMeProfile}
          discordMe={dicordMeProfile}
          redditMe={redditMeProfile}
          recentTweets={recentUserTweets}
          recentRedditPosts={recentUserRedditPosts}
          recentSubreddits={recentSubredditsPostedTo}
        />
      )}
    </Container>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const signedIn = await IS_USER_SIGNED_IN(context.req.cookies);

  if (signedIn) {
    const account: user[] = await USERS.find({
      _id: new ObjectId(context.req.cookies.account_id),
    }).toArray();

    const currentTwitterUser: twitter_me | null =
      await GET_CURRENT_TWITTER_USER(context.req.cookies.account_id!);

    const currentRedditUser = await GET_CURRENT_REDDIT_USER(
      context.req.cookies.account_id!
    );

    let recentTweets: recent_tweets[] | null = null;
    //only get recent tweets if user has connected account to twitter
    if (account[0].twitter.access_token !== null) {
      recentTweets = await GET_RECENT_USER_TWEETS(
        context.req.cookies.account_id!,
        currentTwitterUser!.id
      );
    }

    //only get recent reddit posts if user has connected their reddit account
    let recentRedditPosts: recent_post[] | null = null;
    if (account[0].reddit.access_token !== null) {
      recentRedditPosts = await GET_RECENT_USER_REDDIT_POSTS(
        currentRedditUser!.name
      );
    }

    //!! THE AUTH URLS FOR BOTH REDDIT AND DISCORD WILL BE DIFFERENT BASED ON NODE ENV
    return {
      props: {
        signedin: true,
        secureCookie: process.env.NODE_ENV === "development" ? false : true,
        hasTwitterAccess:
          account[0].twitter.access_token !== null ? true : false,
        hasDiscordAccess:
          account[0].discord.access_token !== null ? true : false,
        hasRedditAccess: account[0].reddit.access_token !== null ? true : false,
        redditAuthURL:
          process.env.NODE_ENV === "development"
            ? "https://www.reddit.com/api/v1/authorize?client_id=" +
              process.env.REDDIT_CLIENT_ID +
              "&response_type=code&state=vleck&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Freddit%2Fauth&duration=permanent&scope=identity submit flair"
            : "https://www.reddit.com/api/v1/authorize?client_id=" +
              process.env.REDDIT_CLIENT_ID +
              "&response_type=code&state=vleck&redirect_uri=https%3A%2F%2Fsocial-media-hub.vercel.app%2Fapi%2Freddit%2Fauth&duration=permanent&scope=identity submit flair",
        discordAuthUrl:
          process.env.NODE_ENV === "development"
            ? "https://discord.com/api/oauth2/authorize?client_id=" +
              process.env.DISCORD_CLIENT_ID +
              "&permissions=264192&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fdiscord%2Fauth&response_type=code&scope=bot%20identify"
            : "https://discord.com/api/oauth2/authorize?client_id=" +
              process.env.DISCORD_CLIENT_ID +
              "&permissions=264192&redirect_uri=https%3A%2F%2Fsocial-media-hub.vercel.app%2Fapi%2Fdiscord%2Fauth&response_type=code&scope=bot%20identify",
        userOwnedDiscordServers:
          account[0].discord.owned_text_channels === null
            ? null
            : account[0].discord.owned_text_channels.sort((a, b) => {
                if (a.server_name < b.server_name) {
                  return -1;
                } else {
                  return 1;
                }
              }),
        twitterMeProfile: currentTwitterUser,
        recentUserTweets: recentTweets,

        dicordMeProfile: await GET_CURRENT_DISCORD_USER(
          context.req.cookies.account_id!
        ),
        redditMeProfile: currentRedditUser,
        recentUserRedditPosts:
          recentRedditPosts === null
            ? null
            : recentRedditPosts!.length > 6
            ? recentRedditPosts!.slice(0, 6)
            : recentRedditPosts,
        recentSubredditsPostedTo:
          recentRedditPosts === null
            ? null
            : recentRedditPosts.length !== 0
            ? GET_RECENT_SUBREDDITS_POSTED_TO(recentRedditPosts)
            : null,
      },
    };
  } else {
    return {
      props: {
        signedin: false,
      },
    };
  }
};
