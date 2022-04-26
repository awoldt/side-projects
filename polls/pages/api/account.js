import validator from "validator";
import Account from "../../model/account";

export default async function handler(req, res) {
  //NEW ACCOUNT
  if (req.body.action === "create_account") {
    //valid email
    if (validator.isEmail(req.body.acct_data[0])) {
      var x = new Account({
        email: req.body.acct_data[0],
        password: req.body.acct_data[1],
      });
      try {
        await x.save();

        res
          .status(200)
          .json({ status: "ok", msg: "account created", acct_id: x._id });
      } catch (e) {
        console.log("Could not save account :(");
        res.status(200).json({ status: "error", msg: "error saving account" });
      }
    }
    //not a valid email
    else {
      res.status(200).json({ status: "error", msg: "not a valid email" });
    }
  }
  //LOG IN
  else if (req.body.action === "log_in") {
    //valid email
    if (validator.isEmail(req.body.email)) {
      const a = await Account.find({
        email: req.body.email,
        password: req.body.password,
      });

      //account does not exist
      if (a.length === 0) {
        console.log("account does not exist :(");
        res
          .status(200)
          .json({ status: "error", msg: "account does not exist" });
      }
      //successful log in
      else {
        console.log(a);
        console.log("successful log in");
        res
          .status(200)
          .json({ status: "ok", msg: "logged in successfully", id: a[0]._id });
      }
    }
    //not a valid email
    else {
      res.status(200).json({ status: "error", msg: "invalid email" });
    }
  }
  //WHAT USER HAS VOTED FOR ON CURRENT POLL
  else if (req.body.action === "get_current_vote") {
    const data = await Account.findById(req.body.id);

    var a;
    //loop through all user votes until find the answer to current poll
    await data.votes.forEach((x) => {
      //match
      if (x.poll_id === req.headers.referer.split("/p/")[1]) {
        a = x.answer;
      }
    });

    res.status(200).json({ status: "ok", msg: "got user vote", user_vote: a });
  }
}
