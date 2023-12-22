import { validateQuestionAdded } from "@/clientFunctions";
import { _question } from "@/types";
import { Dispatch, SetStateAction } from "react";

export default function AddQuestionBtn({
  prompts,
  questionTitle,
  answer,
  setQuestions,
  setQuestionBeingAdded,
  setAnswer,
  setPrompts,
  setTitle,
}: {
  prompts: (string | null)[];
  questionTitle: string;
  answer: number | null;
  setQuestions: Dispatch<SetStateAction<_question[]>>;
  setQuestionBeingAdded: Dispatch<SetStateAction<boolean>>;
  setAnswer: Dispatch<SetStateAction<number | null>>;
  setPrompts: Dispatch<SetStateAction<(string | null)[]>>;
  setTitle: Dispatch<SetStateAction<string>>;
}) {
  return (
    <button
      style={{ marginRight: "10px" }}
      className="btn btn-primary"
      onClick={() => {
        if (
          validateQuestionAdded(
            prompts[0],
            prompts[1],
            prompts[2],
            prompts[3],
            questionTitle,
            answer
          ) &&
          answer !== null
        ) {
          setQuestions((prev) => [
            ...prev,
            {
              question_title: questionTitle,
              prompts: [prompts[0], prompts[1], prompts[2], prompts[3]],
              correct_answer: answer!,
            },
          ]);
          setQuestionBeingAdded(false);
          setAnswer(null);
          setPrompts([]);
          setTitle("");
        } else {
          alert(
            "Question must have a title, all answer choices filled out, and a correct answer selected before adding"
          );
        }
      }}
    >
      Add
    </button>
  );
}
