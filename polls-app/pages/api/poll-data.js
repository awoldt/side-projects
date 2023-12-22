import Poll from "../../model/poll";
import mongoConnect, { state } from "../../scripts/databaseConnect";
import badWordFilter from "bad-words";
const filter = new badWordFilter();
import newPoll from "../../scripts/newPoll";
import Account from "../../model/account";
import FreeReponsePoll from "../../model/freeReponseModel";

export default async function handler(req, res) {
  if (state !== 1) {
    await mongoConnect();
  }

  //VOTE
  if (req.body.action === "vote") {
    console.log(req.body);
    console.log("\nvote data " + req.body.id + " (" + req.body.answer + ")");

    const pushedVote = {
      answer: req.body.answer,
      text: req.body.value,
    };

    const addUserVote = {
      poll_id: req.body.id,
      answer: req.body.answer,
    };

    try {
      //insert answer into poll responseAnswers by updating document
      const p = await Poll.findById(req.body.id);
      p.responseAnswers.push(pushedVote);
      await p.save();
      console.log("Updated poll with answer " + req.body.answer);

      const u = await Account.findById(req.body.account);
      u.votes.push(addUserVote);
      await u.save();
      console.log("added vote to user accounts vote array");

      res.status(200).json({
        status: "ok",
        msg: "voteed ok!",
        pollCookie: req.body.id,
      });
    } catch (err) {
      console.log(err);
      res
        .status(200)
        .json({ status: "error", msg: "Error submitting vote :(" });
    }
  }
  //CREATE NEW POLL
  else if (req.body.action === "create_poll") {
    //cannot create poll if title contains cuss words
    if (filter.isProfane(req.body.poll_data.title)) {
      res.status(200).json({
        status: "error",
        msg: "Cannot create new poll with current title",
      });
    } else {
      const p = await newPoll(req.body, req.body.type);
      if (p[0] == true) {
        res.status(200).json({
          status: "ok",
          msg: "new poll saved!",
          poll_url: "/p/" + p[1],
        });
      } else {
        res.status(200).json({ status: "error", msg: "could not save poll" });
      }
    }
  }
  //USER ENTERING PASSWORD FOR PRIVATE POLL
  else if (req.body.action === "password_submission") {
    //need to compare password given with password stored in database
    var id = req.headers.referer.split("/p/");
    if (id.length === 1) {
      res.status(200).json({
        status: "error",
        msg: "error while submitting password",
      });
    } else {
      try {
        const p = await Poll.findById(id[1]);

        //wrong password
        if (req.body.guess !== p.private_password) {
          res.status(200).json({
            status: "error",
            msg: "password not correct",
          });
        }
        //sucessfully guessed password
        else {
          res.status(200).json({
            status: "ok",
            msg: "guessed password correctly",
            c: "password_" + id[1],
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  //POLL FILTERING
  else if (req.body.action === "filter_polls") {
    if (req.body.tag !== "all") {
      var pollData = await Poll.find({ tag: req.body.tag });
    } else {
      var pollData = await Poll.find(); //finds all
    }

    res
      .status(200)
      .json({ status: "ok", msg: "filtered polls", poll_data: pollData });
  }
  //RESPONSE TO FREE RESPONSE POLL
  else if (req.body.action === "response") {
    try {
      var p = await FreeReponsePoll.findById(req.body.poll_id);
      console.log(req.body.response)
      p.responses.push(filter.clean(req.body.response));
      await p.save();

      res
        .status(200)
        .json({ status: "ok", msg: "free response user response added" });
    } catch (err) {
      console.log(err);
      console.log("error adding response to free response poll");
      res.status(200).json({
        status: "error",
        msg: "could not add free response user response",
      });
    }
  }
  //INVALID REQUEST
  else {
    res.status(500).json({ status: "error", msg: "could not process request" });
  }
}
