const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String},
    votes: [
      {
        poll_id: { type: String},
        answer: { type: String},
      }
    ],
  },
  { timestamps: true},
);

const AccountModel =
  mongoose.models.Acct || mongoose.model("Acct", pollSchema, 'accounts'); //make sure model exists before creating new one

export default AccountModel;

