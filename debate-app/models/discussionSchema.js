const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
    {
        topic: String,
        topicCleanName: String, 
        selectedTopicsHref: String,
        title: String, 
        text: String,
        author: String,
        href: String,
        likes: Number,
        createdAtClean: String,
    },
    {timestamps: true},
    { collection: "discussions" }
  );


const Discussion = mongoose.model("Discussion", discussionSchema);

module.exports = Discussion;
  