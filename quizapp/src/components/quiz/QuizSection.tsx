"use client";

import {
  _LOCALSTORAGE_quizs,
  _PAGEDATA_quiz,
  _RESPONSE_get_quiz_grade,
  _question,
  _quiz,
} from "@/types";
import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import QuestionList from "./QuestionsList";
import { hasUserCompletedQuiz } from "@/clientFunctions";
import QuizResults from "./QuizResults";

export default function QuizSection({
  questionsData,
  quizId,
  quizData,
}: {
  questionsData: _question[];
  quizId: string;
  quizData: _PAGEDATA_quiz;
}) {
  const [currentView, setCurrentView] = useState<"card" | "list">("list");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | null
  >(0); //keeps track of index of question being answered if view is set to card

  const [userAnswers, setUserAnswers] = useState<(number | undefined)[]>(
    new Array(questionsData.length).fill(undefined)
  );
  const [finalScore, setFinalScore] = useState<number | null>(null); //user has completed quiz if this is not null
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    //will check to see if user has completed current quiz being viewed
    //if yes, send back graded_quiz data for users submission
    hasUserCompletedQuiz(
      setInitialLoading,
      quizId,
      setFinalScore,
      setUserAnswers
    );
  }, []);

  return (
    <>
      {initialLoading && <div className="loader"></div>}
      {!initialLoading && (
        <>
          {finalScore !== null && (
            <QuizResults
              finalScore={finalScore!}
              quizData={quizData}
              questionsData={questionsData}
              userAnswers={userAnswers}
            />
          )}
          {finalScore === null && (
            <div>
              <div className="mb-4">
                <label htmlFor="view_select">Select view:</label>
                <select
                  id="view_select"
                  onChange={(e) => {
                    if (
                      e.target.value === "list" ||
                      e.target.value === "card"
                    ) {
                      setCurrentView(e.target!.value);
                    }
                  }}
                >
                  <option value={"list"}>List</option>
                  <option value={"card"}>Card</option>
                </select>
              </div>

              {currentView === "list" && (
                <QuestionList
                  uAnswers={[userAnswers, setUserAnswers]}
                  allQData={questionsData}
                  setScore={setFinalScore}
                  quizId={quizId}
                />
              )}
              {currentView === "card" && (
                <QuestionCard
                  qData={questionsData[currentQuestionIndex!]}
                  currentQIndex={[
                    currentQuestionIndex!,
                    setCurrentQuestionIndex,
                  ]}
                  uAnswers={[userAnswers, setUserAnswers]}
                  allQData={questionsData}
                  setScore={setFinalScore}
                  quizId={quizId}
                />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
