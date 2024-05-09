import { useState } from "react";
import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const config = {
		headers: { "content-type": "application/x-www-form-urlencoded" },
	};
	const url = "http://127.0.0.1:8000/token";
	const handleLogin = () => {
		let User = new FormData();
		User.append("username", email);
		User.append("password", password);

		console.log(User.username);
		axios
			.post(url, User, config)
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
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
										src="https://images.pexels.com/photos/19945132/pexels-photo-19945132/free-photo-of-abstract-background-with-blue-lines.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
										alt="login form"
										className="img-fluid"
										style={{ borderRadius: "1rem 0 0 1rem" }}
									/>
								</Col>
								<Col md={6} lg={7} className="d-flex align-items-center">
									<Card.Body className="p-4 p-lg-5 text-black">
										<Form>
											<div className="d-flex align-items-center mb-3 pb-1">
												<i
													className="fas fa-cubes fa-2x me-3"
													style={{ color: "#00bcd4" }}></i>
												<span className="h1 fw-bold mb-0">Bytelingo</span>
											</div>

											<h5
												className="fw-normal mb-3 pb-3"
												style={{ letterSpacing: "1px" }}>
												Sign into your account
											</h5>

											<Form.Group className="mb-4">
												<Form.Control
													type="email"
													id="form2Example17"
													placeholder="Email address"
													className="form-control-lg"
													onChange={(e) => setEmail(e.target.value)}
												/>
											</Form.Group>

											<Form.Group className="mb-4">
												<Form.Control
													type="password"
													id="form2Example27"
													placeholder="Password"
													className="form-control-lg"
													onChange={(e) => setPassword(e.target.value)}
												/>
											</Form.Group>

											<div className="pt-1 mb-4">
												<Button
													onClick={handleLogin}
													variant="primary"
													type="button"
													size="lg"
													block>
													Login
												</Button>
											</div>

											<a href="#!" className="small text-muted">
												Forgot password?
											</a>
											<p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
												Don't have an account?{" "}
												<a href="register" style={{ color: "#393f81" }}>
													Register here
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

export default Login;
