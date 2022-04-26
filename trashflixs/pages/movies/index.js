import React from "react";

const index = () => {
  return <></>;
};

export default index;

//all /movies without movie id is simply redirect to discover page
export const getServerSideProps = async (context) => {
  return {
    redirect: {
      permanent: true,
      destination: "/discover",
    },
  };
};
