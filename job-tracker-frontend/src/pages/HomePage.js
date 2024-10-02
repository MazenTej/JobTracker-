import React from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Job Tracker!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Track your job applications, manage resumes, and match your skills to
          job descriptions.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
            fullWidth
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
