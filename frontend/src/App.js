import logo from "./logo.svg";
import "./App.css";
import MainNavbar from "./components/Navbar.js";

function App() {
	return (
		<div className="App">
			<MainNavbar />
			<header className="App-header">
				<h1>Welcome to ByteLingo</h1>
				<p>This is your starting point.</p>
			</header>
		</div>
	);
}

export default App;
