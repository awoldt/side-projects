"use client";

import { _LOCALSTORAGE_quizs, _RESPONSE_grade, _question } from "@/types";
import React from "react";

const questionLetters = ["A", "B", "C", "D"];

export default function QuestionCard({
  qData,
  currentQIndex,
  uAnswers,
  allQData,
  setScore,
  quizId,
}: {
  qData: _question;
  currentQIndex: [number, React.Dispatch<React.SetStateAction<number | null>>];
  uAnswers: [
    (number | undefined)[],
    React.Dispatch<React.SetStateAction<(number | undefined)[]>>
  ];
  allQData: _question[];
  setScore: React.Dispatch<React.SetStateAction<number | null>>;
  quizId: string;
}) {
  return (
    <div className="question-div">
      <h2>{qData.question_title}</h2>
      {qData.prompts.map((x: string | null, index: number) => {
        if (index === uAnswers[0][currentQIndex[0]]) {
          return (
            <div
              className="selected-answer prompt-div"
              key={index}
              onClick={() => {
                const x = [...uAnswers[0]];
                x[currentQIndex[0]] = index;
                uAnswers[1](x);
              }}
            >
              {`${questionLetters[index]}. `}
              {x}
            </div>
          );
        } else {
          return (
            <div
              className="prompt-div"
              key={index}
              onClick={() => {
                const x = [...uAnswers[0]];
                x[currentQIndex[0]] = index;
                uAnswers[1](x);
              }}
            >
              {`${questionLetters[index]}. `}
              {x}
            </div>
          );
        }
      })}

      <div className="mt-4">
        {
          //only 1 question
        }
        {allQData.length === 1 && (
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

        {
          //more than 1 question
        }
        {allQData.length > 1 && (
          <>
            {
              //first question
            }
            {currentQIndex[0] === 0 &&
              uAnswers[0][currentQIndex[0]] !== undefined && (
                <button
                  onClick={() => {
                    currentQIndex[1](currentQIndex[0] + 1);
                  }}
                >
                  <img
                    src="/icons/arrow-right-circle.svg"
                    alt="right arrow icon"
                  />
                </button>
              )}

            {
              //any question in between first and last
            }
            {currentQIndex[0] > 0 &&
              currentQIndex[0] < uAnswers[0].length - 1 &&
              uAnswers[0][currentQIndex[0]] !== undefined && (
                <>
                  <button
                    onClick={() => {
                      currentQIndex[1](currentQIndex[0] - 1);
                    }}
                  >
                    <img
                      src="/icons/arrow-left-circle.svg"
                      alt="left arrow icon"
                    />
                  </button>
                  <button
                    onClick={() => {
                      currentQIndex[1](currentQIndex[0] + 1);
                    }}
                  >
                    <img
                      src="/icons/arrow-right-circle.svg"
                      alt="right arrow icon"
                    />
                  </button>
                </>
              )}
            {
              //Last question
            }
            {currentQIndex[0] === uAnswers[0].length - 1 &&
              uAnswers[0][currentQIndex[0]] !== undefined && (
                <>
                  <button
                    onClick={() => {
                      currentQIndex[1](currentQIndex[0] - 1);
                    }}
                  >
                    <img
                      src="/icons/arrow-left-circle.svg"
                      alt="left arrow icon"
                    />
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ marginLeft: "20px" }}
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
                </>
              )}
          </>
        )}
      </div>
    </div>
  );
}
