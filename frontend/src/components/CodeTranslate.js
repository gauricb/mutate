import { useState, useEffect } from "react";
import {
	Container,
	Row,
	Col,
	Dropdown,
	FormControl,
	Button,
	Modal,
} from "react-bootstrap";
import MainNavbar from "../components/Navbar.js";

const CodeTranslator = () => {
	const [showModal, setShowModal] = useState(false);
	const handleCloseModal = () => {
		setShowModal(false);
		window.location.href = "/login";
	};
	// check if the user is logged in
	useEffect(() => {
		const token = localStorage.getItem("token");
		// TODO: check if token is expired
		if (!token) {
			setShowModal(true);
		}
	}, []);
	// State for selected programming languages
	const [inputLanguage, setInputLanguage] = useState("");
	const [outputLanguage, setOutputLanguage] = useState("");
	// State for code inputted by the user
	const [inputCode, setInputCode] = useState("");
	// State for translated code
	const [outputText, setOutputText] = useState("");

	// Handler for translating code
	const translateCode = () => {
		// Construct the request body
		const requestBody = {
			source_lang: inputLanguage,
			target_lang: outputLanguage,
			source_code: inputCode,
		};

		// Make a POST request to the backend endpoint
		fetch("http://127.0.0.1:8000/translate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Problem with the response!");
				}
				return response.json();
			})
			.then((data) => {
				setOutputText(data.translated_text);
			})
			.catch((error) => {
				console.error("There was a problem with the translation:", error);
			});
	};

	return (
		<div>
			<MainNavbar />
			<Container>
				<Row>
					{/* Input Section */}
					<Col>
						<h2>Input Language</h2>
						<Dropdown>
							<Dropdown.Toggle variant="success" id="input-language-dropdown">
								{inputLanguage || "Select Language"}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item onClick={() => setInputLanguage("JavaScript")}>
									JavaScript
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setInputLanguage("Python")}>
									Python
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setInputLanguage("Java")}>
									Java
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setInputLanguage("C++")}>
									C++
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setInputLanguage("C")}>
									C
								</Dropdown.Item>
								{/* Add more languages as needed */}
							</Dropdown.Menu>
						</Dropdown>
						<FormControl
							as="textarea"
							placeholder="Enter code here..."
							style={{
								backgroundColor: "#f8f9fa",
								color: "#212529",
								height: "300px",
								fontSize: "16px",
								fontFamily: "Arial, sans-serif",
								marginTop: "10px",
							}}
							value={inputCode}
							onChange={(e) => setInputCode(e.target.value)}
						/>
					</Col>
					{/* Translate Button */}
					<Col className="d-flex align-items-center justify-content-center">
						<Button variant="primary" onClick={translateCode}>
							Translate
						</Button>
					</Col>
					{/* Output Section */}
					<Col>
						<h2>Output Language</h2>
						<Dropdown>
							<Dropdown.Toggle variant="success" id="output-language-dropdown">
								{outputLanguage || "Select Language"}
							</Dropdown.Toggle>
							<Dropdown.Menu>
								<Dropdown.Item onClick={() => setOutputLanguage("JavaScript")}>
									JavaScript
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setOutputLanguage("Python")}>
									Python
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setOutputLanguage("Java")}>
									Java
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setOutputLanguage("C++")}>
									C++
								</Dropdown.Item>
								<Dropdown.Item onClick={() => setOutputLanguage("C")}>
									C
								</Dropdown.Item>
								{/* Add more languages as needed */}
							</Dropdown.Menu>
						</Dropdown>
						<FormControl
							as="textarea"
							placeholder="Translated code will appear here..."
							style={{
								backgroundColor: "#f8f9fa",
								color: "#212529",
								height: "300px",
								fontSize: "16px",
								fontFamily: "Arial, sans-serif",
								marginTop: "10px",
							}}
							readOnly
							value={outputText} // Bind the value attribute to outputText state variable
						/>
					</Col>
				</Row>
			</Container>
			{/* Modal for displaying login error */}
			<Modal show={showModal} onHide={handleCloseModal} centered>
				<Modal.Header closeButton>
					<Modal.Title>Login Error</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>Please Login</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default CodeTranslator;
