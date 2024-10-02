import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" }); // Add server error state
  const navigate = useNavigate(); // React Router hook for navigation

  // Email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let valid = true;

    // Reset error state
    setError({ email: "", password: "", server: "" });

    // Validate email
    if (!validateEmail(email)) {
      setError((prev) => ({ ...prev, email: "Invalid email format" }));
      valid = false;
    }

    // Validate password
    if (password.length === 0) {
      setError((prev) => ({ ...prev, password: "Password cannot be empty" }));
      valid = false;
    }

    // If the form is valid, attempt to log in
    if (valid) {
      try {
        const response = await AuthService.login({ email, password });
        alert("Login successful");

        // Store user_id in localStorage for future use (e.g., adding job applications)
        localStorage.setItem("user_id", response.data.user_id);

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        // Display server error
        setError((prev) => ({
          ...prev,
          server: error.response?.data?.message || "Login failed",
        }));
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error.email}
            required
          />
          {error.email && <FormHelperText error>{error.email}</FormHelperText>}

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error.password}
            required
          />
          {error.password && (
            <FormHelperText error>{error.password}</FormHelperText>
          )}

          {/* Display server error message */}
          {error.server && (
            <Typography color="error">{error.server}</Typography>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account? <a href="/register">Register here</a>.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
