import React from "react";
import databaseConnect, { state } from "../../scripts/databaseConnect";
import Poll from "../../model/poll";
import getFreeResponseData from "../../scripts/getFreeResponseData";
import FreeResponseDisplay from "../../components/FreeResponseDisplay";
import getMultipleChoiceData from "../../scripts/getMultipleChoiceData";
import MultipleChoiceDisplay from "../../components/MultipleChoiceDisplay";
import Cookies from "js-cookie";
import checkifSignedIn from "../../scripts/userSignedIn";

const Index = ({
  poll_type,
  poll_data,
  answered,
  site_url,
  vote_percentages,
  user_signedin,
}) => {

  var c;
  //not signed in
  if (user_signedin[0] === false) {
    c = false;
  } else {
    //invalid account cookie
    if (user_signedin[1] === null) {
      c = false;
      Cookies.remove("account");
    }
    //valid account cookie
    else {
      c = Cookies.get("account");
    }
  }

  //FREE RESPONSE POLL
  if (poll_type === "free_response") {
    return <FreeResponseDisplay data={poll_data} account_cookie={c} />;
  }
  //MULTIPLE CHOICE POLL
  else if (poll_type === "multiple_choice") {
    return (
      <MultipleChoiceDisplay
        data={poll_data}
        already_voted={answered}
        social_share_data={site_url}
        vote_percentage={vote_percentages}
        account_cookie={c}
      />
    );
  }
};

export default Index;

export async function getServerSideProps({ query, req }) {
  if (state !== 1) {
    await databaseConnect();
  } else {
    console.log("Connection with mongoDB already established");
  }
  console.log("\nGET /p/" + query.poll_id);

  try {
    var p = await Poll.findById(query.poll_id);
    p = await JSON.parse(JSON.stringify(p));

    var signedIn = await checkifSignedIn(req.headers.cookie);

    console.log("THIS POLL IS A " + p.type + " POLL");

    //MULTIPLE CHOICE POLL
    if (p.type === "multiple_choice") {
      var data;

      //if signedIn is true and valid, check account to see if answered poll already
      if (signedIn[0] === false) {
        console.log("User is not signed in :(");
        data = await getMultipleChoiceData(p, req.headers.cookie, false, null);
      } else {
        //invalid account cookie
        if (signedIn[1] === null) {
          console.log("Invalid account cookie, removing.....");
          data = await getMultipleChoiceData(
            p,
            req.headers.cookie,
            false,
            null
          );
          Cookies.remove("account");
        }
        //valid account cookie
        else {
          console.log("User has valid account cookie set :)");

          //check to see if user has already answered this poll
          data = await getMultipleChoiceData(
            p,
            req.headers.cookie,
            signedIn[1],
            query.poll_id
          );
        }
      }

      return {
        props: {
          poll_type: p.type,
          poll_data: data,
          answered: data.already_answered,
          site_url: req.headers.referer,
          vote_percentages: data.vote_percentages,
          user_signedin: signedIn,
        },
      };
    } else if (p.type === "free_response") {
      var data;

      //if signedIn is true and valid, check account to see if answered poll already
      if (signedIn[0] === false) {
        console.log("User is not signed in :(");
        data = await getFreeResponseData(p);
      } else {
        //invalid account cookie
        if (signedIn[1] === null) {
          console.log("Invalid account cookie, removing.....");
          data = await getFreeResponseData(p);
          Cookies.remove("account");
        }
        //valid account cookie
        else {
          console.log("User has valid account cookie set :)");

          //check to see if user has already answered this poll
          data = await getFreeResponseData(p);
        }
      }

      return {
        props: {
          poll_type: p.type,
          poll_data: data,
          user_signedin: signedIn,
        },
      };
    }
    //404
  } catch (e) {
    console.log(e);

    return {
      notFound: true,
    };
  }
}
