import CookieParser from "cookie";
import Account from "../model/account";

module.exports = async (p, reqCookies, validAccount, cuurentPollId) => {
  var answered;
  var privPoll;
  var privateIcon;
  var percentageVote;

  if (validAccount !== false) {
    const a = await Account.findById(validAccount);

    //if votes array is empty, user has not alreayd answered
    if (a.votes.length === 0) {
      answered = false;
    } else {
      answered = false; //will change if user has answered poll
      a.votes.forEach((x) => {
        if (x.poll_id === cuurentPollId) {
          console.log("User has already answered this poll");
          answered = true;
        }
      });
    }
  }
  //not a valid cookie
  else {
    console.log("User has not already answered this poll");
    answered = false;
  }

  //caluculate percentage of total vote for each answer choice
  //will return array same length as how many answer choices there are
  //each item in array will be total number of votes for that specific answer choice
  if (p.responseAnswers.length !== 0) {
    var a = new Array(4).fill(0);
    p.responseAnswers.forEach((x) => {
      if (x.answer === "A") {
        a[0] += 1;
      } else if (x.answer === "B") {
        a[1] += 1;
      } else if (x.answer === "C") {
        a[2] += 1;
      } else if (x.answer === "D") {
        a[3] += 1;
      }
    });

    var totalVotes = a.reduce((p, c) => {
      return p + c;
    });

    percentageVote = a.map((x) => {
      return ((x / totalVotes) * 100).toFixed(2);
    });
  } else {
    percentageVote = null;
  }

  //make clean date for poll creation date
  p.createdAtClean = new Date(p.createdAt).toDateString();

  //private poll
  if (p.private) {
    console.log("This is a private poll");
    privateIcon = true;
    if (reqCookies !== undefined) {
      //check to see if user already has cookies installed to access private poll
      var password_cookie = await CookieParser.parse(reqCookies);

      password_cookie = Object.keys(password_cookie);
      //user has access to private poll
      if (password_cookie.indexOf("password_" + p._id) !== -1) {
        privPoll = false;
      }
      //user does not have accses to poll, must try and guess password
      else {
        privPoll = true;
      }
    } else {
      privPoll = true;
    }
  } else {
    privPoll = false;
    privateIcon = false;
  }

  return {
    poll_data: p,
    private_poll: privPoll,
    display_private_icon: privateIcon,
    already_answered: answered,
    vote_percentages: percentageVote,
  };
};
