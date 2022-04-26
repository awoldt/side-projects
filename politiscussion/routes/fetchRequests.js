const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const Account = require("../models/accountSchema");
const Discussion = require("../models/discussionSchema");
var profanityFilter = require("bad-words");
var htmlParser = require("node-html-parser").parse;

require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY); //backend emailer

router.use(bodyParser.json());

//looks for email in database
async function doesEmailExist(e) {
  e = e.toLowerCase();
  var x = await Account.find({ email: e });

  return x;
}

async function doesUsernameExist(name) {
  name = name.toLowerCase(); //makes sure all usernames are lowercase when comparing
  var x = await Account.find({ username: name });

  return x;
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

router.post(
  "/fetch/signup",
  body("email").isEmail(),
  body("username").isLength({ max: 35 }),
  (req, res) => {
    console.log("\nPOST fetch/signup");
    const validationErrors = validationResult(req);
    //error in user data, not valid
    if (!validationErrors.isEmpty()) {
      res.json({
        status: "error",
        msg: "Error while trying to create account",
      });
      //user data is formatted correctly, attempt to connect to database
    } else {
      console.log("POST REQUEST BODY DATA:");
      console.log(req.body.email);
      console.log(req.body.password);

      //checks username for profanity
      var badWords = filterWords(req.body.username);
      if (badWords == true) {
        res.json({ status: "error", msg: "Cannot use that username" });
      } else {
        mongoose.connect(
          process.env.DB_LINK,
          { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
          (err) => {
            //error connecting to database
            if (err) {
              console.log("error connecting to mongodb");
              console.log(err);
              //successful connetion to database
            } else {
              console.log(">successful POST request to database!");

              //CREATE NEW ACCOUNT
              doesEmailExist(req.body.email)
                .then((emailData) => {
                  //email already exists in database
                  if (emailData.length != 0) {
                    res.json({ status: "error", msg: "email already in use" });
                  } else {
                    //check if username is taken
                    doesUsernameExist(req.body.username)
                      .then((usernameData) => {
                        console.log(usernameData);
                        //username taken
                        if (usernameData.length != 0) {
                          res.json({
                            status: "error",
                            msg: "Username taken",
                          });
                        }
                        //username available, create acct
                        else {
                          //generate account creation date
                          let d = new Date();
                          var day = ("0" + d.getDate()).slice(-2);
                          var month = ("0" + (d.getMonth() + 1)).slice(-2);
                          var year = d.getFullYear();
                          var dateString = year + "-" + month + "-" + day;

                          //remove spaces from user input
                          req.body.email = removeSpaces(req.body.email);
                          req.body.username = removeSpaces(req.body.username);

                          //stores default party color in users acct
                          switch (req.body.party) {
                            case "republican":
                              partyColor = "red";
                              break;

                            case "democrat":
                              partyColor = "dodgerblue";
                              break;

                            case "libertarian":
                              partyColor = "#cc9966"; //brownish color
                              break;

                            case "socialist":
                              partyColor = "green";
                              break;
                          }

                          var data = new Account({
                            verified: false, //default value
                            email: req.body.email,
                            username: req.body.username,
                            password: req.body.password,
                            party: req.body.party,
                            party_color: partyColor,
                            account_created: dateString,
                          });
                          data
                            .save()
                            .then((savedAcctData) => {
                              console.log("NEW ACCT DETAILS");
                              console.log(savedAcctData);
                              var verificationLink =
                                "https://politiscussion.com/verify/" +
                                savedAcctData._id;

                              var htmlParse = htmlParser(
                                '<a href="' +
                                  verificationLink +
                                  '">Click here to verify link</a>'
                              );
                              htmlParse = htmlParse.toString();
                              sendTo = String(req.body.email);
                              const emailMsg = {
                                to: sendTo,
                                from: "bot@politiscussion.com", // Use the email address or domain you verified above
                                subject: "Politiscussion Account Verification",
                                text: "Log into your new Politiscussion account",
                                html: htmlParse,
                              };

                              //send confirmation email
                              sgMail
                                .send(emailMsg)
                                .then((emailData) => {
                                  //set cookie
                                  //search for account just created with that email and get unique id

                                  Account.find({ email: req.body.email })
                                    .then((accountInfo) => {
                                      res.cookie(
                                        "user_id",
                                        accountInfo[0]._id,
                                        {
                                          httpOnly: true,
                                        }
                                      );
                                      res.json({
                                        status: "ok",
                                        msg: "Account successfully created",
                                      });
                                    })
                                    .catch((err) => {
                                      res.send(err);
                                    });
                                })
                                .catch((err) => {
                                  res.send(err);
                                });
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
                })
                .catch((err) => {
                  res.send(err);
                });
            }
          }
        );
      }
    }
  }
);

router.post("/fetch/signin", body("email").isEmail(), (req, res) => {
  var redirectTo = req.body.redirectHref;
  
  console.log("\nPOST /fetch/signin");
  console.log('redirect user to ' + redirectTo + ' after successful login');
  const validationErrors = validationResult(req);
  //error in user data
  if (!validationErrors.isEmpty()) {
    res.json({ status: "error", msg: "Email is not in correct format" });
    //user data is formatted correctly, attempt to connect to database
  } else {
    mongoose.connect(
      process.env.DB_LINK,
      { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
      (err) => {
        if (err) {
          console.log("error connecting to mongodb");
          console.log(err);
        } else {
          doesEmailExist(req.body.email)
            .then((emailData) => {
              //email exists (200 success), now compare password
              if (emailData.length != 0) {
                Account.find({
                  email: req.body.email,
                  password: req.body.password,
                })
                  .then((accountData) => {
                    console.log(accountData);
                    //account does not exist
                    if (accountData.length == 0) {
                      res.json({
                        status: "error",
                        msg: "email or password incorrect",
                      });
                    } else {
                      res.cookie("user_id", accountData[0]._id, {
                        httpOnly: true,
                        maxAge: 31536000,
                      });
                      res.json({
                        status: "ok",
                        msg: "sign in successful",
                        redirect: redirectTo,
                      });
                    }
                  })
                  .catch((err) => {
                    res.send(err);
                  });
              } else {
                res.json({
                  status: "error",
                  msg: "email or password incorrect",
                });
              }
            })
            .catch((err) => {
              res.send(err);
            });
        }
      }
    );
  }
});

router.get("/fetch/signout", (req, res) => {
  res.clearCookie("user_id");

  console.log("signed out");

  var redirectTo = req.headers.referer;

  res.json({ redirect: redirectTo });
});

//adds like to post
router.post("/fetch/addLike", (req, res) => {
  console.log("\nGET /fetch/addLike");
  var reqUrl = req.headers.referer;
  reqUrl = reqUrl.split("/");
  const discussionID = reqUrl[reqUrl.length - 1];
  console.log(discussionID);

  //find discussion
  Discussion.findByIdAndUpdate(discussionID)
    .then((discussionData) => {
      //look up author of post to get correct like btn colors (red = republica, blue = democrat)
      Account.findById(discussionData.author)
        .then((authorData) => {
          //cannot find user who posted, cannot like post
          if (authorData == null) {
            res.json({
              status: "error",
              msg: "could not like post, author not found",
            });
          } else {
            //get logged in user details to see if post has already been liked
            Account.findByIdAndUpdate(req.cookies.user_id)
              .then((userData) => {
                var didUserLike = userData.liked_posts.includes(discussionID); //true if already liked, false if not
                console.log("has user already liked post - " + didUserLike);

                //user has already liked post, minus 1 like on discussion post like, remove from users liked posts arary
                if (didUserLike == true) {
                  discussionData.likes -= 1;
                  discussionData
                    .save()
                    .then(() => {
                      var index = userData.liked_posts.indexOf(discussionID);
                      userData.liked_posts.splice(index, 1);
                      userData
                        .save()
                        .then(() => {
                          res.json({
                            status: "ok",
                            msg: "successfully unliked post",
                            color: authorData.party_color,
                            likeBtnType: "not-filled",
                            numOflikes: discussionData.likes,
                          });
                        })
                        .catch((err) => {
                          res.send(err);
                        });
                    })
                    .catch((err) => {
                      res.send(err);
                    });
                }
                //user has not liked post, add 1 like to discussion post, add disucssion id to users's liked post
                else {
                  discussionData.likes += 1;
                  discussionData
                    .save()
                    .then(() => {
                      userData.liked_posts.push(discussionID);
                      userData
                        .save()
                        .then(() => {
                          res.json({
                            status: "ok",
                            msg: "successfully liked post",
                            color: authorData.party_color,
                            likeBtnType: "filled",
                            numOflikes: discussionData.likes,
                          });
                        })
                        .catch((err) => {
                          res.send(err);
                        });
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
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
