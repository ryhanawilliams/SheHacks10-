import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Profile from "./pages/profile.jsx";
import Tutorial from "./pages/tutorial.jsx";
import Upload from "./pages/upload.jsx";
import History from "./pages/history.jsx";
import Results from "./pages/results.jsx";
import CapturePage from "./pages/CapturePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/user"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/tutorial/:id"
          element={
            <RequireAuth>
              <Tutorial />
            </RequireAuth>
          }
        />
        <Route
          path="/results"
          element={
            <RequireAuth>
              <Results />
            </RequireAuth>
          }
        />
        <Route
          path="/upload"
          element={
            <RequireAuth>
              <Upload />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />
        <Route
          path="/capture"
          element={
            <RequireAuth>
              <CapturePage />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
