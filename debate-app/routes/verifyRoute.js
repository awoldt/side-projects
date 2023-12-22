const express = require("express");
const mongoose = require("mongoose");
const { modelName } = require("../models/accountSchema");
const router = express.Router();
const Account = require("../models/accountSchema");

router.get("/verify/:acctID", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  const id = req.params.acctID;
  console.log("\nGET /verify/" + id);

  mongoose.connect(
    process.env.DB_LINK,
    { useNewUrlParser: true, useUnifiedTopology: true, ssl: true },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        Account.findByIdAndUpdate(id)
          .then((acctData) => {
            //acct already verified, just send to home screen
            if (acctData.verified == true) {
              console.log("account already verified, sending to homesreen");
            } else {
              console.log(acctData);
              acctData.verified = true;
              acctData
                .save()
                .then(() => {
                  console.log("account verified!");
                  res.redirect("/");
                })
                .catch((err) => {
                  console.log("could not save acct to mongodb");
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
