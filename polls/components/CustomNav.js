import React from "react";
import { Container, Navbar, Button} from "react-bootstrap";

const CustomNav = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/"><span>Polls</span></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
              <a href={'/new'}><Button style={{fontSize: '14px', padding: '5px'}} variant="danger">New Poll</Button></a>
            
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNav;
