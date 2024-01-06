import { BrowseList, Word } from "./types";
import { MongoClient } from "mongodb";
const DbClient = new MongoClient(process.env.MONGODB_CONNECTION_KEY!);
export const wordsCollection = DbClient.db(process.env.DB).collection<Word>(
  "words"
);

export async function DbConnect() {
  try {
    await DbClient.connect();
    console.log("successfully connected to database!");
  } catch (e) {
    console.log("could not connect to database");
  }
}

export async function GenerateNewWord(): Promise<string | null> {
  /* 
        This function fetches a random word from
        random word api
        will also check to make sure that word is
        not already stored in database
    */
  try {
    const data = await fetch(process.env.RANDOM_WORD_API!);
    if (data.status === 200) {
      const word = await data.json();

      //make sure word is not already stored in database
      const w = await wordsCollection.find({ name: word[0] }).toArray();
      if (w.length === 0) {
        console.log(`the word ${word[0]} has been selected`);
        return word[0];
      } else {
        console.log("the word " + w + " is already stored in database");
        return null;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log("error while generating random word");
    return null;
  }
}

export async function GenerateWordDefinition(
  word: string
): Promise<string | null> {
  try {
    const data = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "Write a short detailed definition for the word " + word,
        max_tokens: 4000,
      }),
    });

    if (data.status === 200) {
      console.log(`generating definition for the word ${word}`);
      //return text with \n remvoed
      const definition = await data.json();

      /* 
      sometimes definitions generated have word with colon
      before the actual definition 
      ex - Distorted: pulled or twisted out of shape
      remove colon if it is present
      */

      if (definition.choices[0].text.split(":").length === 2) {
        return definition.choices[0].text
          .split("\n")
          .filter((x: string) => {
            return x !== "";
          })[0]
          .split(":")[1];
      } else {
        return definition.choices[0].text.split("\n").filter((x: string) => {
          return x !== "";
        })[0];
      }
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function GenerateExampleSentences(
  word: string
): Promise<string[] | null> {
  /* 
    This function will generate 3 random
    example sentences using the word generated
  */
  try {
    const data = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "Write 3 sentences using using the word " + word,
        max_tokens: 4000,
      }),
    });
    if (data.status === 200) {
      console.log(`generating example sentences for the word ${word}`);
      const exampleSentenceData = await data.json();

      //return only the example sentences
      return exampleSentenceData.choices[0].text
        .split("\n")
        .filter((x: string) => {
          return x !== "";
        })
        .map((y: string) => {
          return y.substring(3, y.length);
        });
    } else {
      console.log(
        "error while generating exmaple sentences using the word " + word
      );
      return null;
    }
  } catch (e) {
    console.log(e);
    console.log(
      "error while generating exmaple sentences using the word " + word
    );
    return null;
  }
}

export async function SaveWordToDb(
  w: string,
  def: string,
  exampleSentences: string[],
  historyAndUse: string[] | null,
  synAndAnto: string[][],
  referenceLinks: string[]
): Promise<Word | null> {
  /* 
    This function will save word 
    along with definitions and exmaples to
    mongodb
  */
  try {
    let d = new Date().toISOString();

    const newWord: Word = {
      name: w,
      definition: def,
      examples: exampleSentences,
      synonyms: synAndAnto[0],
      antonyms: synAndAnto[1],
      history: historyAndUse,
      lastUpdated:
        d.substring(0, 10).split("-")[1] +
        "/" +
        d.substring(0, 10).split("-")[2] +
        "/" +
        d.substring(0, 10).split("-")[0],
      createdOn: Date.now(),
      model: process.env.MODEL!,
      referenceLinks,
    };

    await wordsCollection.insertOne(newWord);

    return newWord;
  } catch (e) {
    console.log(e);
    console.log("error while saving word to database");
    return null;
  }
}

export async function GenerateSynonymsAndAntonyms(
  word: string
): Promise<string[][] | null> {
  try {
    const s = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "Write a comma seperated list of synonyms for the word " + word,
        max_tokens: 4000,
      }),
    });
    const a = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "Write a comma seperated list of antonyms for the word " + word,
        max_tokens: 4000,
      }),
    });

    if (s.status === 200 && a.status === 200) {
      console.log(`generating syn and anto for the word ${word}`);
      const sData = await s.json();
      const aData = await a.json();

      return [
        sData.choices[0].text
          .split("\n")
          .filter((x: string) => {
            return x !== "";
          })
          .join("")
          .split(",")

          .sort()
          .map((x: string) => {
            return x.charAt(0).toLowerCase() + x.slice(1);
          }),
        aData.choices[0].text
          .split("\n")
          .filter((x: string) => {
            return x !== "";
          })
          .join("")
          .split(",")

          .sort()
          .map((x: string) => {
            return x.charAt(0).toLowerCase() + x.slice(1);
          }),
      ];
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function FetchWordData(w: string): Promise<Word | null> {
  /* 
    This function will see if word user 
    is accessing through route (/word/[whatever_word])
    exists in database
    it also generates a basic pagination for the two words in the database 
    its next to alphabetically
    ex: ["bat", "cat", "rat"] - when visiting the page for the word cat, 
    the words bat and rat would appear at the bottom as pagination links
  */

  try {
    const x = await wordsCollection.find({ name: w }).toArray();

    //word exists
    if (x.length !== 0) {
      //need to remove _id propery from mongo document (avoid serilization issues)
      const word: any = { ...x[0] };
      delete word._id;

      return word;
    }
    //word does not exist
    else {
      console.log("The word " + w + " does not exist in database");
      return null;
    }
  } catch (e) {
    console.log(e);
    console.log(
      "There was an error while searching for the word " +
        w +
        " in the database"
    );
    return null;
  }
}

export async function GenerateWordHistory(w: string): Promise<string[] | null> {
  /* 
    This function will generate a short description 
    on the history of the current word
  */
  try {
    const data = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: "write about the history and use of the word " + w,
        max_tokens: 4000,
      }),
    });
    if (data.status === 200) {
      console.log(`generating history and use of the word ${w}`);
      const history: any = await data.json();
      return history.choices[0].text.split("\n").filter((x: string) => {
        return x !== "";
      });
    } else {
      console.log("error while generating history and use of the word " + w);
      return null;
    }
  } catch (e) {
    console.log(
      "there was an error while generating the history for the word " + w
    );
    return null;
  }
}

export async function GetRecentlyAddedWords(): Promise<Word[] | null> {
  try {
    const words = (
      await wordsCollection
        .find({}, { projection: { _id: 0 } })
        .limit(6)
        .sort({ _id: -1 })
        .toArray()
    ).map((x: Word) => {
      if (x.definition.length > 200) {
        x.definition = x.definition.slice(0, 200) + "...";
        return x;
      }
      return x;
    });

    return words;
  } catch (e) {
    console.log(e);
    console.log("error, could not get recently added words");
    return null;
  }
}

export async function GenerateSitemap(): Promise<string | null> {
  try {
    //get all words in database
    const words = await wordsCollection.find().sort({ name: 1 }).toArray();

    //make custom xml string
    let xmlStr: string = "";
    for (let index = 0; index < words.length; index++) {
      xmlStr += `<url><loc>https://botbook.dev/word/${words[index].name}</loc></url>`;
    }

    return xmlStr;
  } catch (e) {
    console.log(e);
    console.log("error while generating sitemap");
    return null;
  }
}

export async function GenerateBrowseList(): Promise<BrowseList[] | null> {
  /* 
    This function will return a list of words 
    stored in the database sorted alphabetically
    to be shown for each letter
  */
  try {
    //get all the unique first letters in the array
    const wordsStartingWithCharacter: any = await wordsCollection
      .aggregate([
        {
          $group: {
            _id: { letter: { $substr: ["$name", 0, 1] } },
            words: { $push: "$name" },
          },
        },
        {
          $sort: {
            "_id.letter": 1,
          },
        },
        {
          $set: {
            words: {
              $sortArray: {
                input: "$words",
                sortBy: 1,
              },
            },
          },
        },
      ])
      .toArray();

    return wordsStartingWithCharacter;
  } catch (e) {
    console.log(e);
    console.log("error while trying to generate browse list");
  }
  return null;
}

export async function FetchOtherWords(
  firstChar: String,
  word: String
): Promise<string[] | null> {
  /* 
    This function will return a list of words 
    that start with the same letter as the current
    wordpage being viewed

    The words returned will be the 5 words to the right and 
    5 words to the left of the current word being viewed in the
    array
  */
  try {
    const words: any = (
      await wordsCollection
        .find({ name: { $regex: `^${firstChar}` } })
        .toArray()
    ).map((x: Word) => {
      return x.name;
    });
    const index = words.indexOf(word);
    //grab the 5 words to the left and right of this index
    //now find index where current word being viewed is
    return words
      .slice(index - 5, index)
      .concat(words.slice(index + 1, index + 6));
  } catch (e) {
    console.log(e);
    console.log(
      `error while fetching other words that start with the letter ${firstChar}`
    );
    return null;
  }
}

export async function GetReferenceLinks(
  word: string
): Promise<string[] | null> {
  /* 
    This function will return a list of 
    https links to websites that define the current 
    words, gives user more context
  */

  try {
    const data = await fetch("https://api.openai.com/v1/completions", {
      method: "post",
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AI_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        prompt: `Generate a comma seperated list of https links to websites that define the word ${word}`,
        max_tokens: 4000,
      }),
    });
    if (data.status === 200) {
      console.log(`generating reference links for the word ${word}`);
      const regex = /(https?:\/\/[^ ]*)/;
      const linksResponse = await data.json();
      const httpsLinks = linksResponse.choices[0].text
        .split("\n")
        .filter((x: string) => {
          return x !== "";
        })
        .map((x: string) => {
          return x.match(regex)![1];
        })
        .filter((x: string) => {
          return !x.includes("oxforddictionaries") && !x.includes("lexico");
        });
      //make sure that links returned are all 200 status code
      const successLinks = (
        await Promise.all(
          httpsLinks.map(async (x: string) => {
            try {
              const req = await fetch(x);
              if (req.status === 200) {
                return x;
              } else {
                console.log(`link ${x} is not a valid link`);
                return null;
              }
            } catch (e) {
              return null;
            }
          })
        )
      ).filter((x: string | null) => {
        return x !== null;
      });

      return successLinks.length > 4 ? successLinks.slice(0, 4) : successLinks;
    } else {
      console.log(`could not get links to help define word ${word}`);
      return null;
    }
  } catch (e) {
    console.log(e);
    console.log(
      `There was an error while finding links that help define the word ${word}`
    );
    return null;
  }
}
