const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
var asyncLoop = require("async");
const e = require("express");

async function getPerformance(gainUrl, loseUrl) {
  const gainData = await fetch(gainUrl);
  const gainJsonData = await gainData.json(); //gainer data
  const loseData = await fetch(loseUrl);
  const loseJsonData = await loseData.json();
  var status = "ok";

  gainJsonData.length = 8;
  loseJsonData.length = 8;

  asyncLoop.eachOf(gainJsonData, (obj, index) => {
    var x = obj.changesPercentage.split("(");
    x = x[1];
    x = x.split(")");
    x = x[0];
    obj.changesPercentage = x;
  });
  asyncLoop.eachOf(loseJsonData, (obj, index) => {
    var x = obj.changesPercentage.split("(");
    x = x[1];
    x = x.split(")");
    x = x[0];
    obj.changesPercentage = x;
  });

  return [status, gainJsonData, loseJsonData];
}

async function getMarketIndexes() {
  const url =
    "https://financialmodelingprep.com/api/v3/quotes/index?apikey=16ff8e3fa191fcdccf3e2a46ae7f702e";
  const data = await fetch(url);
  const jsonData = await data.json();
  var status = "ok";

  var indexes = [];

  var DOW_JONES = jsonData.find((e) => e.symbol == "^DJI");
  DOW_JONES.name = "Dow Jones";
  var SANDP = jsonData.find((e) => e.symbol == "^GSPC");
  var NASDAQ = jsonData.find((e) => e.symbol == "^NDX");
  var RUSSELL = jsonData.find((e) => e.symbol == "^RUT");
  indexes.push(DOW_JONES);
  indexes.push(SANDP);
  indexes.push(NASDAQ);
  indexes.push(RUSSELL);
  console.log(DOW_JONES);

  return [status, indexes];
}

router.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.

  getPerformance(
    "https://fmpcloud.io/api/v3/gainers?apikey=16ff8e3fa191fcdccf3e2a46ae7f702e",
    "https://fmpcloud.io/api/v3/losers?apikey=16ff8e3fa191fcdccf3e2a46ae7f702e"
  )
    .then((performaceData) => {
      getMarketIndexes()
        .then((marketIndexData) => {
          console.log(performaceData);

          res.render("index", {
            tickerPage: false,
            title: "Simple Stock Chart - User Friendly Stock Quotes and Charts",
            description:
              "Easily discover any stock on NASDAQ, NYSE, and AMEX exchanges. Search for any ticker or company and get reliable price data and recent news.",
            gainerData: performaceData[1],
            loserData: performaceData[2],
            canLink: "https://simplestockchart.com",
            marketIndex: marketIndexData,
            homePage: true,
          });
        })
        .catch((err) => {
          if (err) {
            res.send("error: could not get index data");
          }
        });
    })
    .catch((err) => {
      if (err) {
        res.send("error: could not get todays gainers/loser data");
      }
    });
});

module.exports = router;
