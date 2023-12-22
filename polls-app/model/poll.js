const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String},
    tagDisplay: {type: String},
    description: {type: String, required: true},
    type: { type: String, required: true },
    responseChoices: [
      {
        choice: { type: String, required: true },
        text: { type: String, required: true },
      }
    ],
    private: { type: Boolean, required: true },
    private_password: {type: String},
    responseAnswers: [
      {
        answer: {type: String},
        text: {type: String}
      }
    ],
  },
  { timestamps: true},
  { collection: "pollmodels" }
);

const PollModel =
  mongoose.models.PollModel || mongoose.model("PollModel", pollSchema, 'polldata'); //make sure model exists before creating new one

export default PollModel;
