import { UserProfile } from "~/models/profile";

interface PropData {
  profileData: UserProfile;
  viewData: [
    string,
    React.Dispatch<React.SetStateAction<"liked_stacks" | "your_stacks">>
  ];
}

export default function ProfileHeader(props: PropData) {
  return (
    <>
      <div className="header">
        <div className="profile">
          <img
            className="profileImage"
            src={props.profileData.profile_img}
            width="120"
            height="120"
            alt="profile-img"
          />
          <div className="profileTextHolder">
            {props.profileData.name && (
              <span className="title">{props.profileData.name}</span>
            )}
            <span className="profileTextUsername">
              @{props.profileData.username}
            </span>
            {props.profileData.bio && (
              <p style={{ marginTop: "10px" }}>{props.profileData.bio}</p>
            )}
          </div>
        </div>
        <div className="profileButtonHolder">
          <button
            className="settingsButton"
            onClick={async () => {
              const userConfirm = window.confirm(
                "Are you sure you want to delete your account?"
              );
              if (userConfirm) {
                const userConfirm2 = window.confirm(
                  "This action can not be undone. Are you sure?"
                );
                if (userConfirm2) {
                  const req = await fetch(`/api?action=delete_profile`, {
                    method: "post",
                  });
                  const res = await req.json();
                  alert(res.message);
                  if (res.status == 200) {
                    window.location.assign("/");
                  }
                }
              }
            }}
          >
            <img
              src="/imgs/icons/trash.svg"
              alt="trash icon"
              width={"10px"}
              style={{ marginRight: "10px" }}
            />
            Delete account
          </button>
        </div>
      </div>
      <div
        className="profileButtonHolder"
        style={{ borderBottom: "1px solid #171d1c20" }}
      >
        <div className="buttonHolder">
          <button
            className="subtitle"
            style={{ display: "flex", alignItems: "center" }}
            onClick={() => {
              props.viewData[1]("your_stacks");
            }}
          >
            <img
              src="/imgs/icons/dot.svg"
              width={"14px"}
              height={"14px"}
              alt="three dots icon"
            />
            YOUR STACKS
          </button>
          <div>
            <button
              className="subtitle"
              onClick={() => {
                props.viewData[1]("liked_stacks");
              }}
            >
              <img src="/imgs/icons/heart.svg" width={"12px"} alt="like icon" />
              &nbsp;LIKES
            </button>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}
