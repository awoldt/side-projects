const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Account = require("../models/accountSchema");
const Discussion = require("../models/discussionSchema");

async function getAcct(id) {
  var result;
  var x = await Account.findById(id);
  //account doesnt exist
  if (!x) {
    result = false;
  } else {
    result = x;
  }
  return result;
}

async function getDiscussionPosts(postId) {
  var data = [];
  for (i = 0; i < postId.length; ++i) {
    var x = await Discussion.findById(postId[i]);
    data.push(x);
  }
  return data;
}

router.get("/profile", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  console.log("\nGET /profile");
  res.setHeader("X-Robots-Tag", "noindex"); //search engines cannot index this page
  //SIGNED IN
  if (req.cookies.user_id) {
    mongoose.connect(
      process.env.DB_LINK,
      { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
      (err) => {
        if (err) {
          res.send("error connecting to database");
        } else {
          getAcct(req.cookies.user_id)
            .then((acctData) => {
              if (acctData == false) {
                res.clearCookie("user_id");
                res.redirect("/");
              } else {
                console.log(acctData);

                //get all discussion posts
                getDiscussionPosts(acctData.discussions)
                  .then((discussionData) => {
                    console.log(discussionData);

                    res.render("profilePage", {
                      title: "Profile",
                      signedin: true,
                      profile: acctData,
                      discussions: discussionData,
                      cLink: null,
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
      }
    );
  }
  //NOT SIGNED IN
  else {
    res.redirect("/signin");
  }
});

router.get("/profile/:id", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  const profileID = req.params.id;
  console.log("\nGET /profile/" + profileID);
  mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
    (err) => {
      if (err) {
        res.send("could not connect to database");
      } else {
        //gets the requested user's account
        Account.findById(profileID)
          .then((userAcctData) => {
            //if account is verified
            if (userAcctData.verified == true) {
              console.log(userAcctData);
              //account does not exist (404)
              if (userAcctData == null) {
                res.status(404);
                res.render("404", {
                  title: "page not found",
                  cLink: null,
                });
              }
              //account succesfully found (200)
              else {
                //get all discussion details
                var promises = userAcctData.discussions.map(async (item) => {
                  var data = await Discussion.findById(item);
                  return new Promise((res, rej) => {
                    res(data);
                  });
                });

                Promise.all(promises).then((discussionData) => {
                  console.log("USERS DISCUSSIONS");
                  console.log(discussionData);
                  //SIGNED IN
                  if (req.cookies.user_id) {
                    var isUsersAccount;
                    //check if user profile page belongs to person signed in
                    profileID == req.cookies.user_id
                      ? (isUsersAccount = true)
                      : (isUsersAccount = false);

                    //gets signed in user account details
                    Account.findById(req.cookies.user_id).then((acctData) => {
                      res.render("userProfilePage", {
                        title:
                          userAcctData.username + " Profile | Politiscussion",
                        signedin: true,
                        profile: acctData, //used for navbar on userprofilepage
                        userProfile: userAcctData,
                        discussions: discussionData,
                        profileBelongToUser: isUsersAccount,
                        cLink:
                          "https://politiscussion.com/profile/" + profileID,
                      });
                    });
                  }
                  //NOT SIGNED IN
                  else {
                    res.render("userProfilePage", {
                      title:
                        userAcctData.username + " Profile | Politiscussion",
                      signedin: false,
                      userProfile: userAcctData,
                      discussions: discussionData,
                      profileBelongToUser: false,
                      cLink: "https://politiscussion.com/profile/" + profileID,
                    });
                  }
                });
              }
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
    }
  );
});

module.exports = router;
