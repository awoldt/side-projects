import React from "react";
import { Container } from "react-bootstrap";

const privacy = () => {
  return (
    <Container>
      <div style={{ marginBottom: "25px", marginTop: "25px" }}>
        <a style={{ paddingLeft: "0px" }} href={"/"}>
          Home
        </a>
      </div>

      <h1>Privacy Policy</h1>
      <p className="text-secondary">Last updated 3/1/2022</p>

      <p>
        This Privacy Policy document contains types of information that is
        collected and recorded and how it is used.
      </p>

      <h2>Consent</h2>

      <p>
        By using our website, you hereby consent to our Privacy Policy and agree
        to its terms.
      </p>

      <h2>Information we collect</h2>
      <p>
        The only information that is collected is the behavior of users, such as
        page views, clicks, and how long each browsing session is. There is no
        personally identifiable information that is collected from users. Google
        analytics is used to obtain this information.
      </p>

      <h2>How we use your information</h2>

      <p>We use the information collected to:</p>

      <ul>
        <li>Analyze website traffic</li>
      </ul>

      <h2>Log Files</h2>

      <p>
        OnlineChartMaker follows a standard procedure of using log files. These files log
        visitors when they visit websites. All hosting companies do this and a
        part of hosting services&apos; analytics. The information collected by
        log files include internet protocol (IP) addresses, browser type,
        Internet Service Provider (ISP), date and time stamp, referring/exit
        pages, and possibly the number of clicks. These are not linked to any
        information that is personally identifiable. The purpose of the
        information is for analyzing trends, administering the site, tracking
        user&apos;s movement on the website, and gathering demographic
        information.
      </p>

      <h2>Cookies and Web Beacons</h2>

      <p>
        Like any other website, OnlineChartMaker uses cookies. These cookies are used to
        store information including visitor&apos;s preferences, and the pages on
        the website that the visitor accessed or visited. The information is
        used to optimize the user&apos;s experience by customizing our web page
        content based on visitor&apos;s browser type and/or other information.
      </p>

      <p>
        For more general information on cookies, please read{" "}
        <a href="https://en.wikipedia.org/wiki/HTTP_cookie">this</a>.
      </p>

      <h2>Third Party Privacy Policies</h2>

      <p>
        OnlineChartMaker&apos;s Privacy Policy does not apply to other advertisers or
        websites. Thus, we are advising you to consult the respective Privacy
        Policies of these third-party ad servers for more detailed information.
        It may include their practices and instructions about how to opt-out of
        certain options.{" "}
      </p>

      <ul>
        <li>
          <a
            href="https://policies.google.com/privacy?hl=en-US"
            rel="noreferrer"
            target={"_blank"}
          >
            Google
          </a>
        </li>
      </ul>

      <p>
        You can choose to disable cookies through your individual browser
        options. To know more detailed information about cookie management with
        specific web browsers, it can be found at the browser&apos;s respective
        websites.
      </p>
    </Container>
  );
};

export default privacy;