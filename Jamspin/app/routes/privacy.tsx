const PrivacyPage = () => {
  return (
    <div className="container mx-auto">
      {" "}
      <h1 className="mt-4">JamSpin Privacy Policy</h1>{" "}
      <p className="text-muted">
        <i>Last updated September 2nd, 2024</i>
      </p>
      <div className="mt-5 mb-5">
        {" "}
        <p>
          At Jampsin, we take your privacy seriously. We do not collect any
          personally identifiable information.
        </p>
        <p className="mt-5">
          We use the information we collect from Spotify to:
        </p>
        <ul className="list-disc">
          <li>Create your Jampsin account</li>
          <li>Add playlists to your library</li>
        </ul>
      </div>
      <a href="/" title="Return home" style={{ color: "blue" }}>
        Return home
      </a>
    </div>
  );
};

export default PrivacyPage;
