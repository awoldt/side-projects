const express = require("express");
const router = express.Router();
var fetch = require("node-fetch");
var jsonFile = require("jsonfile");
var arrayFind = require("array-find");
const { concatSeries } = require("async");
var commaNumber = require("comma-number");
var timestamp = require("unix-timestamp");
const { json } = require("express");
var asyncLoop = require("async");
const shuffle = require("array-shuffle");
const { resolve } = require("path");
const { connected } = require("process");

//gets more accurate results for user
//'apple' == AAPL, not APC
async function getRedirectData(x) {
  var data;

  if (x == "redirects") {
    data = await jsonFile.readFile(__dirname + "/misc/redirects.json");
  } else if (x == "searchRedirects") {
    data = await jsonFile.readFile(__dirname + "/misc/searchRedirects.json");
  }

  return data;
}

//uses FMP search API to return most relevant results from user's search query
//picks the first ticker in results obj as one user is searching for, if there are no redirects
//RETURNS A SINGLE STOCK SYMBOL
async function getTickerSearch(query) {
  const url =
    "https://financialmodelingprep.com/api/v3/search?query=" +
    query +
    "&limit=1&apikey=16ff8e3fa191fcdccf3e2a46ae7f702e";
  const data = await fetch(url);
  const jsonData = await data.json();
  var stockSymbol;
  var status = "ok";

  var canonicalLink;

  var redirectData = await getRedirectData("redirects");
  //looks for redirects in the /misc/redirects.json file
  var isRedirect = arrayFind(redirectData.data, (x) => {
    query = query.toLowerCase();
    return x.name === query;
  });
  //there is a ticker redirect for user's query
  if (isRedirect != undefined) {
    stockSymbol = isRedirect.redirectTicker;
    console.log(
      "redirecting to -> " + stockSymbol + " (ignore search results)"
    );
  }
  //if there is not a ticker redirect
  else {
    //looks for searchRedirects in the /misc/searchRedirects.json file
    var redirectData2 = await getRedirectData("searchRedirects");
    var isRedirect2 = arrayFind(redirectData2.data, (x) => {
      query = query.toLowerCase();
      return x.name == query;
    });
    //there is a search redirect for user's query
    if (isRedirect2 != undefined) {
      stockSymbol = isRedirect2.redirectTicker;
      console.log(
        "redirecting to -> " + stockSymbol + " (ignore search results)"
      );
      canonicalLink = isRedirect2.canonicalLink;
    }
    //no search redirect could be found
    else {
      canonicalLink = null;
      //if FMP did not find anything, (404 could not find stock)
      if (jsonData.length == 0) {
        status = "could not find stock";
      } else {
        stockSymbol = jsonData[0].symbol;
      }
    }
  }

  stockSymbol = stockSymbol.toUpperCase();
  return [status, stockSymbol];
}

//gets current quote data on stock ticker
async function getPriceData(ticker) {
  const url =
    "https://financialmodelingprep.com/api/v3/quote/" +
    ticker +
    "?apikey=16ff8e3fa191fcdccf3e2a46ae7f702e";
  const data = await fetch(url);
  const jsonData = await data.json();

  var status = "ok";
  var format = commaNumber.bindWith(",", ".");

  console.log(jsonData);

  //cannot find price data
  if (jsonData.length == 0) {
    status = "cannot find price data for " + ticker;
  }
  //price data successfully retreived
  else {
    var priceData = {};
    priceData.currentPrice = jsonData[0].price;
    priceData.currentPrice = priceData.currentPrice.toFixed(2);
    priceData.currentPrice = format(priceData.currentPrice);
    priceData.change = jsonData[0].change;
    priceData.percentChange = jsonData[0].changesPercentage;
    priceData.marketCap = jsonData[0].marketCap;
    priceData.marketCap = format(jsonData[0].marketCap);

    var time = timestamp.toDate(jsonData[0].timestamp);

    priceData.time = time;
  }

  return [status, priceData];
}

//uses FPM api to get company profile on any symbol
async function getCompanyProfile(ticker) {
  const url =
    "https://financialmodelingprep.com/api/v3/profile/" +
    ticker +
    "?apikey=16ff8e3fa191fcdccf3e2a46ae7f702e";
  const data = await fetch(url);
  const jsonData = await data.json();

  var format = commaNumber.bindWith(",", ".");

  var status = "ok";
  var company = {};
  if (jsonData.length == 0) {
    console.log("THERE IS NO COMPANY DATA");
  } else {
    company.symbol = jsonData[0].symbol;
    company.name = jsonData[0].companyName;
    company.exchange = jsonData[0].exchangeShortName;
    company.industry = jsonData[0].industry;
    company.numOfEmployees = format(jsonData[0].fullTimeEmployees);
    company.ceo = jsonData[0].ceo;
    company.description = jsonData[0].description;
    company.url = jsonData[0].website;
    company.sector = jsonData[0].sector;
  }

  return [status, company];
}

//gets realted stocks from NASDAQ
async function getRelatedStocks(sector, currentStock) {
  const data = await fetch(
    "https://financialmodelingprep.com/api/v3/stock-screener?sector=" +
      sector +
      "&exchange=NASDAQ&limit=100&apikey=16ff8e3fa191fcdccf3e2a46ae7f702e"
  );
  const jsonData = await data.json();

  var status = "ok";
  var dJson, dJson2;

  if (jsonData.length == 0) {
  } else if (jsonData.length < 8) {
  } else {
    var relatedStocksArray = [];
    //async for loop
    //generates random order of related stocks
    //sends back array of objs
    asyncLoop.eachOf(jsonData, (obj, index) => {
      if (obj.symbol == currentStock) {
      } else {
        var result = {};
        result.symbol = obj.symbol;
        result.name = obj.companyName;
        relatedStocksArray.push(result);
        result = {};
      }
    });

    relatedStocksArray = shuffle(relatedStocksArray); //randomizes related stocks
    relatedStocksArray.length = 6;

    var u = "";
    //construct url for batch request (XXX,XXXX,XXX,XX,XXXX)
    asyncLoop.eachOf(relatedStocksArray, (obj, index) => {
      u += obj.symbol;
      u += ",";
    });
    u = u.slice(0, -1); //removes last comma

    //gets all price data for each related stock
    const d = await fetch(
      "https://financialmodelingprep.com/api/v3/quote/" +
        u +
        "?apikey=16ff8e3fa191fcdccf3e2a46ae7f702e"
    );
    dJson = await d.json();

    //grab company profile for each related company to display
    //tag all symbols in API
    const d2 = await fetch(
      "https://financialmodelingprep.com/api/v3/profile/" +
        u +
        "?apikey=16ff8e3fa191fcdccf3e2a46ae7f702e"
    );
    dJson2 = await d2.json(); //each company profile (website and img data)

    var logoLinks = [];
    asyncLoop.eachOf(dJson2, (obj, index) => {
      logoLinks.push(obj.image);
    });
  }
  return [status, relatedStocksArray, dJson, logoLinks, dJson2];
}

//gets 30 day chart from company
async function getChartData(ticker) {
  const url =
    "https://fmpcloud.io/api/v3/historical-price-full/" +
    ticker +
    "?timeseries=30&apikey=16ff8e3fa191fcdccf3e2a46ae7f702e";

  const data = await fetch(url);
  const jsonData = await data.json();

  var status = "ok";
  if (data.length == 0) {
    status = "error: cannot get date data for chart";
  }

  return [status, jsonData];
}

//gets recent news for company
async function getNews(ticker) {
  const url =
    "https://fmpcloud.io/api/v3/stock_news?tickers=" +
    ticker +
    "&limit=6&apikey=16ff8e3fa191fcdccf3e2a46ae7f702e";
  const data = await fetch(url);
  const jsonData = await data.json();

  asyncLoop.eachOf(jsonData, (obj, index) => {
    var x = obj.publishedDate.split(" ");
    x = x[0].split("-");
    x = x[1] + "-" + x[2] + "-" + x[0];
    obj.publishedDate = x;
  });

  var status = "ok";

  return [status, jsonData];
}

//TICKER PAGES (IMPORTANT)
router.get("/:t", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.

  var searchQuery = req.params.t;

  //START OF ALL API CALLS
  getTickerSearch(searchQuery)
    .then((searchData) => {
      //no stocks were found
      if (searchData[0] != "ok") {
        res.status(404);
        res.send("error: stock not found");
      }
      //search results received
      else {
        getPriceData(searchData[1])
          .then((priceData) => {
            //could not get price data
            if (priceData[0] != "ok") {
              res.status(404);
              res.send("error: could not get price data at this time");
            }
            //price data successfully retreived
            else {
              getCompanyProfile(searchData[1])
                .then((companyProfileData) => {
                  //could not get company profile data
                  if (companyProfileData[0] != "ok") {
                    res.status(404);
                    res.send("could not get company profile at this time");
                  }
                  //successfully retreived company profile data
                  else {
                    getRelatedStocks(
                      companyProfileData[1].sector,
                      companyProfileData[1].symbol
                    ).then((relatedStockData) => {
                      getChartData(searchData[1])
                        .then((chartData) => {
                          if (chartData[0] != "ok") {
                            res.status(404);
                            res.send("could not get chart data at this time");
                          } else {
                            getNews(searchData[1]).then((newsData) => {
                              console.log(
                                "\n-- BUNDLED DATA BEING SENT TO USER --"
                              );
                              console.log("SEARCH DATA");
                              console.log(searchData);
                              console.log("PRICE DATA");
                              console.log(priceData);
                              console.log("COMPANY PROFILE");
                              console.log(companyProfileData);
                              console.log("RELATED STOCK DATA");
                              console.log(relatedStockData[1]);
                              console.log("CHART DATA");
                              console.log(chartData);
                              console.log(newsData[1].length);
                              console.log("NEWS DATA");
                              console.log(newsData);

                              //makes sure can link works, some companies dont have companyProfileData
                              var c; //can link
                              var a = null; //alert message
                              if (companyProfileData[1].symbol == undefined) {
                                res.status(404);
                                res.send(
                                  'This ticker has insufficient data at this time. <a href="/">home</a>'
                                );
                              } else {
                                c =
                                  "https://simplestockchart.com/" +
                                  companyProfileData[1].symbol.toLowerCase();
                                res.render("tickerPage", {
                                  tickerPage: true,
                                  title:
                                    companyProfileData[1].name +
                                    " (" +
                                    companyProfileData[1].symbol +
                                    ") Stock Price and Chart",
                                  description:
                                    "Discover " +
                                    companyProfileData[1].name +
                                    " (" +
                                    companyProfileData[1].symbol +
                                    ") Stock Price along with 30 day chart",
                                  stockPriceData: priceData,
                                  companyProfile: companyProfileData,
                                  chartData: chartData[1].historical,
                                  relatedStockData: relatedStockData[2],
                                  canLink: c,
                                  news: newsData,
                                  alert: a,
                                  logoLinks: relatedStockData[3],
                                  homePage: false,
                                });
                              }
                            });
                          }
                        })
                        .catch((err) => {
                          if (err) {
                            res.status(404);
                            res.send("error: cannot get chart data ");
                          }
                        });
                    });
                  }
                })
                .catch((err) => {
                  if (err) {
                    res.status(404);
                    res.send("error: cannot get company profile");
                  }
                });
            }
          })
          .catch((err) => {
            if (err) {
              res.status(404);
              res.send("error: cannot grab price data");
            }
          });
      }
    })
    .catch((err) => {
      if (err) {
        res.status(404);
        res.send("error: cannot grab search data");
      }
    });
});

module.exports = router;
