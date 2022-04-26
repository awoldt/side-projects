import CookieParser from "cookie";
import Account from "../model/account";
//returns array 
//signedIn[0] true or false
//signedIn[1] acct id string


module.exports = async (reqCookies) => {
  var signedIn = [];

  //CHECK FOR ACCOUNT COOKIES
  if (reqCookies !== undefined) {
    const t = Object.keys(CookieParser.parse(reqCookies));

    //USER IS NOT SIGNED IN
    if (t.indexOf("account") === -1) {
      signedIn[0] = false;
    }
    //USER HAS ACCOUNT COOKIE INSTALLED
    else {
      signedIn[0] = true;
      signedIn[1] = CookieParser.parse(reqCookies).account;
    }
  } else {
    signedIn[0] = false;
  }

//make sure account actually exists
  if (signedIn[0]) {
    
    try {
      var acctData = await Account.findById(signedIn[1]);
      acctData = await JSON.parse(JSON.stringify(acctData));
    } catch {
      //ACCOUNT DOES NOT EXIST
      signedIn[1] = null;
    }
  }

  return signedIn;
};
