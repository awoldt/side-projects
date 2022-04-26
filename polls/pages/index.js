import { Container } from "react-bootstrap";
import Poll from "../model/poll";
import databaseConnect, { state } from "../scripts/databaseConnect";

export default function Home({ num_of_polls, poll_data }) {
  if (num_of_polls !== 0) {
    return (
      <Container className="p-3">
        <h1 className="text-center">
          Create a variety of polls and answer them anonymously
        </h1>

        <p>There are currently {num_of_polls} polls created</p>
        <br></br>
        <a href={"/new"}>New poll</a>
        <br></br>
        <br></br>
        <a href={"/p"}>All polls</a>
      </Container>
    );
  } else {
    return <p>no polls:(</p>;
  }
}

export async function getServerSideProps() {
  console.log("\nGET /");

  if (state !== 1) {
    await databaseConnect();
  }

  //get number of polls already created
  var polls = await Poll.find({}).sort({ createdAt: -1 });
  const numOfPolls = polls.length;

  if (numOfPolls > 10) {
    polls.length = 10; //makes sure not too much data is sent to client
  }

  polls = await JSON.parse(JSON.stringify(polls));

  return {
    props: {
      poll_data: polls,
      num_of_polls: numOfPolls,
    },
  };
}
