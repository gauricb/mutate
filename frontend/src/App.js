import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainNavbar from "./components/Navbar.js";
import CodeTranslator from "./components/CodeTranslate.js";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";

function App() {
	return (
		<Router>
			<div className="App">
				<MainNavbar />
				<Routes>
					<Route path="/translate" element={<CodeTranslator />} />
					<Route path="/history" element={<Home />} />
					<Route path="/login" element={<Login />} />
					{/* <Route path="/translate" element={<CodeTranslator />} /> */}
				</Routes>
			</div>
		</Router>
	);
}

export default App;
