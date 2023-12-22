import React from "react";

const index = () => {
  return <></>;
};

export default index;

export const getServerSideProps = async () => {
  return {
    redirect: {
      permanent: true,
      destination: "/discover",
    },
  };
};
