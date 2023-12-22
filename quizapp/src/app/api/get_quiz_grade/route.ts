import pool from "@/DB";
import { _RESPONSE_get_quiz_grade, _gradedQuiz } from "@/types";
import { NextResponse } from "next/server";

//returns score and answers given for any quiz submission
export async function POST(request: Request) {
  try {
    const body = JSON.parse(await new Response(request.body).text());

    const gradeData = await pool.query(
      `select answers_given, score from ${process.env.GRADED_QUIZS_TABLE} where graded_id = '${body.grade_id}';`
    );

    const x: _RESPONSE_get_quiz_grade = {
      score: gradeData.rows[0].score,
      answers: gradeData.rows[0].answers_given,
    };

    return NextResponse.json(x);
  } catch (e) {
    console.log(e);
    console.log("could not get quiz grade with current post request");
    return NextResponse.json({ msg: "Error oke!" });
  }
}
