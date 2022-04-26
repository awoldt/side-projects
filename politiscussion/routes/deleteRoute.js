const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Account = require("../models/accountSchema");
const Comment = require("../models/commentSchema");
const Discussion = require("../models/discussionSchema");

//removes discussion id from accts discussion array
async function removeSingleDiscussion(acctID, discussion_id) {
  var acct = await Account.findById(acctID);
  console.log(acct);
  var index = acct.discussions.indexOf(discussion_id);
  console.log(index);

  acct.discussions.splice(index, 1);
  await acct.save();
  console.log("discussion id pulled from users discussion array!");
}

//once an account is deleted, need to go and deletebyid all discussion posts user had
async function deleteUserDiscussions(id) {
  //get number of discussion posts user has
  var acct = await Account.findById(id);
  console.log("--deleting account");
  console.log(acct);

  for (i = 0; i < acct.discussions.length; ++i) {
    await Discussion.findByIdAndDelete(acct.discussions[i]);
  }
  console.log("deleted all user posts");
}

//loops through all liked posts and removes 1 like off each discussion
async function deleteUsersLikes(id) {
  var acct = await Account.findById(id);

  acct.liked_posts.map(async (item) => {
    var d = await Discussion.findById(item);
    d.likes -= 1;
    await d.save();
  });

  console.log("removed likes from all discussions user liked");
}

async function deleteDiscussionComments(d_id) {
  var commentData = await Comment.find({ discussion_id: d_id });
  console.log('comments on discussion to delete');
  console.log(commentData);
  if(commentData.length != 0) {
    commentData.map(async item => {
      await Comment.findByIdAndDelete(item._id);
    })
  }
}

async function deleteUsersComments(acctId) {
  var allComments = await Comment.find({ author_id: acctId });
  console.log("all comments user has posted");
  console.log(allComments);
  if (allComments.length != 0) {
    allComments.map(async (item) => {
      await Comment.findByIdAndDelete(item._id);
    });
  }
}

//deletes user's acct, discussions, likes, and comments
router.delete("/fetch/delete", (req, res) => {
  console.log("\nDELETE /fetch/delete");
  console.log("user id to delete - " + req.cookies.user_id);
  var reqUrl = req.headers.referer;
  reqUrl = reqUrl.split("/");
  const discussionID = reqUrl[reqUrl.length - 1];

  mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
    (err) => {
      //delete all user's posts
      deleteUserDiscussions(req.cookies.user_id)
        .then(() => {
          //remove likes from all discussions user liked
          deleteUsersLikes(req.cookies.user_id).then(() => {
            //delete all users comments
            deleteUsersComments(req.cookies.user_id).then(() => {
              Account.findByIdAndDelete(req.cookies.user_id)
                .then((x) => {
                  res.clearCookie("user_id");
                  res.json({
                    status: "ok",
                    msg: "account successfully deleted",
                  });
                })
                .catch((err) => {
                  res.send(err);
                });
            });
          });
        })
        .catch((err) => {
          res.send(err);
        });
    }
  );
});

//deletes individual disucssion and comments associated with discusssion
router.delete("/fetch/deleteDiscussion", (req, res) => {
  console.log("\nGET /fetch/deleteDiscussion");
  var reqUrl = req.headers.referer;
  reqUrl = reqUrl.split("/");
  const discussionID = reqUrl[reqUrl.length - 1];
  console.log("discussion id to delete is " + discussionID);

  Discussion.findByIdAndDelete(discussionID)
    .then(() => {
      console.log("successfully deleted post");

      //delete all comments on discussion
      deleteDiscussionComments(discussionID).then(() => {
        //remove discussion id from users discussions array
        removeSingleDiscussion(req.cookies.user_id, discussionID).then(() => {
          console.log("deleted single disucssion id from user array");
          res.json(null);
        });
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
