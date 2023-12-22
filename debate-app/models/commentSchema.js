const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    discussion_id: String,
    author_id: String,
    author_profile_username: String,
    author_profile_link: String,
    comment_txt: String, 
  },
  { collection: "comments" }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
