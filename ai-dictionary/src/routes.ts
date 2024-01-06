import path from "path";
import express from "express";
import {
  FetchOtherWords,
  FetchWordData,
  GenerateBrowseList,
  GenerateExampleSentences,
  GenerateNewWord,
  GenerateSitemap,
  GenerateSynonymsAndAntonyms,
  GenerateWordDefinition,
  GenerateWordHistory,
  GetRecentlyAddedWords,
  GetReferenceLinks,
  SaveWordToDb,
  wordsCollection,
} from "./functions";
import { BrowseList, Word } from "./types";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "..", "index.html"));
});

router.get("/word", async (req, res) => {
  const n: number = (await wordsCollection.find().toArray()).length;
  const r: Word[] | null = await GetRecentlyAddedWords();
  const l: BrowseList[] | null = await GenerateBrowseList();
  res.render("wordExplore", {
    title: "Explore Words",
    numOfWords: n,
    recentlyAddedWords: r,
    browseList: l,
    wordExploreHeadTag: true,
  });
});

router.get("/word/:_WORD", async (req, res) => {
  const w: Word | null = await FetchWordData(req.params._WORD);
  if (w !== null) {
    const ow: string[] | null = await FetchOtherWords(
      req.params._WORD.slice(0, 1),
      req.params._WORD
    );

    res.status(200).render("wordPage", {
      title: `${
        w.name.charAt(0).toUpperCase() + w.name.slice(1)
      } - Definition, Synonyms, Antonyms,
      and Examples`,
      word: w,
      wordPageHeadTag: true,
      otherWords: ow,
    });
  } else {
    res
      .status(404)
      .send(`Could not find definition for the word ${req.params._WORD}`);
  }
});

router.get("/sitemap.xml", async (req, res) => {
  const x: string | null = await GenerateSitemap();
  if (x !== null) {
    res.set("Content-Type", "text/xml");
    res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://botbook.dev</loc>
    </url>
    <url>
      <loc>https://botbook.dev/word</loc>
    </url>
    ${x}
    </urlset>`);
  } else {
    res.status(500).send("Error while generating sitemap");
  }
});

router.get("/api/generate-definition", async (req, res) => {
  if (
    req.headers.generation_key !== undefined &&
    req.headers.generation_key === process.env.GENERATION_KEY
  ) {
    /* 
        Make sure database does not already store all
        words that exists from api (178186 words)
      */
    const allWords = await wordsCollection.find().toArray();
    if (allWords.length === 178186) {
      res.status(500).json({ msg: "All words have already been generated" });
    } else {
      /* 
          Keep attempting to generate words until
          there are no errors thrown (word has a definition)
          There is a set number of attempts for this to
          work as there will be a timeout if not
          able to find word to use amongst thousands of 
          words to filter through
          loop until word is found that has not been defined
      */
      let attempts: number = 0;
      while (attempts !== 25) {
        //1. generate word to be defined
        const word = await GenerateNewWord();
        if (word !== null) {
          //2. see if this word has a definition
          const definition = await GenerateWordDefinition(word);
          if (definition !== null) {
            //3. generate exmaple sentences using the word
            const exampleSentences = await GenerateExampleSentences(word);
            if (exampleSentences !== null) {
              //4. generate history and use of the word
              const history = await GenerateWordHistory(word); //this is allowed to be null
              //5. generate syn and anto
              const synAndAnto = await GenerateSynonymsAndAntonyms(word);
              if (synAndAnto !== null) {
                //6. generate reference links
                const links: string[] | null = await GetReferenceLinks(word);
                if (links !== null) {
                  //7. save data to database
                  const savedWord = await SaveWordToDb(
                    word,
                    definition,
                    exampleSentences,
                    history,
                    synAndAnto,
                    links
                  );

                  if (savedWord !== null) {
                    console.log("\nsuccessfully generated word " + word);
                    res.status(200).json({
                      msg: "successfully saved new word to database",
                    });
                    break;
                  } else {
                    console.log(
                      "error while saving word to database\nattempting to generate save word again word...."
                    );
                    attempts++;
                  }
                } else {
                  console.log(
                    "error while generating refernce links\nattempting to generate links again...."
                  );
                  attempts++;
                }
              } else {
                console.log(
                  "error while generating syn and anto for word\nattempting to generate new syn and anto...."
                );
                attempts++;
              }
            } else {
              console.log(
                "error while generating examples for word\nattempting to generate new examples...."
              );
              attempts++;
            }
          } else {
            console.log(
              "error while generating definition for word\nattempting to generate new definition...."
            );
            attempts++;
          }
        } else {
          console.log(
            "error while generating new word\nattempting to generate new word...."
          );
          attempts++;
        }
      }
      if (attempts === 25) {
        res.status(500).json({
          msg: "The server was not able to generate word within 25 attempts",
        });
      }
    }
  } else {
    res.status(401).json({ msg: "Unauthorized access" });
  }
});

export default router;
