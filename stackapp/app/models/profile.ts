import { z } from "zod";

export type UserProfile = z.infer<typeof ProfileModel>;

export const ProfileModel = z.object({
  public_id: z.string().trim(),
  created_on: z.string().trim(),
  github_access_token: z.string().trim(),
  liked_stacks: z.array(z.string().trim()),
  github_account_id: z.number(),
  username: z.string().trim(),
  name: z.string().trim().nullable(),
  bio: z.string().trim().nullable(),
  email: z.string().email().nullable(),
  profile_img: z.string().trim(),
  last_updated: z.number(),
});

export const RefreshProfileModel = z.object({
  username: z.string().trim(),
  name: z.string().trim().nullable(),
  bio: z.string().trim().nullable(),
  email: z.string().email().nullable(),
  profile_img: z.string().trim(),
  last_updated: z.number(),
});
