import { _LOCALSTORAGE_quizs, _RESPONSE_grade, _question } from "@/types";
import React from "react";

const questionLetters = ["A", "B", "C", "D"];

export default function QuestionList({
  uAnswers,
  allQData,
  setScore,
  quizId,
}: {
  uAnswers: [
    (number | undefined)[],
    React.Dispatch<React.SetStateAction<(number | undefined)[]>>
  ];
  allQData: _question[];
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
  quizId: string;
}) {
  return (
    <>
      {allQData.map((q, index: number) => {
        return (
          <div key={index} className="question-list-div">
            <p>
              <b>
                {" "}
                {index + 1}. {q.question_title}
              </b>
            </p>
            {questionLetters.map((x: string, index2: number) => {
              if (index2 === uAnswers[0][index]) {
                return (
                  <div
                    className="selected-answer answer-choice"
                    key={index2}
                    onClick={() => {
                      const x = [...uAnswers[0]];
                      x[index] = index2;
                      uAnswers[1](x);
                    }}
                  >{`${x}. ${q.prompts[index2]}`}</div>
                );
              } else {
                return (
                  <div
                    className="answer-choice"
                    key={index2}
                    onClick={() => {
                      const x = [...uAnswers[0]];
                      x[index] = index2;
                      uAnswers[1](x);
                    }}
                  >{`${x}. ${q.prompts[index2]}`}</div>
                );
              }
            })}
          </div>
        );
      })}
      {
        //show submit btn once all answers have been chosen
      }
      {uAnswers[0].indexOf(undefined) === -1 && (
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              const data = await fetch("/api/grade", {
                method: "post",
                body: JSON.stringify([
                  allQData.map((x) => {
                    return x.correct_answer;
                  }),
                  uAnswers[0],
                  quizId,
                ]),
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (data.status === 200) {
                const jsonData: _RESPONSE_grade = await data.json();

                //first quiz graded
                if (localStorage.getItem("quizs") === null) {
                  const x: _LOCALSTORAGE_quizs = {
                    graded_quizs: [
                      {
                        quiz_id: quizId,
                        grade_id: jsonData.graded_id,
                      },
                    ],
                  };
                  localStorage.setItem("quizs", JSON.stringify(x));
                }
                //append to quizs localstorage string
                else {
                  const x: _LOCALSTORAGE_quizs = JSON.parse(
                    localStorage.getItem("quizs")!
                  );

                  x.graded_quizs.push({
                    quiz_id: quizId,
                    grade_id: jsonData.graded_id,
                  });
                  localStorage.setItem("quizs", JSON.stringify(x));
                }

                setScore(jsonData.score);
              }
            } catch (e) {
              alert("error while grading quiz");
            }
          }}
        >
          Grade quiz
        </button>
      )}
    </>
  );
}
