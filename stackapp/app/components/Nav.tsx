export default function Nav({
  isSignedIn,
  profileImg,
}: {
  isSignedIn: boolean;
  profileImg: string | null;
}) {
  return (
    <div className="nav">
      <div style={{ width: "25%", textAlign: "left" }}>
        <a href="/explore">Explore</a>
        <a href="/create">Create</a>
      </div>
      <div style={{ width: "50%", textAlign: "center" }}>
        <a href="/">
          <span>Stack</span>
        </a>
      </div>
      <div style={{ width: "25%", textAlign: "right" }}>
        <a href="/profile" style={{ padding: "0rem" }} title="View profile">
          <img
            src={
              isSignedIn && profileImg
                ? profileImg
                : "/imgs/icons/noprofile.png"
            }
            width="40"
            height="40"
            alt="profile-img"
            style={{ borderRadius: "100px" }}
          />
        </a>
      </div>
    </div>
  );
}
