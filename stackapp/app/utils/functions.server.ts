import { Document, ObjectId } from "mongodb";
import { accountsCollection, stacksCollection } from "./db.server";
import {
  CommitData,
  EditStackModel,
  RefreshStackModel,
  Stack,
  StackModel,
} from "~/models/stack";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import {
  ProfileModel,
  RefreshProfileModel,
  UserProfile,
} from "~/models/profile";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AMAZON_ACCESS_KEY!,
    secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY!,
  },
});
const s3Bucket = "491292639630-us-east-1-stackapp";
const s3BucketUrl =
  "https://491292639630-us-east-1-stackapp.s3.amazonaws.com/uploads";
const thirtyMinsInMs = 1800000;

export interface RepoSelectOptions {
  name: string;
  id: number;
}

interface Tech {
  name: string;
  description: string;
  site: string;
  type: "language" | "database" | "api" | "framework" | "cloud";
}

export interface StackDetails {
  stackData: Stack; // data about stack
  profileData: UserProfile | null; // github data on the user who CREATED the stack (person who owns repo)
  techDecriptions:
    | {
        name: string;
        description: string;
      }[]
    | null;
}

export interface GitHubProfileData {
  username: string;
  name: string | null;
  profileImg: string;
  bio: string | null;
  email: string | null;
}

async function DoesTmpFileExist() {
  if (!(await fsSync.existsSync(path.join(process.cwd(), "tmp")))) {
    await fs.mkdir(path.join(process.cwd(), "tmp"));
  }
}

async function RefreshStackData(
  repoName: string,
  githubAccessToken: string,
  githubUsername: string,
  stackId: string
) {
  /* 
    Refreshes the stack data's github specific data once 30 mins has passed
  */

  try {
    const repoRequest = await fetch(
      `https://api.github.com/repos/${githubUsername}/${repoName}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${githubAccessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!repoRequest.ok) {
      console.log("\nerror while fething repo data to update from github api");
      return null;
    }

    // get the data
    const repoResponse = await repoRequest.json();

    const v = RefreshStackModel.safeParse({
      repo_name: repoResponse.name,
      repo_description: repoResponse.description,
      repo_default_branch: repoResponse.default_branch,
      website_url: repoResponse.homepage === "" ? null : repoResponse.homepage,
      repo_commits: await GetRepoCommitData(
        githubUsername,
        repoName,
        githubAccessToken
      ),
      repo_topics:
        repoResponse.topics.length === 0 ? null : repoResponse.topics,
      last_updated: Date.now(),
    });
    if (!v.success) {
      console.log("\nerror while validating model");
      return null;
    }

    const updatedStack = await stacksCollection.updateOne(
      { _id: new ObjectId(stackId) },
      {
        $set: v.data,
      }
    );

    if (!updatedStack.acknowledged) {
      console.log("\nrefreshing stack data was not acknowledged");
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetStackData(
  stackID: string
): Promise<StackDetails | null> {
  /* 
    Gets all the info related to the stack
    used to display on /stack/[STACK_ID] route
  */

  try {
    if (!ObjectId.isValid(stackID)) {
      return null;
    }

    const stack = await stacksCollection.findOne({
      _id: new ObjectId(stackID),
    });
    if (stack === null) {
      console.log("\nstack does not exist");

      return null;
    }

    // check if stack data needs to be refreshed
    if (stack.last_updated + thirtyMinsInMs < Date.now()) {
      // need to get the github username associated with this repo
      const githubUserRequest = await GetAuthenticatedGithubUser(
        stack.github_access_token
      );
      if (githubUserRequest === null) {
        console.log("\ncould not get github username associated with stack");
        return null;
      }

      const r = await RefreshStackData(
        stack.repo_name,
        stack.github_access_token,
        githubUserRequest.username,
        stackID
      );
      if (r === null) {
        console.log("\ncould not refresh stack data");
      }
    }

    const returnData: StackDetails = {
      stackData: stack,
      profileData: await accountsCollection.findOne({
        _id: new ObjectId(stack.aid),
      }),
      techDecriptions: await GetTechDescriptions(stack),
    };

    return returnData;
  } catch (err) {
    console.log("\n");
    console.log(err);
    return null;
  }
}

async function RefreshProfileData(
  githubAccessToken: string,
  accountId: string
) {
  /* 
    Will refresh the github specific data stored in profile account if more than 
    30 mins has passed
  */

  try {
    // get lastest github data for profile
    const req = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubAccessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!req.ok) {
      console.log(
        "\n error while making request to github api to get authenticated github user, checking to see if there is already an account with this github account associated with it"
      );
      return null;
    }

    const githubProfileData = await req.json();

    const v = RefreshProfileModel.safeParse({
      username: githubProfileData.login,
      name: githubProfileData.name,
      bio: githubProfileData.bio,
      email: githubProfileData.email,
      profile_img: githubProfileData.avatar_url,
      last_updated: Date.now(),
    });
    if (!v.success) {
      console.log("\nerror while validating model");
      return null;
    }

    const refreshedProfile = await accountsCollection.updateOne(
      { _id: new ObjectId(accountId) },
      {
        $set: v.data,
      }
    );
    if (!refreshedProfile.acknowledged) {
      console.log("\nprofile refresh not acknowledged");
      return null;
    }
    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function IsSignedIn(aid: string | undefined) {
  /* 
    Will determine if cookie sent in request is
    1. valid mongoDB objectid
    2. associated with document in accounts collection

    If so, will return the data stored in mongodb db ALONG with the
    github data of the user. 
  */

  try {
    if (aid == undefined) return null;

    if (!ObjectId.isValid(aid)) {
      return null;
    }

    const a = await accountsCollection.findOne({
      _id: new ObjectId(aid),
    });
    if (a === null) {
      return null;
    }

    // see if profile data needs to be refreshed
    if (a.last_updated + thirtyMinsInMs < Date.now()) {
      console.log("\nREFRESHING PROFILE DATA!");

      const r = await RefreshProfileData(
        a.github_access_token,
        a._id.toString()
      );
      if (r === null) {
        console.log("error while refreshing profile data");
      }
    }

    return a;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function GetAuthenticatedGithubUser(
  githubToken: string
): Promise<GitHubProfileData | null> {
  /* 
    This is a really important function....
    this will always return the most up-to-date data for user's github account

    Github token is stored in profile collection, saved when user connected github for first time
    each stack account that has connected github account will have different github access tokens...
    each token gets 5,000 requests to github api per hour
    any requests made that need github data will call this function ALONG with other functions 
  */

  try {
    const req = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!req.ok) {
      console.log(
        "\n error while making request to github api to get authenticated github user"
      );
      return null;
    }

    const res = await req.json();

    const { login, avatar_url, name, bio, email } = res;

    return {
      username: login,
      profileImg: avatar_url,
      name: name,
      bio: bio,
      email: email,
    }; // github account owner string
  } catch (err) {
    console.log(err);

    console.log("\n error while getting authenticated github user");
    return null;
  }
}

async function GetRepoCommitData(
  user: string,
  repo: string,
  githubAccessToken: string
) {
  /* 
    Will get commit data on a specific repo
  */

  try {
    const req = await fetch(
      `https://api.github.com/repos/${user}/${repo}/commits`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${githubAccessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    if (!req.ok) {
      console.log("\nthere was an error while getting commit data");
      return null;
    }

    const res = await req.json();

    const commits: CommitData[] = [];
    // only want latest 5 commits
    for (let i = 0; i < res.length; i++) {
      if (commits.length === 5) break;

      const c: CommitData = {
        message: res[i].commit.message,
        date: TimeAgo(res[i].commit.committer.date),
        url: res[i].html_url,
      };
      commits.push(c);
    }

    return commits;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function CreateNewAccount(
  clientID: string,
  clientSecret: string,
  code: string
) {
  /* 
    Authenticates a github account and gets an access token in response that
    belongs to that specific user

    Save this access token in a newly created stack account and save in db
  */

  try {
    // exchange code for access token
    const token = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!token.ok) {
      console.log(
        "error while sending post request to github oath access token endpoint"
      );
      return null;
    }

    const tokenData = await token.json();

    // check to see if an account with this gitub account id already exists in collection
    // if so, just return that document

    const req = await fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${tokenData.access_token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!req.ok) {
      console.log(
        "\n error while making request to github api to get authenticated github user, checking to see if there is already an account with this github account associated with it"
      );
      return null;
    }

    const res = await req.json();
    const githubAccountAlreadyInUse = await accountsCollection.findOne({
      github_account_id: res.id,
    });
    // github account not already associated with Stack account, create new Stack account document
    if (githubAccountAlreadyInUse === null) {
      // get most up-to-date github data to store
      const githubProfile = await GetAuthenticatedGithubUser(
        tokenData.access_token
      );
      if (githubProfile === null) {
        console.log(
          "\nthere was an error while getting the initial github data to store in profile document"
        );

        return null;
      }

      const v = ProfileModel.safeParse({
        public_id: new ObjectId().toString(),
        created_on: new Date().toISOString(),
        github_access_token: tokenData.access_token,
        liked_stacks: [],
        github_account_id: res.id,
        username: githubProfile.username,
        name: githubProfile.name,
        bio: githubProfile.bio,
        email: githubProfile.email,
        profile_img: githubProfile.profileImg,
        last_updated: Date.now(),
      });
      if (!v.success) {
        console.log(
          "\nthere was a validation error while creating new account"
        );
        return null;
      }

      const newAccount = await accountsCollection.insertOne(v.data);

      return {
        status: "new_account_created",
        data: newAccount.insertedId,
      };
    }
    // there is already a Stack account document with current github account associated
    else {
      return {
        status: "github_account_already_in_use",
        data: githubAccountAlreadyInUse._id,
      };
    }
  } catch (err) {
    console.log("\nerror while authenticating GitHub account");
    console.log(err);
    return null;
  }
}

export async function GetProfileData(publicId: string | undefined) {
  /* 
    Returns the data stored in mongodb
  */
  if (publicId === undefined) return null;

  try {
    const profile = await accountsCollection.findOne({ public_id: publicId });
    if (profile === null) {
      return null;
    }

    return profile;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetRepoSelectOptions(
  user: string,
  githubAccessToken: string
) {
  /* 
   Gets all the public repos a signed in users owns and sends to 
   create page to render inside select dropdown

   Excludes any stacks already using a specific repo
  */

  try {
    const repoRequest = await fetch(
      `https://api.github.com/users/${user}/repos`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${githubAccessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    if (!repoRequest.ok) {
      console.log(
        "\nerror while getting users repos for create page select options"
      );
      return null;
    }
    const repos: RepoSelectOptions[] = [];
    const allUserReposIds = [];

    const repoResponse = await repoRequest.json();
    for (let i = 0; i < repoResponse.length; i++) {
      if (!repoResponse[i].private) {
        allUserReposIds.push(repoResponse[i].id);
      }
    }

    const reposInUse = await stacksCollection
      .find({
        $or: allUserReposIds.map((x) => {
          return { github_repo_id: x };
        }),
      })
      .toArray();
    // all the stacks that have a repo in use
    // EXCLUDE FROM REPO SELECT OPTIONS
    const reposInUseIds = reposInUse.map((x) => {
      return x.github_repo_id;
    });

    for (let index = 0; index < repoResponse.length; index++) {
      if (!reposInUseIds.includes(repoResponse[index].id)) {
        repos.push({
          name: repoResponse[index].name,
          id: repoResponse[index].id,
        });
      }
    }

    return repos;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function CreateStack(
  body: FormData,
  accountId: string,
  githubAccessToken: string,
  githubAccountUsername: string
) {
  /* 
   Takes post request data sent from create page and 
   creates a new stack in our database
  */

  try {
    // first, attempt to grab the latest repo details to store
    // if fails, do not create Stack
    const repoRequest = await fetch(
      `https://api.github.com/repos/${githubAccountUsername}/${body.get(
        "repo"
      )}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${githubAccessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    if (!repoRequest.ok) {
      console.log("\nerror while getting repo details");
      return null;
    }
    const repoData = await repoRequest.json();

    let thumbnail1 = null;
    let thumbnail2 = null;
    let thumbnail3 = null;
    let thumbnail4 = null;

    const languages: string[] = [];
    const databases: string[] = [];
    const apis: string[] = [];
    const frameworks: string[] = [];
    const clouds: string[] = [];

    for (const [key, value] of body.entries()) {
      switch (key) {
        case "thumbnail_1":
          // eslint-disable-next-line no-case-declarations
          const uploadImage = await UploadImage(value as Blob);
          if (uploadImage === null) {
            console.log("\nthere was an error uploading thumbnail image!");
            return null;
          }
          thumbnail1 = `${s3BucketUrl}/${uploadImage}`;
          break;

        case "thumbnail_2":
          // eslint-disable-next-line no-case-declarations
          const img2 = value as Blob;
          if (img2.size !== 0) {
            const uploadImage = await UploadImage(img2);
            if (uploadImage === null) {
              console.log("\nthere was an error uploading thumbnail 2 image!");
            } else {
              thumbnail2 = `${s3BucketUrl}/${uploadImage}`;
            }
          }
          break;

        case "thumbnail_3":
          // eslint-disable-next-line no-case-declarations
          const img3 = value as Blob;
          if (img3.size !== 0) {
            const uploadImage = await UploadImage(img3);
            if (uploadImage === null) {
              console.log("\nthere was an error uploading thumbnail 3 image!");
            } else {
              thumbnail3 = `${s3BucketUrl}/${uploadImage}`;
            }
          }

          break;

        case "thumbnail_4":
          // eslint-disable-next-line no-case-declarations
          const img4 = value as Blob;
          if (img4.size !== 0) {
            const uploadImage = await UploadImage(img4);
            if (uploadImage === null) {
              console.log("\nthere was an error uploading thumbnail 4 image!");
            } else {
              thumbnail4 = `${s3BucketUrl}/${uploadImage}`;
            }
          }

          break;

        case "language":
          languages.push(value.toString());
          break;

        case "database":
          databases.push(value.toString());
          break;

        case "api":
          apis.push(value.toString());
          break;

        case "framework":
          frameworks.push(value.toString());
          break;

        case "cloud":
          clouds.push(value.toString());
          break;
      }
    }

    const thumbnails: string[] = [
      thumbnail1,
      thumbnail2,
      thumbnail3,
      thumbnail4,
    ].filter((x) => {
      return x !== null;
    }) as string[];

    const v = StackModel.safeParse({
      aid: accountId,
      apis_used: apis.length === 0 ? null : apis,
      clouds_used: clouds.length === 0 ? null : clouds,
      created_on: new Date().toISOString(),
      databases_used: databases.length === 0 ? null : databases,
      frameworks_used: frameworks.length === 0 ? null : frameworks,
      github_repo_id: repoData.id,
      github_access_token: githubAccessToken,
      languages_used: languages,
      likes: 0,
      thumbnails: thumbnails,
      repo_name: repoData.name,
      repo_description: repoData.description,
      repo_default_branch: repoData.default_branch,
      website_url: repoData.homepage === "" ? null : repoData.homepage,
      repo_commits: await GetRepoCommitData(
        githubAccountUsername,
        repoData.name,
        githubAccessToken
      ),
      repo_topics: repoData.topics.length === 0 ? null : repoData.topics,
      last_updated: Date.now(),
    });
    if (!v.success) {
      console.log("\nerror with validation while creating new Stack");

      return null;
    }

    const newStack = await stacksCollection.insertOne(v.data);

    return newStack.insertedId.toString();
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function UploadImage(img: Blob | null) {
  /* 
  Saves image to s3 with random filename
*/

  if (img === null) {
    console.log("error, image blog null");

    return null;
  }

  const imgExtension = img!.type.split("/")[1];

  if (
    imgExtension !== "png" &&
    imgExtension !== "jpeg" &&
    imgExtension !== "webp" &&
    imgExtension !== "avif" &&
    imgExtension !== "tiff"
  ) {
    console.log("error, imge format " + imgExtension + " not supported");

    return null;
  }

  await DoesTmpFileExist();

  try {
    const buffer = Buffer.from(await img!.arrayBuffer());

    // generate random name for image
    // make sure not already stored in aws bucket
    let randomFileName = `${Math.floor(
      Math.random() * 1000000
    )}_${Date.now()}.${imgExtension}`;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await s3Client.send(
          new HeadObjectCommand({
            Bucket: s3Bucket,
            Key: `uploads/${randomFileName}.${imgExtension}`,
          })
        );
        randomFileName = `${Math.floor(
          Math.random() * 1000000
        )}_${Date.now()}.${imgExtension}`;
      } catch (err) {
        // if catch is thrown here, means file does not exist (what we want)
        break;
      }
    }

    // write file to tmp folder
    await fs.writeFile(
      path.join(process.cwd(), "tmp", `${randomFileName}`),
      buffer
    );

    // upload img file to aws s3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: `uploads/${randomFileName}`,
        Body: await fs.readFile(
          path.join(process.cwd(), "tmp", `${randomFileName}`)
        ),
        ContentType: `image/${imgExtension}`,
      })
    );

    // delete file from tmp folder
    await fs.unlink(path.join(process.cwd(), "tmp", `${randomFileName}`));

    // return the file name
    return randomFileName;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function TimeAgo(isoDateString: string) {
  /*  
    Takes in a iso string and returns a human friendly representation
    of how long ago it was

    Def did not copy from chatgpt :))
  */

  const currentDate = new Date();
  const isoDate = new Date(isoDateString);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeDifference = (currentDate as any) - (isoDate as any);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365.25 * day;

  const minutes = Math.floor(timeDifference / minute);
  const hours = Math.floor(timeDifference / hour);
  const days = Math.floor(timeDifference / day);
  const months = Math.floor(timeDifference / month);
  const years = Math.floor(timeDifference / year);

  if (years > 0) {
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? "1 month ago" : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else {
    return minutes <= 1 ? "just now" : `${minutes} minutes ago`;
  }
}

export async function GetMoreStacksByUser(
  userAccountId: string,
  currentStackId: string
) {
  /*  
    Fetches any other stacks user has created to display on stack page while
    excluding the current stack being viewed
  */

  try {
    const otherUserStacks = await stacksCollection
      .find({ aid: userAccountId })
      .sort({ created_on: -1 })
      .limit(6)
      .toArray();

    const stackToReturn: {
      stackData: Stack;
      techUsedDisplay: string[] | null;
    }[] = [];

    for (let i = 0; i < otherUserStacks.length; i++) {
      if (otherUserStacks[i]._id.toString() === currentStackId) {
        otherUserStacks.splice(i, 1);
      } else {
        stackToReturn.push({
          stackData: otherUserStacks[i],
          techUsedDisplay: GetTechUsedDisplay(otherUserStacks[i]),
        });
      }
    }

    return stackToReturn;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetAllUsersStacks(userAccountId: string) {
  /*  
      Returns all stacks a user has created
    */

  try {
    const usersStacks = await stacksCollection
      .find({ aid: userAccountId })
      .sort({ created_on: -1 })
      .toArray();

    const stackToReturn: {
      stackData: Stack;
      techUsedDisplay: string[] | null;
    }[] = [];

    for (let i = 0; i < usersStacks.length; i++) {
      stackToReturn.push({
        stackData: usersStacks[i],
        techUsedDisplay: GetTechUsedDisplay(usersStacks[i]),
      });
    }

    return stackToReturn;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetTechOffered(): Promise<{
  languages: string[];
  databases: string[];
  apis: string[];
  frameworks: string[];
  clouds: string[];
} | null> {
  /*  
      Gets all the tech Stackapp offers to display on create page
      select dropdowns
    */

  try {
    const jsonData = await fs.readFile(path.join(process.cwd(), "tech.json"), {
      encoding: "utf-8",
    });
    const data: Tech[] = await JSON.parse(jsonData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tech: any = {
      languages: [],
      databases: [],
      apis: [],
      frameworks: [],
      clouds: [],
    };

    for (let i = 0; i < data.length; i++) {
      switch (data[i].type) {
        case "language":
          tech.languages.push(data[i].name);
          break;

        case "database":
          tech.databases.push(data[i].name);
          break;

        case "api":
          tech.apis.push(data[i].name);
          break;
        case "framework":
          tech.frameworks.push(data[i].name);
          break;

        case "cloud":
          tech.clouds.push(data[i].name);
          break;
      }
    }
    tech.languages.sort();
    tech.databases.sort();
    tech.apis.sort();
    tech.frameworks.sort();
    tech.clouds.sort();

    return tech;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetExplorePageStacks() {
  /*  
      Returns various stacks to explore page, no user can have more than 1 stack 
      on this page, try to show as many profiles as possible
    */

  try {
    // most recent stacks
    const recentStacks = await stacksCollection
      .find({})
      .sort({ created_on: -1 })
      .toArray();

    // can only return a single user once
    const userIds: string[] = [];
    const uniqueUserStacks: {
      stackData: Stack;
      githubProfileData: UserProfile;
      techUsedDisplay: string[] | null;
    }[] = [];

    for (let i = 0; i < recentStacks.length; i++) {
      if (!userIds.includes(recentStacks[i].aid)) {
        const creatorProfile = await accountsCollection.findOne({
          _id: new ObjectId(recentStacks[i].aid),
        });

        if (creatorProfile !== null) {
          uniqueUserStacks.push({
            stackData: recentStacks[i],
            githubProfileData: creatorProfile,
            techUsedDisplay: GetTechUsedDisplay(recentStacks[i]),
          });
          userIds.push(recentStacks[i].aid);
        }
      }
    }

    return uniqueUserStacks;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function DeleteImage(file: string) {
  /*  
      Deletes image from s3
    */
  try {
    const deleteParams = {
      Bucket: s3Bucket,
      Key: `uploads/${file}`,
    };

    await s3Client.send(new DeleteObjectCommand(deleteParams));
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function DeleteStack(
  stackDetails: Stack & Document,
  stackID: string
) {
  /*  
      Deletes stack along with any s3 images associated with it
    */

  try {
    // delete images first
    for (let i = 0; i < stackDetails.thumbnails.length; i++) {
      await DeleteImage(stackDetails.thumbnails[i].split("/")[4]);
    }

    // remove the like from liked array in database for any user
    // who has liked this stack
    const deleteAllLikedInstances = await accountsCollection.updateMany(
      { liked_stacks: { $in: [stackID] } },
      {
        $pull: { liked_stacks: stackID },
      }
    );

    if (!deleteAllLikedInstances.acknowledged) {
      console.log(
        "\nerror while removing like from anybody who has liked its liked_stacks array in accounts db"
      );
      return null;
    }

    // now delete stack
    const deletedStack = await stacksCollection.deleteOne({
      _id: new ObjectId(stackDetails._id),
    });

    return deletedStack;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function DeleteProfile(accountId: string) {
  try {
    // delete all stacks associated with stack first
    const userStacks = await stacksCollection
      .find({ aid: accountId })
      .toArray();
    if (userStacks.length > 0) {
      for (let i = 0; i < userStacks.length; i++) {
        await DeleteStack(userStacks[i], userStacks[i]._id.toString());
      }
    }

    // now remove any likes from any stacks user liked
    const account = await accountsCollection.findOne({
      _id: new ObjectId(accountId),
    });
    if (account !== null) {
      const stackIds = account.liked_stacks.map((x) => {
        return new ObjectId(x);
      });

      await stacksCollection.updateMany(
        { _id: { $in: stackIds } },
        {
          $inc: {
            likes: -1,
          },
        }
      );
    }

    // now delete profile stored in database
    const deletedAccount = await accountsCollection.deleteOne({
      _id: new ObjectId(accountId),
    });
    return deletedAccount;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function EditStack(body: FormData, stackId: string) {
  /* 
  Edits a given, updating it with new data
  */

  try {
    let thumbnail1 = null;
    let thumbnail2 = null;
    let thumbnail3 = null;
    let thumbnail4 = null;

    const languages: string[] = [];
    const databases: string[] = [];
    const apis: string[] = [];
    const frameworks: string[] = [];
    const clouds: string[] = [];

    for (const [key, value] of body.entries()) {
      switch (key) {
        case "thumbnail_1":
          // eslint-disable-next-line no-case-declarations
          const uploadImage = await UploadImage(value as Blob);
          if (uploadImage === null) {
            console.log("\nthere was an error uploading thumbnail image!");
            return null;
          }
          thumbnail1 = `${s3BucketUrl}/${uploadImage}`;
          break;

        case "thumbnail_2":
          // eslint-disable-next-line no-case-declarations
          const img2 = value as Blob;
          if (img2.size !== 0) {
            const uploadImage = await UploadImage(img2);
            if (uploadImage === null) {
              console.log("\nthere was an error uploading thumbnail 2 image!");
            } else {
              thumbnail2 = `${s3BucketUrl}/${uploadImage}`;
            }
          }
          break;

        case "thumbnail_3":
          // eslint-disable-next-line no-case-declarations
          const img3 = value as Blob;
          if (img3.size !== 0) {
            const uploadImage = await UploadImage(img3);
            if (uploadImage === null) {
              console.log("\nthere was an error uploading thumbnail 3 image!");
            } else {
              thumbnail3 = `${s3BucketUrl}/${uploadImage}`;
            }
          }

          break;

        case "thumbnail_4":
          // eslint-disable-next-line no-case-declarations
          const img4 = value as Blob;
          if (img4.size !== 0) {
            const uploadImage = await UploadImage(img4);
            if (uploadImage === null) {
              console.log("\nthere was an error uploading thumbnail 4 image!");
            } else {
              thumbnail4 = `${s3BucketUrl}/${uploadImage}`;
            }
          }

          break;

        case "language":
          languages.push(value.toString());
          break;

        case "database":
          databases.push(value.toString());
          break;

        case "api":
          apis.push(value.toString());
          break;

        case "framework":
          frameworks.push(value.toString());
          break;

        case "cloud":
          clouds.push(value.toString());
          break;
      }
    }

    const thumbnails: string[] = [
      thumbnail1,
      thumbnail2,
      thumbnail3,
      thumbnail4,
    ].filter((x) => {
      return x !== null;
    }) as string[];

    // update stack document
    const v = EditStackModel.safeParse({
      apis_used: apis.length === 0 ? null : apis,
      clouds_used: clouds.length === 0 ? null : clouds,
      databases_used: databases.length === 0 ? null : databases,
      frameworks_used: frameworks.length === 0 ? null : frameworks,
      languages_used: languages,
      thumbnails: thumbnails,
      last_updated: Date.now(),
    });
    if (!v.success) {
      console.log("\nerror with validation");
      return null;
    }

    const updatedStack = await stacksCollection.updateOne(
      { _id: new ObjectId(stackId) },
      {
        $set: v.data,
      }
    );
    if (!updatedStack.acknowledged) {
      console.log("\nerror while acknowledging update");
      return null;
    }

    return true;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function GetTechUsedDisplay(stackData: Stack) {
  /* 
    Will fetch one of each tech category img a stack has to display
    under stacks on explore, profile, and stack pages
  */

  try {
    const techArray: string[] = [];
    techArray.push(`/imgs/tech/${stackData.languages_used[0]}.svg`);
    if (stackData.databases_used !== null)
      techArray.push(`/imgs/tech/${stackData.databases_used[0]}.svg`);
    if (stackData.apis_used !== null)
      techArray.push(`/imgs/tech/${stackData.apis_used[0]}.svg`);
    if (stackData.frameworks_used !== null)
      techArray.push(`/imgs/tech/${stackData.frameworks_used[0]}.svg`);
    if (stackData.clouds_used !== null)
      techArray.push(`/imgs/tech/${stackData.clouds_used[0]}.svg`);

    return techArray;
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function GetTechDescriptions(stack: Stack) {
  /* 
  Gets all the descriptions stored for each tech a user has selected
  for their stack to display on frontend
  */
  try {
    const techJsonFile = await fs.readFile(
      path.join(process.cwd(), "tech.json"),
      { encoding: "utf-8" }
    );
    const tech: Tech[] = await JSON.parse(techJsonFile);

    const descriptions: {
      name: string;
      description: string;
    }[] = [];

    // languages
    for (let i = 0; i < stack.languages_used.length; i++) {
      for (let k = 0; k < tech.length; k++) {
        if (stack.languages_used[i] === tech[k].name) {
          descriptions.push({
            name: stack.languages_used[i],
            description: tech[k].description,
          });
          break;
        }
      }
    }

    // databases
    if (stack.databases_used) {
      for (let i = 0; i < stack.databases_used.length; i++) {
        for (let k = 0; k < tech.length; k++) {
          if (stack.databases_used[i] === tech[k].name) {
            descriptions.push({
              name: stack.databases_used[i],
              description: tech[k].description,
            });
            break;
          }
        }
      }
    }

    // apis
    if (stack.apis_used) {
      for (let i = 0; i < stack.apis_used.length; i++) {
        for (let k = 0; k < tech.length; k++) {
          if (stack.apis_used[i] === tech[k].name) {
            descriptions.push({
              name: stack.apis_used[i],
              description: tech[k].description,
            });
            break;
          }
        }
      }
    }

    // frameworks
    if (stack.frameworks_used) {
      for (let i = 0; i < stack.frameworks_used.length; i++) {
        for (let k = 0; k < tech.length; k++) {
          if (stack.frameworks_used[i] === tech[k].name) {
            descriptions.push({
              name: stack.frameworks_used[i],
              description: tech[k].description,
            });
            break;
          }
        }
      }
    }

    // clouds
    if (stack.clouds_used) {
      for (let i = 0; i < stack.clouds_used.length; i++) {
        for (let k = 0; k < tech.length; k++) {
          if (stack.clouds_used[i] === tech[k].name) {
            descriptions.push({
              name: stack.clouds_used[i],
              description: tech[k].description,
            });
            break;
          }
        }
      }
    }

    return descriptions;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function GetUsersLikedStacks(accountId: string) {
  /* 
    Returns all users liked stacks to display on 
    profile page
  */

  try {
    const stackIds = await accountsCollection.findOne({
      _id: new ObjectId(accountId),
    });
    if (stackIds === null) {
      return null;
    }

    const likedStacks = await stacksCollection
      .find({
        _id: {
          $in: stackIds.liked_stacks.map((x) => {
            return new ObjectId(x);
          }),
        },
      })
      .toArray();
    if (likedStacks === null) {
      return null;
    }
    if (likedStacks.length === 0) {
      return "no_liked_stacks";
    }

    const stackToReturn: {
      stackData: Stack;
      techUsedDisplay: string[] | null;
    }[] = [];

    for (let i = 0; i < likedStacks.length; i++) {
      stackToReturn.push({
        stackData: likedStacks[i],
        techUsedDisplay: GetTechUsedDisplay(likedStacks[i]),
      });
    }

    return stackToReturn;
  } catch (err) {
    console.log(err);
    return null;
  }
}
