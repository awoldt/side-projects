const express = require("express");
const app = express();
const path = require("path");
const indexRoute = require("./routes/indexRoute");
const fetchRoutes = require("./routes/fetchRequests");
const topicsRoute = require("./routes/topicsRoute");
const newDiscussionRoute = require("./routes/newDiscussionRoute");
const profileRoute = require("./routes/profileRoute");
const verifyRoute = require("./routes/verifyRoute");
const commentRoute = require("./routes/commentRoute");
const deleteRoute = require("./routes/deleteRoute");

var favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.listen(8080, console.log("app listening on port 8080"));

app.set("view engine", "ejs");

app.use(indexRoute);
app.use(topicsRoute);
app.use(fetchRoutes);
app.use(newDiscussionRoute);
app.use(profileRoute);
app.use(verifyRoute);
app.use(commentRoute);
app.use(deleteRoute);

//sitemap
//sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(__dirname + '/sitemap.xml', (err) => {
      if(err) {
          res.send(err);
      }
  })
})

//robots.txt
app.get('/robots.txt', (req, res) => {
  res.sendFile(__dirname + '/robots.txt', (err) => {
      if(err) {
          res.send(err);
      }
  })
})

//bing search crawler authenticator 
app.get('/BingSiteAuth.xml', (req, res) => {
  res.sendFile(__dirname + '/BingSiteAuth.xml', (err) => {
      if(err) {
          res.send(err);
      }
  })
})

//404 page
//catches all urls requested that dont match any of the routes above
app.use((req, res) => {
  res.status(404);
  res.render("404", {
    title: "page not found",
    cLink: null,
  });
});
