/* eslint-disable @next/next/no-img-element */
"use client";
import AddQuestionBtn from "@/components/create/AddQuestionBtn";
import EditDiv from "@/components/create/EditQuestion";
import QuestionPrompts from "@/components/create/QuestionPrompts";
import QuizOptions from "@/components/quiz/QuizOptions";
import { _question, _quiz } from "@/types";
import { useState } from "react";

const letterChoices = ["A", "B", "C", "D"];

export default function Create() {
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [questions, setQuestions] = useState<_question[]>([]);
  const [questionBeingAdded, setQuestionBeingAdded] = useState<boolean>(false); //the skeleton template to create a new question before adding it to questions variable array

  const [questionTitle, setQuestionTitle] = useState<string>("");
  const [questionPrompts, setQuestionPrompts] = useState<(string | null)[]>(
    new Array(4).fill(null)
  );
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);

  const [newQuizCreated, setNewQuizCreated] = useState<boolean>(false);
  const [newQuizId, setNewQuizId] = useState<number | null>(null);

  const [creatingNewQuizLoading, setCreatingNewQuizLoading] =
    useState<boolean>(false);

  const [alertMessage, setAlertMessage] = useState<
    [("error" | "success") | null, string | null]
  >([null, null]); //[status, msg]

  const [showQuestionEdit, setShowQuestionEdit] = useState<number | null>(null); //number represents the index of the questions array that is being edited
  const [allowSearchIndexing, setAllowSearchIndexing] = useState<boolean>(true); //allow users quiz to be featured in search results, default true
  return (
    <>
      {newQuizCreated && (
        <>
          <div className="alert alert-success mt-3">{alertMessage[1]}</div>
          <ul>
            <li>
              <b>Quiz id</b>: {newQuizId}
            </li>
            <li>
              <b>Quiz title</b>: {quizTitle}
            </li>
            <li>
              <b>Number of questions</b>: {questions.length}
            </li>
          </ul>
          <p>
            <strong>Be sure to copy this link: </strong>{" "}
            <a href={`/quiz?id=${newQuizId}`}>QUIZ</a>
          </p>
        </>
      )}
      {!newQuizCreated && (
        <>
          <h1>Create a quiz</h1>
          <span>Constraints:</span>
          <ul>
            <li>
              <p>
                Quiz and question titles along with all other text submitted
                must not contain profranity
              </p>
            </li>
            <li>
              <p>
                Each question added must contain values for all answer choices
                (A,B,C,D)
              </p>
            </li>
            <li>
              <p>Quiz must have at least one question</p>
            </li>
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <hr></hr>
            {alertMessage[0] === "error" && (
              <div className="alert alert-danger">{alertMessage[1]}</div>
            )}
            <div>
              <input
                onChange={(e) => {
                  setQuizTitle(e.target.value);
                }}
                type="text"
                placeholder="Quiz Title"
                id="quiz_title_input"
                maxLength={150}
              />
            </div>

            <div>
              {questionBeingAdded && (
                <div className="question-being-added">
                  <div className="mb-3">
                    <div className="mb-3 mt-3">
                      <QuestionPrompts
                        prompts={questionPrompts}
                        setPrompts={setQuestionPrompts}
                        setQuestionTitle={setQuestionTitle}
                        setCorrectAnswer={setCorrectAnswer}
                        correctAnswer={correctAnswer}
                      />
                    </div>
                  </div>
                  <AddQuestionBtn
                    prompts={questionPrompts}
                    questionTitle={questionTitle}
                    answer={correctAnswer!}
                    setQuestions={setQuestions}
                    setQuestionBeingAdded={setQuestionBeingAdded}
                    setAnswer={setCorrectAnswer}
                    setPrompts={setQuestionPrompts}
                    setTitle={setQuestionTitle}
                  />
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setQuestionTitle("");
                      setQuestionPrompts([]);
                      setQuestionBeingAdded(false);
                      setCorrectAnswer(null);
                    }}
                  >
                    <img src="/icons/trashcan.svg" alt="trash icon" />
                    Discard
                  </button>

                  {questionTitle !== "" && (
                    <>
                      <hr></hr>
                      <p className="question-title">{questionTitle}</p>
                      {questionPrompts.length !== 0 && (
                        <>
                          {questionPrompts.map((x, index: number) => {
                            if (x === null) {
                              return (
                                <p key={index}>
                                  <i>You must enter a prompt</i>
                                </p>
                              );
                            } else {
                              return (
                                <p key={index}>
                                  {`${letterChoices[index]}. ${x}`}{" "}
                                  {correctAnswer === index && (
                                    <>
                                      <img src="/icons/check.svg" />{" "}
                                      <span>Correct Answer</span>
                                    </>
                                  )}
                                </p>
                              );
                            }
                          })}
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {questions.length > 0 && (
              <>
                {questions.map((x: _question, index: number) => {
                  {
                    //show the editQuestion component
                  }
                  if (index === showQuestionEdit) {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <EditDiv
                        questionTitle={questionTitle}
                        questionPrompts={questions[index].prompts!}
                        correctAnswer={correctAnswer!}
                        setQuestionTitle={setQuestionTitle}
                        setPrompts={setQuestionPrompts}
                        setCorrectAnswer={setCorrectAnswer}
                        setQuestions={setQuestions}
                        setEditQuestion={setShowQuestionEdit}
                        questions={questions}
                        indexToReplace={index}
                      />
                    );
                  } else {
                    {
                      //render the normal question div
                    }
                    return (
                      <div key={index}>
                        <span>Question {index + 1}</span>{" "}
                        <span
                          className="edit-question-span"
                          onClick={() => {
                            setShowQuestionEdit(index);
                            setQuestionTitle(questions[index].question_title); //need to set question title again so EditDiv component use prop passed down
                          }}
                        >
                          <img src="/icons/pencil-fill.svg" />
                          Edit
                        </span>{" "}
                        <span
                          className="delete-question-span"
                          onClick={() => {
                            const x = [...questions];
                            x.splice(index, 1);
                            setQuestions(x);
                          }}
                        >
                          <img src="/icons/trash.svg" />
                          Delete
                        </span>
                        <h2>{x.question_title}</h2>
                        {x.prompts.map((y: string | null, index2: number) => {
                          if (x.correct_answer === index2) {
                            return (
                              <p key={index2} className="correct-answer-div">
                                {letterChoices[index2] + ". "}
                                {y}
                              </p>
                            );
                          } else {
                            return (
                              <p key={index2}>
                                {letterChoices[index2] + ". "}
                                {y}
                              </p>
                            );
                          }
                        })}
                      </div>
                    );
                  }
                })}
              </>
            )}
            {!questionBeingAdded &&
              questions.length >= 1 &&
              showQuestionEdit === null &&
              !creatingNewQuizLoading && (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setQuestionBeingAdded(true);
                    }}
                  >
                    <img src="/icons/plus.svg" /> Add another question
                  </button>
                  <QuizOptions
                    allowIndex={allowSearchIndexing}
                    setAllowIndex={setAllowSearchIndexing}
                  />
                </>
              )}

            {!questionBeingAdded && questions.length === 0 && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (quizTitle !== "") {
                    setQuestionBeingAdded(true);
                  } else {
                    alert(
                      "Must create a title for the quiz before adding questions"
                    );
                  }
                }}
              >
                <img src="/icons/plus.svg" /> Add first question
              </button>
            )}

            {questions.length !== 0 && (
              <>
                {creatingNewQuizLoading && (
                  <div
                    className="spinner-border text-danger"
                    role="status"
                  ></div>
                )}
                {!creatingNewQuizLoading &&
                  showQuestionEdit === null &&
                  !questionBeingAdded && (
                    <>
                      <hr></hr>

                      <button
                        type="submit"
                        className="btn btn-danger"
                        onClick={async () => {
                          if (questions.length !== 0 && quizTitle !== "") {
                            if (alertMessage[0] !== null) {
                              setAlertMessage([null, null]);
                            }
                            setCreatingNewQuizLoading(true);

                            const data = await fetch("/api/create_quiz", {
                              method: "post",
                              body: JSON.stringify({
                                quiz_title: quizTitle,
                                questions: questions,
                                allowIndex: allowSearchIndexing
                              }),
                              headers: {
                                "Content-Type": "application/json",
                              },
                            });
                            const json = await data.json();

                            if (data.status === 200) {
                              if (json.status === 200) {
                                setNewQuizCreated(true);
                                setNewQuizId(json.newQuizData);
                                setAlertMessage(["success", json.msg]);
                              } else {
                                setAlertMessage(["error", json.msg]);
                              }
                            }
                            setCreatingNewQuizLoading(false);
                          } else {
                            alert("Missing data for quiz");
                          }
                        }}
                      >
                        Create Quiz
                      </button>
                    </>
                  )}
              </>
            )}
          </form>
        </>
      )}
    </>
  );
}
