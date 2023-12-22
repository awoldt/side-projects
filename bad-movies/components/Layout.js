import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import CustomNav from "./CustomNav";

const Layout = ({ children }) => {
  return (
    <>
      <CustomNav />
      <Container>
        {children}
      </Container>
    </>
  );
};

export default Layout;
