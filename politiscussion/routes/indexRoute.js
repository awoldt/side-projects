const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Account = require("../models/accountSchema");
const Discussion = require("../models/discussionSchema");

async function getDiscussions() {
  var data = await Discussion.find().sort({ createdAt: -1 });
  return data;
}

router.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  console.log("\nGET /");
  var canonicalLink = "https://politiscussion.com";
  mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        console.log("Successfully connected to Mongodb!");
        //SIGNED IN
        if (req.cookies.user_id) {
          console.log("user is signed in ");
          console.log("user id - " + req.cookies.user_id);

          Account.findById(req.cookies.user_id)
            .then((userData) => {
              //if acct is verified
              if (userData.verified == true) {
                //account does not exist, remove cookie
                if (userData == null) {
                  console.log(
                    "error: account id no longer exists, deleting cookie"
                  );
                  res.clearCookie("user_id");
                  res.redirect("/");
                } else {
                  console.log(userData);

                  //grab recent discussions to display to user
                  getDiscussions()
                    .then((discussionData) => {
                      res.render("userFeed", {
                        title: "Politiscussion",
                        signedin: true,
                        profile: userData,
                        discussions: discussionData,
                        cLink: canonicalLink,
                      });
                    })
                    .catch((err) => {
                      res.send(err);
                    });
                }
              }
              //acct not verified
              else {
                res.render("mustVerify", {
                  title: "check email address for verification link",
                  signedin: false,
                  cLink: null,
                });
              }
            })
            .catch((err) => {
              //one possible error is having a user_id cookie on browswer that no longer exists
              res.clearCookie("user_id");
              res.redirect("/");
            });
        }
        //NOT SIGNED IN
        else {
          getDiscussions().then((discussionData) => {
            console.log("user is not signed in");
            res.render("homePage", {
              title:
                "Politiscussion: Debate Controversial Topics with no Censorship",
              signedin: false,
              discussions: discussionData,
              cLink: canonicalLink,
            });
          });
        }
      }
    }
  );
});

router.get("/signup", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  //SIGNED IN
  if (req.cookies.user_id) {
    res.redirect("/");
  }
  //NOT SIGNED IN
  else {
    res.render("signupPage", {
      title: "Create a Free Account | Politiscussion",
      signedin: false,
      cLink: "https://politiscussion.com/signup",
    });
  }
});

router.get("/signin", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  //SIGNED IN
  if (req.cookies.user_id) {
    res.redirect("/");
  }
  //NOT SIGNED IN
  else {
    res.render("signinPage", {
      title: "Sign In | Politiscussion",
      signedin: false,
      cLink: "https://politiscussion.com/signin",
    });
  }
});

module.exports = router;
