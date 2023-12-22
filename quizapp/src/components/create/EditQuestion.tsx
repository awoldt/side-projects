import { validateQuestionAdded } from "@/clientFunctions";
import { _question } from "@/types";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

const letterChoices = ["A", "B", "C", "D"];

export default function EditDiv({
  questionTitle,
  questionPrompts,
  correctAnswer,
  setQuestionTitle,
  setPrompts,
  setCorrectAnswer,
  setQuestions,
  setEditQuestion,
  questions,
  indexToReplace,
}: {
  questionTitle: string;
  questionPrompts: (string | null)[];
  correctAnswer: number;
  setQuestionTitle: Dispatch<SetStateAction<string>>;
  setPrompts: Dispatch<SetStateAction<(string | null)[]>>;
  setCorrectAnswer: Dispatch<SetStateAction<number | null>>;
  setQuestions: Dispatch<SetStateAction<_question[]>>;
  setEditQuestion: Dispatch<SetStateAction<number | null>>;
  questions: _question[];
  indexToReplace: number;
}) {
  const questionTitleRef = useRef<HTMLInputElement>(null);
  const newQuestionPrompt1 = useRef<HTMLInputElement>(null);
  const newQuestionPrompt2 = useRef<HTMLInputElement>(null);
  const newQuestionPrompt3 = useRef<HTMLInputElement>(null);
  const newQuestionPrompt4 = useRef<HTMLInputElement>(null);

  useEffect(() => {
    questionTitleRef.current!.value = questionTitle;
    newQuestionPrompt1.current!.value = questionPrompts[0]!;
    newQuestionPrompt2.current!.value = questionPrompts[1]!;
    newQuestionPrompt3.current!.value = questionPrompts[2]!;
    newQuestionPrompt4.current!.value = questionPrompts[3]!;
  }, []);

  return (
    <>
      <hr></hr>
      <span style={{ color: "red" }}>
        Editing question {indexToReplace + 1}
      </span>
      <div>
        {" "}
        <input
          ref={questionTitleRef}
          type="text"
          onChange={(e) => {
            setQuestionTitle(e.target.value);
          }}
          maxLength={150}
          className="mb-4"
          id="question_title_input"
        />
      </div>

      <div>
        {" "}
        <input
          maxLength={250}
          className="question-answer-input"
          ref={newQuestionPrompt1}
          onBlur={(e) => {
            if (e.target.value === "") {
              const x = [...questionPrompts];
              x[0] = null;
              setPrompts(x);
            } else {
              const x = [...questionPrompts];
              x[0] = e.target.value;
              setPrompts(x);
            }
          }}
        />
      </div>

      <div>
        <input
          ref={newQuestionPrompt2}
          maxLength={250}
          className="question-answer-input"
          onBlur={(e) => {
            if (e.target.value === "") {
              const x = [...questionPrompts];
              x[1] = null;
              setPrompts(x);
            } else {
              const x = [...questionPrompts];
              x[1] = e.target.value;
              setPrompts(x);
            }
          }}
        />{" "}
      </div>
      <div>
        <input
          ref={newQuestionPrompt3}
          maxLength={250}
          onBlur={(e) => {
            if (e.target.value === "") {
              const x = [...questionPrompts];
              x[2] = null;
              setPrompts(x);
            } else {
              const x = [...questionPrompts];
              x[2] = e.target.value;
              setPrompts(x);
            }
          }}
          className="question-answer-input"
        />{" "}
      </div>
      <div>
        <input
          ref={newQuestionPrompt4}
          maxLength={250}
          onBlur={(e) => {
            if (e.target.value === "") {
              const x = [...questionPrompts];
              x[3] = null;
              setPrompts(x);
            } else {
              const x = [...questionPrompts];
              x[3] = e.target.value;
              setPrompts(x);
            }
          }}
          className="question-answer-input"
        />
      </div>

      <div>
        <span> Correct answer: </span>
        {letterChoices.map((x, index: number) => {
          if (correctAnswer === index) {
            return (
              <button
                id="selected_correct_answer"
                className="m-1 btn"
                key={index}
                onClick={() => {
                  if (questionPrompts.length === 4) {
                    setCorrectAnswer(index);
                  }
                }}
              >{`${x}`}</button>
            );
          } else {
            return (
              <button
                className="m-1 btn correct-answer-btn"
                key={index}
                onClick={() => {
                  if (
                    questionPrompts.length === 4 &&
                    questionPrompts[index] !== null
                  ) {
                    setCorrectAnswer(index);
                  }
                }}
              >{`${x}`}</button>
            );
          }
        })}
      </div>
      <button
        className="btn btn-primary"
        style={{ marginRight: "10px" }}
        onClick={() => {
          if (
            validateQuestionAdded(
              questionPrompts[0],
              questionPrompts[1],
              questionPrompts[2],
              questionPrompts[3],
              questionTitle,
              correctAnswer
            ) &&
            correctAnswer !== null
          ) {
            //replace the new edited question at specific index in questions array
            const x = [...questions];
            x[indexToReplace] = {
              question_title: questionTitle,
              prompts: [
                newQuestionPrompt1.current!.value,
                newQuestionPrompt2.current!.value,
                newQuestionPrompt3.current!.value,
                newQuestionPrompt4.current!.value,
              ],
              correct_answer: correctAnswer!,
            };

            setQuestions(x);
            setEditQuestion(null);
            setCorrectAnswer(null);
            setPrompts([]);
          } else {
            alert(
              "Question must have a title, all answer choices filled out, and a correct answer selected before adding"
            );
          }
        }}
      >
        Save edit
      </button>
      <button
        className="btn btn-danger"
        onClick={(e) => {
          setEditQuestion(null);
        }}
      >
        <img src="/icons/trashcan.svg" alt="trash icon" /> Discard edit
      </button>
    </>
  );
}
