import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Container } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import logo from "../logo.svg";
import ByteLingo from "../ByteLingo.png";

const MainNavbar = () => {
	const [currentUser, setCurrentUser] = useState("xyz@umass.edu");

	useEffect(() => {
		const getUserData = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					console.error("Token not found in localStorage");
					return;
				}

				const response = await axios.get("http://127.0.0.1:8000/users/me/", {
					headers: {
						accept: "application/json",
						Authorization: `Bearer ${token}`, // Using the stored token
					},
				});

				console.log("User data:", response.data);
				setCurrentUser(response.data.email); // Update state
			} catch (error) {
				console.error("Error fetching user data:", error); // Handle errors
			}
		};

		getUserData();
	}, []); // Empty dependency array means this useEffect runs once when the component mounts

	return (
		<Navbar bg="primary" variant="dark">
			<Container>
				<Navbar.Brand href="#home">ByteLingo</Navbar.Brand>
				<Nav className="me-auto">
					<Nav.Link href="translate">Translate</Nav.Link>
					<Nav.Link href="history">View History</Nav.Link>
				</Nav>
				<NavDropdown
					title={`Signed in as: ${currentUser}`}
					id="collapsible-nav-dropdown">
					<NavDropdown.Item href="login">Logout</NavDropdown.Item>
				</NavDropdown>
			</Container>
		</Navbar>
	);
};

export default MainNavbar;
