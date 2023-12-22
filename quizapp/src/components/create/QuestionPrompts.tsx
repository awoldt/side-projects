import { Dispatch, RefObject, SetStateAction } from "react";

const letterChoices = ["A", "B", "C", "D"];

export default function QuestionPrompts({
  prompts,
  setPrompts,
  setQuestionTitle,
  setCorrectAnswer,
  correctAnswer,
}: {
  prompts: (string | null)[];
  setPrompts: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setQuestionTitle: Dispatch<SetStateAction<string>>;
  setCorrectAnswer: Dispatch<SetStateAction<number | null>>;
  correctAnswer: number | null;
}) {
  return (
    <>
      <div>
        <div>
          {" "}
          <input
            type="text"
            placeholder="Question Title"
            onChange={(e) => {
              setQuestionTitle(e.target.value);
            }}
            maxLength={150}
            className="mb-4"
            id="question_title_input"
          />
        </div>

        <input
          maxLength={250}
          className="question-answer-input"
          placeholder="Choice (A)"
          onBlur={(e) => {
            if (e.target.value === "") {
              const x = [...prompts];
              x[0] = null;
              setPrompts(x);
            } else {
              const x = [...prompts];
              x[0] = e.target.value;
              setPrompts(x);
            }
          }}
        />
      </div>
      <div>
        <input
          maxLength={250}
          className="question-answer-input"
          placeholder="Choice (B)"
          onBlur={(e) => {
            if (e.target.value === "") {
              const x = [...prompts];
              x[1] = null;
              setPrompts(x);
            } else {
              const x = [...prompts];
              x[1] = e.target.value;
              setPrompts(x);
            }
          }}
        />{" "}
      </div>
      <div>
        <input
          maxLength={250}
          onBlur={(e) => {
            if (e.target.value === "") {
              const x = [...prompts];
              x[2] = null;
              setPrompts(x);
            } else {
              const x = [...prompts];
              x[2] = e.target.value;
              setPrompts(x);
            }
          }}
          className="question-answer-input"
          placeholder="Choice (C)"
        />{" "}
      </div>
      <div>
        <input
          maxLength={250}
          onBlur={(e) => {
            if (e.target.value === "") {
              const x = [...prompts];
              x[3] = null;
              setPrompts(x);
            } else {
              const x = [...prompts];
              x[3] = e.target.value;
              setPrompts(x);
            }
          }}
          className="question-answer-input"
          placeholder="Choice (D)"
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
                  if (prompts.length === 4) {
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
                  if (prompts.length === 4 && prompts[index] !== null) {
                    setCorrectAnswer(index);
                  }
                }}
              >{`${x}`}</button>
            );
          }
        })}
      </div>
    </>
  );
}
