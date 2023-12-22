import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import Image from "next/image";

const CustomNav = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
      
          <Navbar.Brand style={{ fontSize: "25px" }} href='/'>
            <Image
              src={"/favicon.ico"}
              layout={"intrinsic"}
              width={40}
              height={40}
              alt={'trashflixs logo'}
            />
            Trashflixs
          </Navbar.Brand>
     

        <Nav className="me-auto">
         
            <Nav.Link href='/discover'>Discover</Nav.Link>
        
        </Nav>
      </Container>
    </Navbar>
  );
};

export default CustomNav;
