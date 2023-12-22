import { _PAGEDATA_quiz, _question } from "@/types";

const letterChoices = ["A", "B", "C", "D"];

export default function QuizResults({
  finalScore,
  quizData,
  questionsData,
  userAnswers,
}: {
  finalScore: number;
  quizData: _PAGEDATA_quiz;
  questionsData: _question[];
  userAnswers: (number | undefined)[];
}) {
  return (
    <>
      <div id="quiz_results_div">
        <h2>Quiz Results</h2>
        <p style={{ fontSize: "50px" }}>
          <b>You scored a {finalScore}%</b>
        </p>
        {quizData.num_of_submissions !== 0 && (
          <>
            <div className="quiz-stats">
              Avg score: <b>{quizData.average_score.toFixed(2)}%</b>
            </div>
            <div className="quiz-stats">
              Number of subimissions: <b>{quizData.num_of_submissions}</b>
            </div>
          </>
        )}
      </div>
      <hr></hr>
      <p>Here are your quiz results</p>

      {questionsData.map((x: _question, index: number) => {
        {
          //got answer correct
        }
        if (userAnswers[index] === x.correct_answer) {
          return (
            <div key={index}>
              <h2 className="quiz-result-question-list">
                {index + 1 + ". "}
                {x.question_title}
              </h2>
              <img src={"/icons/check.svg"} />

              {x.prompts.map((y, index2: number) => {
                if (x.correct_answer === index2) {
                  return (
                    <div key={index2} className="correct-answer">
                      {letterChoices[index2] + ". "}
                      {y}
                    </div>
                  );
                } else {
                  return (
                    <div key={index2}>
                      {letterChoices[index2] + ". "} {y}
                    </div>
                  );
                }
              })}
            </div>
          );
        } else {
          {
            //got answer incorrect
          }
          return (
            <div key={index}>
              <h2 className="quiz-result-question-list">
                {index + 1 + ". "}
                {x.question_title}
              </h2>
              <img src={"/icons/x.svg"} />

              {x.prompts.map((y, index2: number) => {
                if (x.correct_answer === index2) {
                  return (
                    <div key={index2} className="wrong-answer">
                      {letterChoices[index2] + ". "}
                      {y}
                    </div>
                  );
                } else {
                  return (
                    <div key={index2}>
                      {letterChoices[index2] + ". "}
                      {y}
                    </div>
                  );
                }
              })}
            </div>
          );
        }
      })}
    </>
  );
}
