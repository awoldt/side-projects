import {
  _LOCALSTORAGE_quizs,
  _RESPONSE_get_quiz_grade,
  _question,
  _quiz,
} from "./types";

export function validateQuestionAdded(
  p1: string | null,
  p2: string | null,
  p3: string | null,
  p4: string | null,
  questionTitle: string,
  answer: number | null
): boolean {
  if (
    p1 !== "" &&
    p1 !== null &&
    p2 !== "" &&
    p2 !== null &&
    p3 !== "" &&
    p3 !== null &&
    p4 !== "" &&
    p4 !== null &&
    questionTitle !== "" &&
    answer !== null
  ) {
    return true;
  } else {
    return false;
  }
}

export async function hasUserCompletedQuiz(
  setInitialLoadings: React.Dispatch<React.SetStateAction<boolean>>,
  quizID: string,
  setFinalScore: React.Dispatch<React.SetStateAction<number | null>>,
  setUserAnswers: React.Dispatch<React.SetStateAction<(number | undefined)[]>>
) {
  const quizHistory = localStorage.getItem("quizs");

  //user has not completed a single quiz
  if (quizHistory === null) {
    setInitialLoadings(false);
  } else {
    const x: _LOCALSTORAGE_quizs = JSON.parse(localStorage.getItem("quizs")!);
    let hasDoneQuiz = false;
    for (let index = 0; index < x.graded_quizs.length; index++) {
      //user has completed current quiz, show score
      if (x.graded_quizs[index].quiz_id === quizID) {
        hasDoneQuiz = true;

        try {
          const data = await fetch("/api/get_quiz_grade", {
            method: "post",
            body: JSON.stringify({
              grade_id: x.graded_quizs[index].grade_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (data.status === 200) {
            const jsonData: _RESPONSE_get_quiz_grade = await data.json();

            setUserAnswers(jsonData.answers);
            setFinalScore(jsonData.score);
            setInitialLoadings(false);
          }
        } catch (e) {
          console.log(e);
          console.log(
            "there was an error fetching your grade for quiz " + quizID
          );
        }
      }
    }
    if (!hasDoneQuiz) {
      console.log(
        "You have not completed this quiz but you have completed others....."
      );
      setInitialLoadings(false);
    }
  }
}

export function scoreQuiz(qAnswers: any, uAnswers: any): number {
  let numCorrect = 0;
  for (let index = 0; index < qAnswers.length; index++) {
    uAnswers[index] === qAnswers[index] ? (numCorrect += 1) : null;
  }

  return Number(((numCorrect / qAnswers.length) * 100).toFixed(2));
}
