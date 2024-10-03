import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormHelperText,
  CircularProgress, // For loading spinner
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    server: "",
  });
  const [loading, setLoading] = useState(false); // Loading state for spinner
  const navigate = useNavigate(); // React Router hook for navigation

  // Email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let valid = true;

    // Reset error state
    setError({ email: "", password: "", confirmPassword: "", server: "" });

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

    // Validate confirm password
    if (password !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      valid = false;
    }

    // If the form is valid, attempt to register
    if (valid) {
      try {
        setLoading(true); // Show loading spinner
        const response = await AuthService.register({ email, password });

        // Check if the status code is 201, which means registration was successful
        if (response.status === 201) {
          alert("Registration successful. Please log in.");

          // Redirect to the login page
          navigate("/login");
        } else {
          throw new Error("Registration failed");
        }

        setLoading(false); // Hide spinner
      } catch (error) {
        setLoading(false); // Hide spinner on error
        console.error("Registration Error:", error); // Log the error for debugging
        setError((prev) => ({
          ...prev,
          server: error.response?.data?.message || "Registration failed",
        }));
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister}>
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

          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error.confirmPassword}
            required
          />
          {error.confirmPassword && (
            <FormHelperText error>{error.confirmPassword}</FormHelperText>
          )}

          {error.server && (
            <Typography color="error">{error.server}</Typography>
          )}

          {/* Show loading spinner while registering */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Register
            </Button>
          )}
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <a href="/login">Login here</a>.
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
