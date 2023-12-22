import pool from "./DB";
import { _PAGEDATA_quiz, _question } from "./types";

export async function filterProfanity(
  quizTitle: string,
  questions: _question[]
): Promise<boolean | null> {
  try {
    const profanityList = await fetch(process.env.PROFANITY_LIST_URL!, {
      method: "get",
      headers: {
        "Content-Type": "text/plain",
      },
    });
    if (profanityList.status === 200) {
      const badWords = (await new Response(profanityList.body).text())
        .split("\n")
        .map((x) => {
          return x.split("\r")[0];
        });

      let CONTAINS_PROFANITY: boolean = false;

      //QUIZ TITLE
      const quizTitleWords = quizTitle.split(" ").map((x) => {
        return x.toLowerCase();
      });

      for (let index = 0; index < quizTitleWords.length; index++) {
        if (badWords.includes(quizTitleWords[index])) {
          CONTAINS_PROFANITY = true;
          break;
        }
      }
      if (CONTAINS_PROFANITY) {
        return true;
      }

      //QUIZ QUESTION TITLES
      const quizQuestionTitles = questions.map((x) => {
        return x.question_title.trim();
      });
      let quizQuestionTitleWords: string[] = [];

      for (let index = 0; index < quizQuestionTitles.length; index++) {
        const titleWords = quizQuestionTitles[index].split(" ").map((x) => {
          return x.toLowerCase();
        });
        for (let index2 = 0; index2 < titleWords.length; index2++) {
          quizQuestionTitleWords.push(titleWords[index2]);
        }
      }

      for (let index = 0; index < quizQuestionTitleWords.length; index++) {
        if (badWords.includes(quizQuestionTitleWords[index])) {
          console.log("profanity in one of quiz question titles");

          CONTAINS_PROFANITY = true;
          break;
        }
      }
      if (CONTAINS_PROFANITY) {
        return true;
      }

      //QUIZ QUESTION PROMPTS
      const quizQuestionPrompts = questions.map((x) => {
        return x.prompts;
      });
      let quizQuestionPromptWords: string[] = [];
      for (let index = 0; index < quizQuestionPrompts.length; index++) {
        const promptWords = String(quizQuestionPrompts[index])
          .trim()
          .split(" ")
          .map((x) => {
            return x.toLowerCase();
          });
        for (let index2 = 0; index2 < promptWords.length; index2++) {
          if (promptWords[index2] !== "") {
            quizQuestionPromptWords.push(promptWords[index2]);
          }
        }
      }

      for (let index = 0; index < quizQuestionPromptWords.length; index++) {
        if (badWords.includes(quizQuestionPromptWords[index])) {
          CONTAINS_PROFANITY = true;
          break;
        }
      }
      if (CONTAINS_PROFANITY) {
        return true;
      }

      return false;
    } else {
      console.log("error while fetching profanity list");

      return null;
    }
  } catch (e) {
    console.log(e);
    console.log("error while filtering profanity");
    return null;
  }
}

export default async function createQuiz(
  quizTitle: string,
  quizQuestions: _question[],
  allowIndexing: boolean
) {
  try {
    const newQuiz = await pool.query(
      `insert into ${
        process.env.QUIZS_TABLE
      } (quiz_title, indexable) values ('${quizTitle.trim()}', ${allowIndexing}) returning quiz_id;`
    );

    //creates a string for sql insert query
    const qs = quizQuestions
      .map((x: _question): string => {
        return `('${x.question_title.trim()}', array [${x.prompts.map(
          (y: string | null) => {
            return `'${y!.trim()}'`;
          }
        )}], ${x.correct_answer}, '${newQuiz.rows[0].quiz_id}')`;
      })
      .join(",");

    await pool.query(
      `insert into ${process.env.QUESTIONS_TABLE} values ${qs};`
    );
    console.log("new quiz successfully created");
    return newQuiz.rows[0].quiz_id;
  } catch (e) {
    console.log(e);
    console.log("error while creating new quiz");
    return null;
  }
}

export async function saveGradeToDb(
  score: number,
  quizId: string,
  userAnswers: number[]
): Promise<string | null> {
  try {
    console.log("attempting to save grade to db!");

    const query = await pool.query(
      `insert into ${process.env.GRADED_QUIZS_TABLE} (score, quiz_id, answers_given) values (${score}, '${quizId}', array [${userAnswers}]) RETURNING graded_id;`
    );

    console.log("sucessfully stored graded quiz in databse!");

    return query.rows[0].graded_id;
  } catch (e) {
    console.log(e);
    return null;
  }
}

//returns all the data needed to render quiz (/quiz?id=xx)
//1. quiz data
//2. questions data
//3. graded attempts data
export async function getQuizPageData(
  id: string
): Promise<_PAGEDATA_quiz | null> {
  try {
    const quizData = await pool.query(
      `select * from ${process.env.QUIZS_TABLE} where quiz_id = '${id}'`
    );

    //quiz does not exist
    if (quizData.rowCount === 0) {
      console.log("\nQUIZ DOES NOT EXIST");
      return null;
    }
    //quiz exists, fetch other related data
    else {
      const questionsData = await pool.query(
        `select * from ${process.env.QUESTIONS_TABLE} where quiz_id = '${id}'`
      );

      const gradesData = await pool.query(
        `select avg(score) as avg_scores, count(score) as num_of_submissions from ${process.env.GRADED_QUIZS_TABLE} where quiz_id = '${id}';`
      );

      const x: _PAGEDATA_quiz = {
        quiz_id: id,
        quiz_title: quizData.rows[0].quiz_title,
        quiz_created_on: quizData.rows[0].created_on,
        questions: questionsData.rows,
        average_score: Number(gradesData.rows[0].avg_scores),
        num_of_submissions: Number(gradesData.rows[0].num_of_submissions),
        is_quiz_indexable: quizData.rows[0].indexable,
      };
      return x;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}
