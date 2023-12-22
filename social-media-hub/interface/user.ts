interface twitter_keys {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
}
interface discord_keys {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
  owned_text_channels: text_channel_data[] | null;
}
interface reddit_keys {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
}
export interface text_channel_data {
  server_name: string;
  id: string;
}

export default interface user {
  email: string;
  password: string;
  twitter: twitter_keys;
  discord: discord_keys;
  reddit: reddit_keys;
}
