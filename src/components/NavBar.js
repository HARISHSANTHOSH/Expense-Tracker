import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import './NavBar.css'; 
import expenseTrackerLogo from './expenses.png'
export const NavBar = () => {
  return (
    <Navbar className="custom-navbar" bg="primary" expand="lg" variant="dark" style={{position:'fixed',top:'0',width:'100%',zIndex:'1000'}}>
      <Container >
      <Navbar.Brand className="brand-container" href="/homepage">
          <img
            src={expenseTrackerLogo}
            alt="Expense Tracker Logo"
            className="logo-image"
          />
          <span  className="brand-text">Expense Forge</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
          <Nav.Link href="/about" style={{marginLeft:'390px'}}>About</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default NavBar