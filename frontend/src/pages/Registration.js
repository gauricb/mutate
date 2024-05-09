import { useState } from "react";
import {
	Container,
	Row,
	Col,
	Card,
	Form,
	Button,
	Alert,
} from "react-bootstrap";
import axios from "axios";

function Registration() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPasswordAlert, setShowPasswordAlert] = useState(false);
	const [email, setEmail] = useState("");
	const url = "http://127.0.0.1:8000/register";
	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password.length < 8) {
			setShowPasswordAlert(true);
		} else if (password !== confirmPassword) {
			console.log("Passwords do not match");
		} else {
			axios
				.post(url, { username: email, email: email, password: password })
				.then((response) => {
					console.log(response);
					if (response.status === 201) {
						window.location.href = "/login";
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	return (
		<section className="vh-100" style={{ backgroundColor: "#e3f2fd" }}>
			<Container fluid className="py-5 h-100">
				<Row className="d-flex justify-content-center align-items-center h-100">
					<Col xl={10}>
						<Card style={{ borderRadius: "1rem" }}>
							<Row className="g-0">
								<Col md={6} lg={5} className="d-none d-md-block">
									<Card.Img
										src="https://images.pexels.com/photos/4747919/pexels-photo-4747919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
										alt="registration form"
										className="img-fluid"
										style={{ borderRadius: "1rem 0 0 1rem" }}
									/>
								</Col>
								<Col md={6} lg={7} className="d-flex align-items-center">
									<Card.Body className="p-4 p-lg-5 text-black">
										<Form onSubmit={handleSubmit}>
											<div className="d-flex align-items-center mb-3 pb-1">
												<i
													className="fas fa-cubes fa-2x me-3"
													style={{ color: "#00bcd4" }}></i>
												<span className="h1 fw-bold mb-0">Bytelingo</span>
											</div>

											<h5
												className="fw-normal mb-3 pb-3"
												style={{ letterSpacing: "1px" }}>
												Create an account
											</h5>

											<Form.Group className="mb-4">
												<Form.Control
													type="email"
													placeholder="Email address"
													className="form-control-lg"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
												/>
											</Form.Group>

											<Form.Group className="mb-4">
												<Form.Control
													type="password"
													placeholder="Password"
													className="form-control-lg"
													value={password}
													onChange={handlePasswordChange}
													minLength={8}
												/>
											</Form.Group>

											<Form.Group className="mb-4">
												<Form.Control
													type="password"
													placeholder="Confirm Password"
													className="form-control-lg"
													value={confirmPassword}
													onChange={handleConfirmPasswordChange}
												/>
											</Form.Group>

											<div className="pt-1 mb-4">
												<Button variant="primary" type="submit" size="lg" block>
													Register
												</Button>
											</div>

											{showPasswordAlert && (
												<Alert variant="danger">
													Password must be at least 8 characters long.
												</Alert>
											)}

											<p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
												Already have an account?{" "}
												<a href="/login" style={{ color: "#393f81" }}>
													Sign in
												</a>
											</p>
											<a href="#!" className="small text-muted">
												Terms of use.
											</a>
											<a href="#!" className="small text-muted">
												Privacy policy
											</a>
										</Form>
									</Card.Body>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
			</Container>
		</section>
	);
}

export default Registration;
