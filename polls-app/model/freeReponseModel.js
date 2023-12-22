const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String},
    description: {type: String, required: true},
    type: { type: String, required: true },
    responses: [
      
    ],
  },
  { timestamps: true},
);

const PollModel =
  mongoose.models.Free || mongoose.model("Free", pollSchema, 'polldata'); //make sure model exists before creating new one

export default PollModel;
