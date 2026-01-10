import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Profile from "./pages/profile.jsx";
import Tutorial from "./pages/tutorial.jsx";
import Upload from "./pages/upload.jsx";
import History from "./pages/history.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<Profile />} />
        <Route path="/tutorial" element={<Tutorial />} /> // for hard coded
        tutorials
        <Route path="/upload" element={<Upload />} /> // for after pictures are
        uploaded
        <Route path="/history" element={<History />} /> // for after pictures
        are uploaded
      </Routes>
    </Router>
  );
}

export default App;
