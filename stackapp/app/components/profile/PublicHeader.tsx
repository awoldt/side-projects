import { UserProfile } from "~/models/profile";

export default function ProfileHeader({
  profileData,
}: {
  profileData: UserProfile;
}) {
  return (
    <>
      <div className="header">
        <div className="profile">
          <img
            className="profileImage"
            src={profileData.profile_img}
            width="120"
            height="120"
            alt="profile-img"
          />
          <div className="profileTextHolder">
            {profileData.name && (
              <span className="title">{profileData.name}</span>
            )}
            <span className="profileTextUsername">@{profileData.username}</span>
            {profileData.bio && <p>{profileData.bio}</p>}
          </div>
        </div>
      </div>
      <hr
        style={{ color: "lightgrey", border: "1px solid", marginTop: "10px" }}
      />
    </>
  );
}
