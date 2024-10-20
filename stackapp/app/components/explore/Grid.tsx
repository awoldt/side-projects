import { Stack } from "~/models/stack";
import TechUsedDisplay from "../TechUsedDisplay";
import { UserProfile } from "~/models/profile";

export default function ExploreGrid({
  recentStacks,
}: {
  recentStacks:
    | {
        stackData: Stack;
        githubProfileData: UserProfile;
        techUsedDisplay: string[] | null;
      }[]
    | undefined;
}) {
  return (
    <>
      {recentStacks && (
        <div className="content">
          <div className="cardHolder">
            {recentStacks.map((x, index) => {
              return (
                <div className="card" key={index}>
                  <div className="cardContent">
                    <a
                      href={`/stack/${x.stackData._id}`}
                      style={{ padding: 0, opacity: 1 }}
                    >
                      <img
                        src={`${x.stackData.thumbnails[0]}`}
                        className="img-thumbnail"
                        width="415"
                        height="265"
                        alt="profile-img"
                      />
                    </a>

                    <div className="cardTitleHolder">
                      <div className="cardTitle">
                        <a href={`/profile/${x.githubProfileData.public_id}`}>
                          <img
                            className="cardProfileImage"
                            src={x.githubProfileData.profile_img}
                            width="25"
                            height="25"
                            alt="profile-img"
                          />
                        </a>

                        <p className="title">{x.stackData.repo_name}</p>
                      </div>

                      {x.techUsedDisplay && (
                        <TechUsedDisplay t={x.techUsedDisplay} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
