import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TelemetryPage from "./pages/TelemetryPage";
import { AuthContext } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { jwt, setJwt } = useContext(AuthContext);

  const handleLogout = () => {
    setJwt(""); // clears state
    localStorage.removeItem("jwt"); // clears storage
    window.location.href = "/login"; // redirect
  };

  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        {!jwt ? (
          <>
            <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard">Dashboard</Link> |{" "}
            <Link to="/telemetry">Telemetry</Link> |{" "}
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/telemetry"
            element={
              <ProtectedRoute>
                <TelemetryPage />
              </ProtectedRoute>
            }
          />
      </Routes>
    </Router>
  );
}

export default App;
