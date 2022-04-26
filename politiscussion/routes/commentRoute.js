const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Account = require("../models/accountSchema");
const Comment = require("../models/commentSchema");
var bodyParser = require("body-parser");

router.use(bodyParser.json());

require("dotenv").config();

router.post("/fetch/leaveComment", (req, res) => {
  console.log("\nPOST /fetch/leaveComment");
  var discussionID = req.headers.referer;
  var commentAuthor = req.cookies.user_id;
  discussionID = discussionID.split("/");
  discussionID = discussionID[discussionID.length - 1]; //just the disucssion id as a string

  mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
    (err) => {
      if (err) {
        res.json({
          status: "error",
          msg: "error, could not connect to database",
        });
      } else {
        //get the username of the author of the comment
        Account.findById(commentAuthor).then((authorData) => {
          //creates new comment document
          var data = new Comment({
            discussion_id: discussionID,
            author_id: commentAuthor,
            author_profile_username: authorData.username,
            author_profile_link: "/profile/" + commentAuthor,
            comment_txt: req.body.comment,
          });

          data.save().then(() => {
            res.json({ status: "ok", commentData: data});
          });
        });
      }
    }
  );
});

module.exports = router;
