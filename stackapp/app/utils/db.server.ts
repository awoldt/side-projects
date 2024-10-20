import { MongoClient } from "mongodb";
import { UserProfile } from "../models/profile";
import { Stack } from "../models/stack";

const MONGOCLIENT = new MongoClient(process.env.MONGODB_KEY!);

let isConnected = false;

const ConnectDB = async () => {
  try {
    if (!isConnected) {
      await MONGOCLIENT.connect();
      isConnected = true;
      console.log("\nSUCCESSFULLY CONNECTED TO MONGODB!\n");
    }
  } catch (err) {
    console.log(err);
  }
};

ConnectDB();

export const accountsCollection = MONGOCLIENT.db(
  process.env.DB!
).collection<UserProfile>("accounts");

export const unverifiedAccountsColleciton = MONGOCLIENT.db(
  process.env.DB!
).collection<UserProfile>("unverified-accounts");

export const stacksCollection = MONGOCLIENT.db(
  process.env.DB!
).collection<Stack>("stacks");
