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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import MainNavbar from "../components/Navbar.js";
import axios from "axios";

const CodeTranslator = () => {
	const [showModal, setShowModal] = useState(false);
	const handleCloseModal = () => {
		setShowModal(false);
		window.location.href = "/login";
	};
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const handleCloseFeedbackModal = () => {
		setShowFeedbackModal(false);
	};

	const [selectedNumber, setSelectedNumber] = useState(1);

	const handleNumberChange = (number) => {
		setSelectedNumber(number);
	};

	const handleFeedbackSubmit = async () => {
		handleNumberSubmit(selectedNumber);
		const token = localStorage.getItem("token");
		const url = "http://127.0.0.1:8000/translations";
		let rating = selectedNumber;
		const data = {
			inputLang: inputLanguage,
			outputLang: outputLanguage,
			input: inputCode,
			output: outputText,
			rating: rating,
		};

		try {
			const response = await axios.post(url, data, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			console.log("Translation added successfully:", response.data);
			// Handle success response here
		} catch (error) {
			console.error("Error adding translation:", error.response.data);
			// Handle error response here
		}

		handleCloseFeedbackModal();
	};

	const handleNumberSubmit = (selectedNumber) => {
		console.log("Selected number:", selectedNumber);
		// You can do something with the selected number here
	};

	//check if the user is logged in
	useEffect(() => {
		const token = localStorage.getItem("token");
		console.log(token);
		// TODO: check if token is expired
		if (!token) {
			console.log("no token");
			setShowModal(true);
		}
	}, []);

	const [inputLanguage, setInputLanguage] = useState("");
	const [outputLanguage, setOutputLanguage] = useState("");
	const [inputCode, setInputCode] = useState("");
	const [outputText, setOutputText] = useState("");

	const translateCode = () => {
		// Check if input code is empty
		if (!inputCode.trim()) {
			alert("Please enter code to translate.");
			return;
		}

		// Check if input language and output language are different
		if (inputLanguage === outputLanguage) {
			alert("Input and output languages must be different.");
			return;
		}

		const requestBody = {
			source_lang: inputLanguage,
			target_lang: outputLanguage,
			source_code: inputCode,
		};

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
				// Show feedback modal 5 seconds after translation

				//setShowFeedbackModal(true);
			})
			.catch((error) => {
				console.error("There was a problem with the translation:", error);
			});
		setTimeout(() => {
			setShowFeedbackModal(true);
		}, 5000);
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(outputText);
		alert("Copied to clipboard!");
	};

	return (
		<div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
			<MainNavbar />

			<Container className="py-5">
				<Row>
					<Col md={4}>
						<h2 className="mb-4">Input Language</h2>
						<Dropdown>
							<Dropdown.Toggle variant="primary" id="input-language-dropdown">
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
							</Dropdown.Menu>
						</Dropdown>
						<FormControl
							as="textarea"
							placeholder="Enter code here..."
							className="mt-3"
							style={{ height: "300px", fontSize: "16px" }}
							value={inputCode}
							onChange={(e) => setInputCode(e.target.value)}
						/>
					</Col>
					<Col
						md={4}
						className="d-flex flex-column align-items-center justify-content-center">
						<Button variant="info" className="my-3" onClick={translateCode}>
							Translate
						</Button>
					</Col>
					<Col md={4}>
						<h2 className="mb-4">Output Language</h2>
						<Dropdown className="mb-3">
							<Dropdown.Toggle variant="primary" id="output-language-dropdown">
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
							</Dropdown.Menu>
						</Dropdown>
						<Button
							variant="secondary"
							onClick={copyToClipboard}
							disabled={!outputText}>
							<img
								src="https://icon-library.com/images/copy-to-clipboard-icon/copy-to-clipboard-icon-1.jpg"
								alt="copy"
								width="20"
								height="20"
								className="mr-2"
							/>
							Copy Output
						</Button>
						<SyntaxHighlighter
							language="javascript"
							style={tomorrow}
							className="mt-3">
							{outputText}
						</SyntaxHighlighter>
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

			{/* Modal for displaying feedback */}
			<Modal
				show={showFeedbackModal}
				onHide={handleCloseFeedbackModal}
				centered>
				<Modal.Header closeButton>
					<Modal.Title>Rate the translation</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="list-group">
						{[1, 2, 3, 4, 5].map((number) => (
							<a
								href="#"
								key={number}
								className={`list-group-item list-group-item-action ${
									selectedNumber === number ? "active" : ""
								}`}
								onClick={() => handleNumberChange(number)}>
								{number}
							</a>
						))}
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseFeedbackModal}>
						Close
					</Button>
					<Button variant="primary" onClick={handleFeedbackSubmit}>
						Submit
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default CodeTranslator;
