import React from "react";
import HomePage from "./HomePage";
import ContactMe from "./ContactMe";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "./style/App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link className="btn" to="/wmas3">
                Home Page
              </Link>
            </li>
            <li>
              <Link className="btn" to="/contactme">
                Contact Me
              </Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/wmas3" element={<HomePage />} />
          <Route path="/contactme" element={<ContactMe />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
