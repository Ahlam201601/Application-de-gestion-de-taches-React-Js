import React from "react";
// import Home from './pages/home/Home.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Corbeille from "./pages/corbeille/corbeille";
export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/corbeille" element={<Corbeille />} />
        </Routes>
      </Router>
    </div>
  );
}
