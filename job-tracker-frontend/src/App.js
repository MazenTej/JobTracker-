import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import HomePage from "./pages/HomePage";
import Dashboard from "./components/Dashboard";
import AddApplication from "./components/Applications/AddApplication";
import EditApplication from "./components/Applications/EditApplication";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-application" element={<AddApplication />} />
        <Route
          path="/edit-application/:applicationId"
          element={<EditApplication />}
        />
      </Routes>
    </Router>
  );
}

export default App;
