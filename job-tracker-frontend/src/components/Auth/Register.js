import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" }); // Add server error state

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let valid = true;

    setError({ email: "", password: "", server: "" });

    if (!validateEmail(email)) {
      setError((prev) => ({ ...prev, email: "Invalid email format" }));
      valid = false;
    }

    if (password.length < 6) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }));
      valid = false;
    }

    if (valid) {
      try {
        await AuthService.register({ email, password });
        alert("Registration successful");
      } catch (error) {
        // Display server error
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

          {/* Display server error message */}
          {error.server && (
            <Typography color="error">{error.server}</Typography>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login here</Link>.
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
