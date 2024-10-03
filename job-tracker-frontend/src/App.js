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

// Simple function to check if the user is logged in
const isAuthenticated = () => {
  return !!localStorage.getItem("user_id"); // Check if user_id exists in localStorage
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected route for the dashboard */}
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Protected route for adding a new application */}
        <Route
          path="/add-application"
          element={
            isAuthenticated() ? <AddApplication /> : <Navigate to="/login" />
          }
        />

        {/* Protected route for editing an application */}
        <Route
          path="/edit-application/:applicationId"
          element={
            isAuthenticated() ? <EditApplication /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
