const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const checkWord = require("check-word");
var cors = require("cors");

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());
app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


//word user has to guess
//every request generates new word
app.get("/word", (req, res) => {
  fs.readFile(path.join(__dirname + "/words.txt"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      res.send("error");
    } else {
      const r = Math.floor(Math.random() * data.split(",").length);

      res.json({ word: data.split(",")[r] });
    }
  });
});

app.post("/is-word", async (req, res) => {
  await fs.readFile(path.join(__dirname + "/word_check.json"), (err, data) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      jsonData = JSON.parse(data);
      if (jsonData.words.indexOf(req.body.word) == -1) {
        res.json({ status: "error", message: "word does not exist" });
      } else {
        res.json({ status: "ok" });
      }
    }
  });
});

app.listen(8080, () => {
  console.log("app running on port 8080");
});
