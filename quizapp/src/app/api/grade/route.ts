import { scoreQuiz } from "@/clientFunctions";
import { saveGradeToDb } from "@/serverFunctions";
import { _RESPONSE_grade, _gradedQuiz } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    //body => [qAnswer, uAnswers, graded_id]
    const body = JSON.parse(await new Response(request.body).text());

    const score = scoreQuiz(body[0], body[1]);
    const newRecord = await saveGradeToDb(score!, body[2], body[1]);

    if (newRecord !== null) {
      const x: _RESPONSE_grade = {
        score: score,
        graded_id: newRecord,
        msg: "Quiz results successfully saved",
      };

      return NextResponse.json(x);
    } else {
      console.log("there was an error while saving graded quiz to databse :(");

      return NextResponse.json(null);
    }
  } catch (e) {
    console.log(e);
    console.log("could not grade quiz");
    return NextResponse.json({ msg: "Error oke!" });
  }
}
