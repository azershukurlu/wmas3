import React from "react";
import HomePage from "./HomePage";
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
          </ul>
        </nav>
        <Routes>
          <Route path="/wmas3" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
