import { author_data } from "../interfaces";
import Image from "next/image";

export default function Author({ authorData }: { authorData: author_data }) {
  return (
    <div>
      <Image
        src={String(authorData.author_profile_picture)}
        width={200}
        height={200}
        alt={authorData.author_name + " twitter profile picture"}
        style={{borderRadius: "10px"}}
      />
      <div>
        <b>{authorData.author_name}</b>
        <br></br>
        <span className="text-secondary">@{authorData.author_username}</span>
      </div>
    </div>
  );
}
