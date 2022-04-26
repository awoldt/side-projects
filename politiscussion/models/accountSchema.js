const mongoose = require("mongoose");

const acctSchema = new mongoose.Schema(
  {
    verified: Boolean,
    email: String,
    username: String,
    password: String,
    party: String,
    party_color: String,
    account_created: String,
    discussions: [String], //contains the obj id of all posts user has posted
    liked_posts: [String],
  },
  { collection: "accounts" }
);

const Account = mongoose.model("Account", acctSchema);

module.exports = Account;
