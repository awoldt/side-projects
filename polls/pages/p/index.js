import React from "react";
import { Container, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import Poll from "../../model/poll";
import databaseConnect, { state } from "../../scripts/databaseConnect";
import Head from "next/head";

const Index = ({ poll_data, page_title }) => {
  const [n, setN] = useState(false);
  const [filterTag, setFilterTag] = useState("all"); //defaults to any tags
  const [polls, setPolls] = useState(poll_data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPollByTag() {
      //only run after the first time user changes tag
      if (n == true) {
        const data = await axios.post("/api/poll-data", {
          action: "filter_polls",
          tag: filterTag,
        });
        setPolls(data.data.poll_data);
        setLoading(false);
      }
    }

    getPollByTag();
  }, [filterTag]);

  return (
    <>
      <Head>
        <title>{page_title}</title>
      </Head>
      <Container>
        <h1>Discover polls</h1>
        <p>filter</p>
        <select
          onChange={(e) => {
            setLoading(true);
            setFilterTag(e.target.value);
            setN(true);
          }}
        >
          <option defaultValue value="all">
            All
          </option>
          <option value="entertainment">Entertainment</option>
          <option value="politics">Politics</option>
          <option value="gaming">Gaming</option>
        </select>

        <br></br>
        <br></br>

        <div>
          {loading && <Spinner animation="border" variant="primary" />}
          {loading === false &&
            polls.map((x, index) => {
              return (
                <>
                  <a href={"/p/" + x._id}>{x.title}</a>{" "}
                  {x.private && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-lock-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                    </svg>
                  )}
                  <br></br>
                </>
              );
            })}
          {polls.length === 0 && (
            <p style={{ color: "red" }}>There are no polls to display</p>
          )}
        </div>
      </Container>
    </>
  );
};

export default Index;

export async function getServerSideProps({ query }) {
  if (state !== 1) {
    await databaseConnect();
  }

  console.log("\nGET /p\n");

  //there is no filter query, load regular page
  if (query.tag === undefined) {
    var title = "Discover polls";
    try {
      var p = await Poll.find({}).sort({ createdAt: -1 });
      if (p.length > 10) {
        p.length = 10; //makes sure not too much data is sent to client
      }
      p = await JSON.parse(JSON.stringify(p));
    } catch (e) {
      console.log(e);
    }
  }
  //filter poll categories
  else {
    try {
      var p = await Poll.find({ tag: query.tag }).sort({ createdAt: -1 });

      if (p.length !== 0) {
        var title = "Discover " + p[0].tagDisplay + " polls";
        if (p.length > 10) {
          p.length = 10; //makes sure not too much data is sent to client
        }
        p = await JSON.parse(JSON.stringify(p));
      } else {
        var title = "Discover polls";
      }
    } catch (e) {
      console.log(e);
    }
  }

  return {
    props: {
      poll_data: p,
      page_title: title,
    },
  };
}
