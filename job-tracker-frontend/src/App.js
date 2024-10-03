import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard";
import AddApplication from "./components/Applications/AddApplication";
import EditApplication from "./components/Applications/EditApplication";

const checkAuthentication = () => {
  const userId = localStorage.getItem("user_id");
  return userId !== null && userId !== undefined;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthentication());

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(checkAuthentication());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-application"
          element={
            isAuthenticated ? <AddApplication /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/edit-application/:applicationId"
          element={
            isAuthenticated ? <EditApplication /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
