import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <Helmet>
        <title>About</title>
        <meta
          name="description"
          content="OnlineChartMaker is the easiest place to make charts as quickly as possible. Built on React.js, this web app is fast and secure."
        />
        <link rel="canonical" href="https://onlinechartmaker.com/#/about" />
      </Helmet>
      <h1>About</h1>
      <p>
        Most chart sites don't make it easy enough to create a quality chart on
        the fly. Their user interfaces are cluttered and complex for no reason,
        and creating a chart can take way too long.
      </p>
      <p>
        OnlineChartMaker fixes that problem. Creating image based charts has
        never been more simple. With a minimilistic interface with easy to
        understand tools, anyone with internet conneciton can make a good
        looking chart in no time.
      </p>
      <br></br>
      <div>
        <p>Supported charts</p>
        <ul>
          <li>
            <Link to="/bar">Bar</Link>
          </li>
          <li>
            <Link to="/line">Line</Link>
          </li>
          <li>
            <Link to="/radar">Radar</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
