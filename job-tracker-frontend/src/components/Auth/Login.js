import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormHelperText,
  CircularProgress, // Import CircularProgress for the spinner
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" });
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let valid = true;

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

    if (valid) {
      try {
        setLoading(true); // Set loading to true when submitting
        const response = await AuthService.login({ email, password });
        alert("Login successful");

        localStorage.setItem("user_id", response.data.user_id);

        setIsAuthenticated(true);

        setLoading(false); // Set loading to false after successful login
        navigate("/dashboard");
      } catch (error) {
        setLoading(false); // Set loading to false in case of error
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

          {error.server && (
            <Typography color="error">{error.server}</Typography>
          )}

          {/* Show loader while logging in */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          )}
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don’t have an account? <a href="/register">Register here</a>.
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
