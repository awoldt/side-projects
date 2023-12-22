const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Discussion = require("../models/discussionSchema");
const Account = require("../models/accountSchema");
var profanityFilter = require("bad-words");
const { body, validationResult } = require("express-validator");
const cleanDate = require('date-and-time');


router.use(bodyParser.json());

//checks strings for bad words
//returns true if contains profanity, false if not
function filterWords(x) {
  var filter = new profanityFilter();
  var str = filter.clean(x);

  //if c array is longer than 1, it contains bad word (or someone used a * symbol)
  var c = str.split("*");
  if (c.length == 1) {
    return false;
  } else {
    return true;
  }
}

//removes all spaces from user post data
function removeSpaces(x) {
  var result;
  var str = x.split(" ");
  //no spaces, correct format
  if (str.length == 1) {
    result = x;
  }
  //there are spaces within user input
  else {
    var c = true;
    while (c == true) {
      //make sure that only spaces after text are removed ('hello world' is valid bc there needs to be a space inbetween, 'hello world ' is not correct)
      if (str[str.length - 1] == "") {
        str.pop();
      } else {
        c = false;
        result = str.join(" ");
      }
    }
  }

  return result;
}

router.get("/post", (req, res) => {
  console.log("\nGET /post");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.

  //all topics with values for newdiscussionpage select
  //used when user has ?topic=xxxx get query on new discussion page
  var availableTopics = [
    { topic: "Abortion", value: "abortion" },
    { topic: "Black Lives Matter", value: "black-lives-matter" },
    { topic: "Border Security", value: "border-security" },
    { topic: "Climate", value: "climate" },
    { topic: "COVID-19", value: "covid-19" },
    { topic: "Critical Race Theory", value: "critical-race-theory" },
    { topic: "Guns", value: "guns" },
    { topic: "Healthcare", value: "healthcare" },
    { topic: "Immigration", value: "immigration" },
    { topic: "Minimum Wage", value: "minimum-wage" },
    { topic: "Police Reform", value: "police-reform" },
    { topic: "Social Media", value: "social-media" },
    { topic: "Trump", value: "trump" },
    { topic: "Voting Rights", value: "voting-rights" },
  ];

  var t = undefined; //topic value to use
  var tname = undefined; //name of topic to display on options select

  //if there is a get request with ? key value pairs
  if (req.query.topic) {
    console.log(
      "user wants to post discussion in the " + req.query.topic + " topic"
    );
    t = req.query.topic;
    for (i = 0; i < availableTopics.length; ++i) {
      if (availableTopics[i].value == t) {
        tname = availableTopics[i].topic;
      }
    }
    //the req.query topic does not exist, load regular page
    if (tname == undefined) {
      console.log("the topic query of " + req.query.topic + " does not exist");
      res.redirect("/post");
    } else {
      //SIGNED IN
      if (req.cookies.user_id) {
        Account.findById(req.cookies.user_id).then((acctData) => {
          //if account is verified
          if (acctData.verified == true) {
            //account no longer exists, delete cookie
            if (acctData == null) {
              console.log("account no longer exists, deleting cookie");
              res.clearCookie("user_id");
              res.redirect("/");
            } else {
              res.render("newDiscussionPage", {
                title: "Create a new Debate | Politiscussion",
                signedin: true,
                profile: acctData,
                topic: t,
                topicName: tname,
                topicOptions: availableTopics,
                cLink: "https://politiscussion.com/post",
              });
            }
          }
          //acct not verified
          else {
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
        res.redirect("/signin");
      }
    }
  } else {
    console.log(
      "there is no request queries for specific topic, load regular page"
    );
    //SIGNED IN
    if (req.cookies.user_id) {
      Account.findById(req.cookies.user_id).then((acctData) => {
        //if account is verified
        if (acctData.verified == true) {
          //account no longer exists, delete cookie
          if (acctData == null) {
            console.log("account no longer exists, deleting cookie");
            res.clearCookie("user_id");
            res.redirect("/");
          } else {
            res.render("newDiscussionPage", {
              title: "Create a new Debate | Politiscussion",
              signedin: true,
              profile: acctData,
              topic: t,
              topicName: tname,
              topicOptions: availableTopics,
              cLink: "https://politiscussion.com/post",
            });
          }
        }
        //acct not verified
        else {
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
      res.redirect("/signin");
    }
  }
});

//new discussion post
router.post(
  "/fetch/postDiscussion",
  body("text").isLength({ max: 10000, min: 50 }),
  (req, res) => {
    //check is post data is valid
    const validationErrors = validationResult(req);
    //error in user data, not valid
    if (!validationErrors.isEmpty()) {
      res.json({
        status: "error",
        msg: "Error while trying to post discussion",
      });
      //user data is formatted correctly, attempt to connect to database
    } else {
      console.log("\nPOST /fetch/postDiscussion");
      mongoose.connect(
        process.env.DB_LINK,
        { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
        (err) => {
          if (err) {
            res.json({ status: "error", msg: "Error posting discussion" });
          } else {
            //removes bad words from text
            var badTitle = filterWords(req.body.title);
            //title has profanity, deny discussion post
            if (badTitle == true) {
              res.json({ status: "error", msg: "Cannot use that title" });
            } else {
              var filter = new profanityFilter();
              req.body.text = filter.clean(req.body.text);
              req.body.title = removeSpaces(req.body.title);

              //create date to display on discussion page
              const now = new Date();
              var currentDate = cleanDate.format(now, 'ddd, MMM DD YYYY');

              var data = new Discussion({
                topic: req.body.topic,
                topicCleanName: req.body.cleanName,
                selectedTopicsHref: "/topics/" + req.body.topic,
                title: req.body.title,
                text: req.body.text,
                author: req.cookies.user_id,
                href: null,
                likes: req.body.likes,
                createdAtClean: currentDate,
              });
              data
                .save()
                .then((x) => {
                  //need to update href key of discussion post after saving
                  Discussion.findByIdAndUpdate(
                    x._id,
                    { href: "/topics/" + x.topic + "/" + x._id },
                    (err) => {
                      if (err) {
                        res.send(err);
                      } else {
                        //add discussion id to users account discussion posts array
                        Account.findByIdAndUpdate(req.cookies.user_id)
                          .then((accountData) => {
                            console.log(accountData);
                            accountData.discussions.push(x._id);
                            accountData.save().then(() => {
                              res.json({
                                status: "ok",
                                msg: "successfully created discussion",
                                data: x,
                              });
                            });
                          })
                          .catch((err) => {
                            if (err) {
                              res.send(err);
                            }
                          });
                      }
                    }
                  );
                })
                .catch((err) => {
                  res.send(err);
                });
            }
          }
        }
      );
    }
  }
);

module.exports = router;
