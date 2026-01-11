import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Profile from "./pages/profile.jsx";
import Tutorial from "./pages/tutorial.jsx";
import Upload from "./pages/upload.jsx";
import History from "./pages/history.jsx";
import Results from "./pages/results.jsx";
import CapturePage from "./pages/CapturePage.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<Profile />} />
        <Route path="/tutorial/:id" element={<Tutorial />} />
        <Route path="/results" element={<Results />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/history" element={<History />} />
        <Route path="/capture" element={<CapturePage />} />
      </Routes>
    </Router>
  );
}

export default App;
