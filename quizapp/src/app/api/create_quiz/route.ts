import createQuiz, { filterProfanity } from "@/serverFunctions";
import { _RESPONSE_create_quiz, _question } from "@/types";
import { NextResponse } from "next/server";

interface data {
  status: number;
  msg: string;
  newQuizData?: _RESPONSE_create_quiz;
}

//creates new quiz
//saves to database
export async function POST(request: Request) {
  try {
    const req = JSON.parse(await new Response(request.body).text());
    const profanityResults = await filterProfanity(
      req.quiz_title.trim(),
      req.questions
    );

    //check for profanity in quiz data
    if (profanityResults || profanityResults === null) {
      const returnData: data = {
        status: 400,
        msg: "Remove profanity before submitting quiz",
      };
      return NextResponse.json(returnData);
    } else {
      const newQuiz = await createQuiz(
        req.quiz_title,
        req.questions,
        req.allowIndex
      );

      //500
      if (newQuiz === null) {
        const returnData: data = {
          status: 500,
          msg: "There was an error while processing the request",
        };

        return NextResponse.json(returnData);
      }
      //200
      else {
        const returnData: data = {
          status: 200,
          msg: "Quiz successfully created",
          newQuizData: newQuiz,
        };

        return NextResponse.json(returnData);
      }
    }
  } catch (e) {
    console.log(e);
    console.log("could not save quiz");

    return NextResponse.json({
      status: 500,
      msg: "Error while creating quiz :(",
    });
  }
}
