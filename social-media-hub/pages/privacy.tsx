import { Container } from "react-bootstrap";

const Privacy = () => {
  return (
    <Container fluid style={{ backgroundColor: "#EDEDE9" }}>
      <Container>
        <a
          className="mt-5 mb-4"
          href={"/"}
          style={{ display: "block", textDecoration: "none" }}
        >
          Return home
        </a>

        <h1 style={{ marginBottom: "5px" }}>Privacy</h1>
        <p className="text-muted">Last updated 11/20/2022</p>
        <hr></hr>
        <p>
          At Social-Media-Hub, accessible from
          https://social-media-hub.vercel.app/, one of our main priorities is
          the privacy of our visitors. This Privacy Policy document contains
          types of information that is collected and recorded by
          Social-Media-Hub and how we use it.
        </p>

        <h2>Consent</h2>

        <p>
          By using our website, you hereby consent to our Privacy Policy and
          agree to its terms.
        </p>

        <h2>Information we collect</h2>

        <p>
          When you register for an Account, we ask only for an email address and
          password. There is no other personally identifiable information
          collected from our users.
        </p>

        <h2>How we use your information</h2>

        <p>We use the information we collect in various ways, including to:</p>

        <ul>
          <li>Provide, operate, and maintain our website</li>
        </ul>

        <p>
          The email address and password provided is used soley to identify
          users and their external social media platforms connected to the
          account they created.
        </p>

        <h2>Log Files</h2>

        <p>
          Social-Media-Hub follows a standard procedure of using log files.
          These files log visitors when they visit websites. All hosting
          companies do this and a part of hosting services&apos; analytics. The
          information collected by log files include internet protocol (IP)
          addresses, browser type, Internet Service Provider (ISP), date and
          time stamp, and referring/exit pages. These are not linked to any
          information that is personally identifiable. The purpose of the
          information is for analyzing trends, administering the site, tracking
          users&apos; movement on the website, and gathering demographic
          information.
        </p>

        <h2>Cookies and Web Beacons</h2>

        <p>
          Like any other website, Social-Media-Hub uses &apos;cookies&apos;.
          These cookies are used to store information about accounts created.
          There are no third-party cookies stored.
        </p>
      </Container>
    </Container>
  );
};

export default Privacy;
