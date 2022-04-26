const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Discussion = require("../models/discussionSchema");
const Account = require("../models/accountSchema");
const Comment = require("../models/commentSchema");

//checks to see if the discussion belongs to the user who is signed in
//returns true or false
async function isUsersDiscussion(userID, discussionID) {
  const userData = await Account.findById(userID);
  var isUsersDiscussion = userData.discussions.indexOf(discussionID);

  if (isUsersDiscussion == -1) {
    return false;
  } else {
    return true;
  }
}

async function filterDiscussionTopics() {
  //array of objects that filters all posts to designated topics
  //!important
  //UPDATE DOPDOWNLIST ON NEWDUSCUSSIONPAGE FOR THIS FILTER TO FUNCTION PROPERLY
  //name of topics in objs below MUST match value of select option to work!!!!!
  var t = [
    {
      topic: "abortion",
      topicFullName: "Abortion",
      discussions: [],
    },
    {
      topic: "black-lives-matter",
      topicFullName: "Black Lives Matter",
      discussions: [],
    },
    {
      topic: "border-security",
      topicFullName: "Border Security",
      discussions: [],
    },
    {
      topic: "climate",
      topicFullName: "Climate",
      discussions: [],
    },
    {
      topic: "covid-19",
      topicFullName: "COVID-19",
      discussions: [],
    },
    {
      topic: "critical-race-theory",
      topicFullName: "Critical Race Theory",
      discussions: [],
    },
    {
      topic: "guns",
      topicFullName: "Guns",
      discussions: [],
    },
    {
      topic: "healthcare",
      topicFullName: "Healthcare",
      discussions: [],
    },
    {
      topic: "immigration",
      topicFullName: "Immigration",
      discussions: [],
    },
    {
      topic: "minimum-wage",
      topicFullName: "Minimum Wage",
      discussions: [],
    },
    {
      topic: "police-reform",
      topicFullName: "Police Reform",
      discussions: [],
    },
    {
      topic: "social-media",
      topicFullName: "Social Media",
      discussions: [],
    },
    {
      topic: "trump",
      topicFullName: "Trump",
      discussions: [],
    },
    {
      topic: "voting-rights",
      topicFullName: "Voting Rights",
      discussions: [],
    },
  ];

  //need to get the number of discussions of all topics
  //loops through t array above and filters posts
  //when done send to ejs page
  var promises = t.map(async (item) => {
    var data = await Discussion.find({ topic: item.topic });

    return new Promise((res, rej) => {
      res([data, item.topicFullName, item.topic]);
    });
  });

  return await Promise.all(promises);
}

async function getDiscussionComments(x) {
  var discussionCommentData = await Comment.find({
    discussion_id: x,
  });
  return discussionCommentData;
}

router.get("/topics", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  console.log("\nGET /topics");
  mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        filterDiscussionTopics().then((t) => {
          console.log("FILTERED DISCUSSION TOPICS");
          console.log(t);
          //SIGNED IN
          if (req.cookies.user_id) {
            Account.findById(req.cookies.user_id)
              .then((acctData) => {
                //if account no longer exists
                if (acctData == null) {
                  console.log("account not found, deleting cookie");
                  res.clearCookie("user_id");
                  res.redirect("/");
                } else {
                  //make sure account is verified
                  if (acctData.verified == true) {
                    res.render("topicsPage", {
                      title: "Debate Topics | Politiscussion",
                      signedin: true,
                      profile: acctData,
                      discussionTopics: t,
                      cLink: "https://politiscussion.com/topics",
                    });
                    //account is not verified yet
                  } else {
                    res.render("mustVerify", {
                      title: "check your email for verification link",
                      signedin: false,
                      cLink: null,
                    });
                  }
                }
              })
              .catch((err) => {
                res.send(err);
              });
          }
          //NOT SIGNED IN
          else {
            res.render("topicsPage", {
              title: "Debate Topics | Politiscussion",
              signedin: false,
              discussionTopics: t,
              cLink: "https://politiscussion.com/topics",
            });
          }
        });
      }
    }
  );
});

//ALL TOPIC DISCUSSIONS
router.get("/topics/:topic", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  var selectedTopic = req.params.topic;

  //see if sekectedTopic is even a topic this website supports
  var topicNames = [
    "abortion",
    "black-lives-matter",
    "border-security",
    "climate",
    "covid-19",
    "critical-race-theory",
    "guns",
    "healthcare",
    "immigration",
    "minimum-wage",
    "police-reform",
    "social-media",
    "trump",
    "voting-rights",
  ];

  var topicFullNames = [
    {
      topic: "abortion",
      topicFullName: "Abortion",
    },
    {
      topic: "black-lives-matter",
      topicFullName: "Black Lives Matter",
    },
    {
      topic: "border-security",
      topicFullName: "Border Security",
    },
    {
      topic: "climate",
      topicFullName: "Climate",
    },
    {
      topic: "covid-19",
      topicFullName: "COVID-19",
    },
    {
      topic: "critical-race-theory",
      topicFullName: "Critical Race Theory",
    },
    {
      topic: "guns",
      topicFullName: "Guns",
    },
    {
      topic: "healthcare",
      topicFullName: "Healthcare",
    },
    {
      topic: "immigration",
      topicFullName: "Immigration",
    },
    {
      topic: "minimum-wage",
      topicFullName: "Minimum Wage",
    },
    {
      topic: "police-reform",
      topicFullName: "Police Reform",
    },
    {
      topic: "social-media",
      topicFullName: "Social Media",
    },
    {
      topic: "trump",
      topicFullName: "Trump",
    },
    {
      topic: "voting-rights",
      topicFullName: "Voting Rights",
    },
  ];

  console.log("\nGET /topics/" + selectedTopic);
  mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        var doesTopicExist = topicNames.indexOf(selectedTopic);
        //topic does not exist, return to topics page
        if (doesTopicExist == -1) {
          res.redirect("/topics");
        }
        //topic exists
        else {
          //get the cleanName of topic
          var cleanName; //voting-rights == Voting Rights
          for (i = 0; i < topicFullNames.length; ++i) {
            if (topicFullNames[i].topic == selectedTopic) {
              cleanName = topicFullNames[i].topicFullName;
            }
          }
          console.log(selectedTopic + ' clean name is ' + cleanName);

          //find all discussion with selected topic
          Discussion.find({ topic: selectedTopic })
            .then((discussionData) => {
              console.log("specific topic data");
              console.log(discussionData);

              //SIGNED IN
              if (req.cookies.user_id) {
                Account.findById(req.cookies.user_id)
                  .then((acctData) => {
                    //if account is verified
                    if (acctData.verified == true) {
                      res.render("selectedTopic", {
                        title:
                          cleanName +
                          " Debate Discussions | Politiscussion",
                        signedin: true,
                        profile: acctData,
                        discussions: discussionData,
                        topic: selectedTopic,
                        topicClean: cleanName,
                        cLink:
                          "https://politiscussion.com/topics/" + selectedTopic,
                      });
                      //account not verified yet
                    } else {
                      res.render("mustVerify", {
                        title: "check email for verification link",
                        signedin: false,
                        cLink: null,
                      });
                    }
                  })
                  .catch((err) => {
                    res.send(err);
                  });
              }
              //NOT SIGNED IN
              else {
                res.render("selectedTopic", {
                  title: cleanName + " Debate Discussions | Politiscussion",
                  signedin: false,
                  discussions: discussionData,
                  topic: selectedTopic,
                  topicClean: cleanName,
                  cLink: "https://politiscussion.com/topics/" + selectedTopic,
                });
              }
            })
            .catch((err) => {
              res.send(err);
            });
        }
      }
    }
  );
});

//DISCUSSION POST PAGE !IMPORTANT
router.get("/topics/:topic/:id", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  var topic = req.params.topic;
  var discussion_id = req.params.id;
  console.log("\nGET /topics/" + topic + "/" + discussion_id);
  mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        Discussion.findById(req.params.id)
          .then((x) => {
            console.log(x);

            //discussion not found (404)
            if (x == null) {
              res.status(404);
              res.render("404", {
                title: "page not found",
                cLink: null,
              });
            } else {
              //get author details
              Account.findById(x.author)
                .then((authorData) => {
                  //cannot find authors account, dont let user view
                  if (authorData == null) {
                    console.log(
                      "-> error: cannot find author's account, dont let user view discussion"
                    );
                    res.status(404);
                    res.send(
                      "There was an error while requesting this discussion. Try again later. <a href='/'>home</a>"
                    );
                  } else {
                    //SIGNED IN
                    if (req.cookies.user_id) {
                      Account.findById(req.cookies.user_id).then((acctData) => {
                        //account is verified
                        if (acctData.verified == true) {
                          //account no longer exists, delete cookie
                          if (acctData == null) {
                            console.log(
                              "account cookie stored no longer exists, deleting cookie"
                            );
                            res.clearCookie("user_id");
                            res.redirect(
                              "/topics/" + topic + "/" + discussion_id
                            );
                          } else {
                            //check to see if this current disucssion was posted by user logged in
                            isUsersDiscussion(
                              req.cookies.user_id,
                              discussion_id
                            ).then((isUsersPost) => {
                              var belongsToUser;
                              isUsersPost == true
                                ? (belongsToUser = true)
                                : (belongsToUser = false);

                              //topic name incorrect, redirect to correct url
                              if (req.params.topic != x.topic) {
                                res.redirect(
                                  "/topics/" + x.topic + "/" + req.params.id
                                );
                              } else {
                                //check for signed in user's liked posts, if they already liked post send FILLED in thumbs up like svg
                                console.log(acctData);
                                var didUserLike =
                                  acctData.liked_posts.includes(discussion_id); //true if already liked, false if not
                                console.log(didUserLike);

                                console.log(
                                  "belongs to user - " + belongsToUser
                                );

                                //get all the comments for this discussion
                                getDiscussionComments(discussion_id).then(
                                  (commentData) => {
                                    console.log(
                                      "comment data for this discussion"
                                    );
                                    console.log(commentData);

                                    res.render("discussionPage", {
                                      title: x.title + " | Politiscussion",
                                      signedin: true,
                                      profile: acctData,
                                      discussions: x,
                                      authorDetails: authorData,
                                      isUsersDiscussion: belongsToUser,
                                      alreadyLiked: didUserLike,
                                      canComment: true,
                                      comments: commentData,
                                      cLink:
                                        "https://politiscussion.com/topics/" +
                                        topic +
                                        "/" +
                                        discussion_id,
                                    });
                                  }
                                );
                              }
                            });
                          }
                          //account not verified
                        } else {
                          res.render("mustVerify", {
                            title: "check email for verification link",
                            signedin: false,
                            cLink: null,
                          });
                        }
                      });
                    }
                    //NOT SIGNED IN
                    else {
                      console.log(x);
                      if (req.params.topic != x.topic) {
                        res.redirect(
                          "/topics/" + x.topic + "/" + req.params.id
                        );
                      } else {
                        getDiscussionComments(discussion_id).then(
                          (commentData) => {
                            
                            console.log('comments for this discussion');
                            console.log(commentData);

                            res.render("discussionPage", {
                              title: x.title + " | Politiscussion",
                              signedin: false,
                              discussions: x,
                              authorDetails: authorData,
                              isUsersDiscussion: false,
                              canComment: false,
                              comments: commentData,
                              cLink:
                                "https://politiscussion.com/topics/" +
                                topic +
                                "/" +
                                discussion_id,
                            });
                          }
                        );
                      }
                    }
                  }
                })
                .catch((err) => {
                  res.send(err);
                });
            }
          })
          .catch((err) => {
            res.send(err);
          });
      }
    }
  );
});

module.exports = router;
