import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomNav = () => {
  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Link to="/" style={{ textDecoration: "none" }} title={'Home'}>
          <Navbar.Brand style={{ color: "white", fontSize: "35px" }}>
            <img src='/charts/bar.png' width='50px' height='50px' alt='website logo'/>
          </Navbar.Brand>
        </Link>

        <Nav className="mr-auto">
          <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
            About
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNav;
