import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Container } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../logo.svg";
import ByteLingo from "../ByteLingo.png";

const current_user = "xyz@umass.edu";
const MainNavbar = () => {
	return (
		<Navbar bg="primary" variant="dark">
			<Container>
				<Navbar.Brand href="#home">ByteLingo</Navbar.Brand>
				<Nav className="me-auto">
					<Nav.Link href="translate">Translate</Nav.Link>
					<Nav.Link href="history">View History</Nav.Link>
				</Nav>
				<NavDropdown
					title={`Signed in as: ${current_user}`}
					id="collapsible-nav-dropdown">
					<NavDropdown.Item href="#">Logout</NavDropdown.Item>
				</NavDropdown>
			</Container>
		</Navbar>
	);
};

export default MainNavbar;
