import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CodeTranslator from "./components/CodeTranslate.js";
import Home from "./pages/Home.js";
import Login from "./pages/Login.js";
import Registration from "./pages/Registration.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/translate" element={<CodeTranslator />} />
          <Route path="/history" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
