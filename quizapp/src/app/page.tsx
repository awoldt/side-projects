import pool from "@/DB";
import { _question, _quiz } from "../types";
export const revalidate = 3600; //revalidates cache every hour

export const metadata = {
  title: "Free Online Quiz Maker",
  description:
    "Create and share quizzes with the others without the hassle of having to create an account. Unlimited quizzes with as many questions as you want. No sign up required.",
};

async function App() {
  const recentQuizzes = await (
    await pool.query(
      `select quiz_id, quiz_title from ${process.env.QUIZS_TABLE} order by created_on desc;`
    )
  ).rows;
  recentQuizzes.length > 5 ? (recentQuizzes.length = 5) : null; //return at most 5 quizzes

  const popularQuizzes = await (
    await pool.query(
      `SELECT q.quiz_id, q.quiz_title
      FROM ${process.env.QUIZS_TABLE} q
      JOIN ${process.env.GRADED_QUIZS_TABLE} gq ON q.quiz_id = gq.quiz_id
      GROUP BY q.quiz_id, q.quiz_title
      ORDER BY COUNT(gq.quiz_id) DESC;`
    )
  ).rows;
  popularQuizzes.length > 5 ? (popularQuizzes.length = 5) : null; //return at most 5 quizzes

  return (
    <div>
      <div id="center_div_homescreen">
        <h1>Create a Quiz in Seconds</h1>
        <p>No account needed. Always free.</p>
        <a href={"/create"}>
          <button className="btn btn-light">📝 Create Quiz</button>
        </a>
      </div>

      <div className="content-container" id="homepage_content_container">
        <p style={{ maxWidth: "1250px" }} className="mx-auto mt-4 mb-5">
          This website is a user-friendly online platform that allows you to
          create and share interactive quizzes. You can craft personalized
          quizzes to challenge your friends and engage with a wider audience for
          free. Whether you&apos;re a teacher, a trivia enthusiast, or simply
          looking for a fun way to connect with others, our platform empowers
          you to design captivating quizzes in minutes.
        </p>

        <div className="row justify-content-center">
          <div className="col-xl-6 app-features-col">
            <p>
              <b>Instant Feedback and Results</b>: We provide immediate feedback
              to participants after they complete a quiz. Users will know all
              the correct answers at the end of each quiz.
            </p>
          </div>
          <div className="col-xl-6 app-features-col">
            <p>
              <b>Easy Sharing and Distribution</b>: Once you have created a quiz
              , sharing it with others is a breeze. Simply copy the link and
              share with the rest of the world.
            </p>
          </div>
          <div className="col-xl-6 app-features-col">
            <p>
              {" "}
              <b>Mobile-Friendly Design</b>: This site is optimized for mobile
              devices, ensuring that quizzes can be taken on smartphones and
              tablets without any loss in functionality or user experience.
            </p>
          </div>
        </div>
        <hr></hr>
        <p style={{ maxWidth: "1250px" }} className="mx-auto mt-5 mb-5">
          Below you can find some quizzes hosted on this platform to try out.
          Make sure that when creating a quiz to select the{" "}
          <i>Allow indexing</i> option to feature your quizzes in onilne search
          as well as across this site.
        </p>
        <div className="container mb-5">
          <div className="homepage-featured-quizzes">
            <div>
              <span>
                <u>Most recent</u>
              </span>
              <div>
                {recentQuizzes.map((x, index: number) => {
                  return (
                    <a
                      href={`/quiz?id=${x.quiz_id}`}
                      key={index}
                      className="homepage-quizzes-links"
                    >
                      {x.quiz_title}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="homepage-featured-quizzes">
            <div>
              <span>
                <u>Most popular</u>
              </span>
            </div>
            <div>
              {popularQuizzes.map((x, index: number) => {
                return (
                  <a
                    href={`/quiz?id=${x.quiz_id}`}
                    key={index}
                    className="homepage-quizzes-links"
                  >
                    {x.quiz_title}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
