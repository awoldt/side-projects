import React from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  RedditShareButton,
  RedditIcon
} from "react-share";

const SocialShareBtns = ({ site_url }) => {
  return (
    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
      <FacebookShareButton url={site_url} style={{ marginRight: "10px" }}>
        <FacebookIcon round={true} size={32} />
      </FacebookShareButton>

      <TwitterShareButton url={site_url} style={{marginRight: '10px'}}>
        <TwitterIcon round={true} size={32} />
      </TwitterShareButton>

      <RedditShareButton url={site_url} style={{marginRight: '10px'}}>
          <RedditIcon round={true} size={32}/>
      </RedditShareButton>
    </div>
  );
};

export default SocialShareBtns;
