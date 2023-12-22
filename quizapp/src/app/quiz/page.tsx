import QuizSection from "@/components/quiz/QuizSection";
import { _PAGEDATA_quiz, _question, _quiz } from "@/types";
import { notFound } from "next/navigation";
import { getQuizPageData } from "@/serverFunctions";
import { validate } from "uuid";
import pool from "@/DB";

export async function generateMetadata({ searchParams }: any) {
  //not a valid id query
  if (!validate(searchParams.id)) {
    return {
      title: "Error | invalid id query",
    };
  }

  const quizData = await pool.query(
    `select quiz_title from ${process.env.QUIZS_TABLE} where quiz_id = '${searchParams.id}';`
  );

  //quiz does not exist
  if (quizData.rowCount === 0) {
    return {
      title: "Quiz does not exist :(",
    };
  }

  return {
    title: quizData.rows[0].quiz_title,
  };
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

export default async function QuizPage({
  searchParams,
}: {
  searchParams: any;
}) {
  //not valid uuid
  if (!validate(searchParams.id)) {
    return (
      <>
        <p>Not a valid id query</p>
      </>
    );
  } else {
    const quizData = await getQuizPageData(searchParams.id);

    if (quizData === null) {
      return notFound();
    } else {
      return (
        <>
          <h1>{quizData.quiz_title}</h1>
          <p>Quiz was created on {String(quizData.quiz_created_on)}</p>

          <hr></hr>
          <QuizSection
            questionsData={quizData.questions}
            quizId={quizData.quiz_id}
            quizData={quizData}
          />
        </>
      );
    }
  }
}
