import { Document } from "mongodb";
import { z } from "zod";

export type CommitData = z.infer<typeof CommitModel>;
const CommitModel = z.object({
  message: z.string().trim(),
  date: z.string().trim(),
  url: z.string().url().trim(),
});

export type Stack = z.infer<typeof StackModel> & Document;

export const StackModel = z.object({
  aid: z.string().trim(), // THE ID OF THE ACCOUNT DOCUMENT THAT CREATED THE STACK
  apis_used: z.array(z.string().trim()).nullable(),
  clouds_used: z.array(z.string().trim()).nullable(),
  created_on: z.string().trim(),
  databases_used: z.array(z.string().trim()).nullable(),
  frameworks_used: z.array(z.string().trim()).nullable(),
  github_repo_id: z.number(),
  github_access_token: z.string().trim(),
  languages_used: z.array(z.string().trim()),
  likes: z.number(),
  thumbnails: z.array(z.string().trim()),
  repo_name: z.string().trim(),
  repo_description: z.string().trim().nullable(),
  repo_default_branch: z.string().trim(),
  repo_topics: z.array(z.string().trim()).nullable(),
  website_url: z.string().url().trim().nullable(),
  repo_commits: z.array(CommitModel),
  last_updated: z.number(),
});

// this object represents the object that is used to update the stack data in database
// this is serperate from regular stack obj as some of the fields are not included when user upadates stack
// for example, created_on is only required when account is created, it is not needed for updating stack
// using the old stack model would throw error if user attempted to update stack cause some properties would not be present

export type EditedStack = z.infer<typeof EditStackModel>;

export const EditStackModel = z.object({
  apis_used: z.array(z.string().trim()).nullable(),
  clouds_used: z.array(z.string().trim()).nullable(),
  databases_used: z.array(z.string().trim()).nullable(),
  frameworks_used: z.array(z.string().trim()).nullable(),
  languages_used: z.array(z.string().trim()),
  thumbnails: z.array(z.string().trim()),
  last_updated: z.number(),
});

// this is used when stack data needs to be refreshed

export type RefreshStack = z.infer<typeof RefreshStackModel>;

export const RefreshStackModel = z.object({
  repo_name: z.string().trim(),
  repo_description: z.string().trim().nullable(),
  repo_default_branch: z.string().trim(),
  website_url: z.string().url().trim().nullable(),
  repo_commits: z.array(CommitModel),
  last_updated: z.number(),
});
