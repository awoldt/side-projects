/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export const z_new_registrant = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  fk_party_affiliation: z.number(),
});
export type UserSubmission = z.infer<typeof z_new_registrant>;

export const z_new_comment = z.object({
  text: z.string().trim().max(2500),
  fk_politician_id: z.number(),
  fk_user_id: z.string().trim(),
});
export type NewComment = z.infer<typeof z_new_comment>;

export interface Politician {
  id: number;
  name: string;
  fk_party_affiliation: number | null; // some politicians do not associate with a political party (fed employees)
  fk_government_positions_id: number;
  fk_government_levels_id: number;
  url_path: string;
  description: string | null;
  fk_state_id: number | null; // some parts of gov arnt associated with single state
  currently_in_office: boolean;
  born: string | null;
  net_worth: number;
}

export interface PoliticianPageData extends Politician {
  // this interface will combine the main data points needed for a politician ALONG with user related shit on that politician (likes, comments, etc..)
  // and signed in user realted things like can comment, have you liked, etc
  // also some column names are different, such as the state they below to being state_name instead of fk_state_id
  state_name: string | null;
  party_name: string | null;
  all_comments: CommentSection[] | null; // null means no comments
  likes: Likes | null; // null means no likes
  position_title: string;
  gov_level_url_path: string;
  gov_position_url_path: string;
  user_has_liked: { id: number; has_like: boolean | null } | null; // true means they liked, false means they disliked
}

export interface Likes {
  total_likes: number;
  total_dislikes: number;
}

export interface Comment {
  id: number;
  text: string;
  created_at: string;
  fk_politician_id: number;
  fk_user_id: string;
  updated_at: string | null;
}

export const z_user_metadata = z.object({
  first_name: z.string().trim(),
  last_name: z.string().trim(),
  fk_party_affiliation: z.number(),
  private_profile: z.boolean(),
  public_profile_url: z.string().trim(), // generated once account is created
});
export type UserMetaData = z.infer<typeof z_user_metadata>;

export interface PublicProfilePageData {
  raw_user_meta_data: UserMetaData;
  created_at: string;

  user_comments:
    | (Comment & {
        politician: {
          url_path: string;
          name: string;
          level: { name: string; url_path: string };
          position: { name: string; url_path: string };
        };
        type: "comment";
      })[]
    | null;

  user_likes:
    | {
        is_like: boolean;
        fk_politician_id: number;
        created_at: string;
        politician: {
          url_path: string;
          name: string;
          level: { name: string; url_path: string };
          position: { name: string; url_path: string };
        };
        type: "like" | "dislike";
      }[]
    | null;
}

export interface GovernmentPositionPageData {
  title: string;
  url_path: string; // governemnt position path
  gov_level_path: string;
  politicians: Politician[];
}

export interface GovernmentLevelPageData {
  gov_level_name: string;
  gov_level_path: string;
  politicians: (Politician & { position: { url_path: string } })[];
}

export interface CommentSection extends Comment {
  raw_user_meta_data: UserMetaData; // data on the user who commented
}
