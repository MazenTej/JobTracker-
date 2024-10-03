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

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", server: "" });
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Email validation
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
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
        const response = await AuthService.register({ email, password });
        alert("Registration successful");

        localStorage.setItem("user_id", response.data.user_id);

        setLoading(false); // Set loading to false after successful registration
        navigate("/dashboard");
      } catch (error) {
        setLoading(false); // Set loading to false in case of error
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

          {error.server && (
            <Typography color="error">{error.server}</Typography>
          )}

          {/* Show loader while registering */}
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
