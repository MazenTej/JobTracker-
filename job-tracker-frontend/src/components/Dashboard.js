import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Container,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import AuthService from "../services/AuthService";
import ApplicationBox from "./ApplicationBox"; // Import the new ApplicationBox component

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(5); // Default number of applications per page

  // Filtering state
  const [statusFilter, setStatusFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState("");
  const navigate = useNavigate(); // To redirect after logout

  const fetchApplications = async () => {
    setLoading(true);
    const user_id = localStorage.getItem("user_id");
    try {
      const response = await AuthService.getApplications(user_id, {
        page,
        per_page: perPage,
        status: statusFilter,
        company: companyFilter,
        job_title: jobTitleFilter,
      });
      setApplications(response.data.applications);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setLoading(false);
    }
  };

  // Fetch applications whenever the page or filters change
  useEffect(() => {
    fetchApplications();
  }, [page, statusFilter, companyFilter, jobTitleFilter]);

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleCompanyFilterChange = (e) => {
    setCompanyFilter(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleJobTitleFilterChange = (e) => {
    setJobTitleFilter(e.target.value);
    setPage(1); // Reset to first page
  };

  const handleDelete = (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      AuthService.deleteApplication(applicationId)
        .then(() => {
          setApplications(
            applications.filter((app) => app.id !== applicationId)
          );
          alert("Application deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting application:", error);
          alert("Failed to delete application");
        });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Logout function
  const handleLogout = () => {
    // Clear localStorage (remove any stored tokens or user data)
    localStorage.removeItem("user_id");
    // Redirect to login page
    navigate("/login");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Job Application Dashboard
          </Typography>

          {/* Logout button positioned to the right */}
          <Button
            onClick={handleLogout}
            variant="contained"
            color="secondary"
            sx={{ alignSelf: "flex-end" }}
          >
            Logout
          </Button>
        </Box>
        {/* Logout button */}

        {/* Add New Application button */}
        <Button
          component={Link}
          to="/add-application" // Link to the Add Application page
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
        >
          Add New Application
        </Button>

        {/* Filters */}
        <Box sx={{ display: "flex", mb: 3 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Applied">Applied</MenuItem>
              <MenuItem value="Interviewing">Interviewing</MenuItem>
              <MenuItem value="Offered">Offered</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Company"
            variant="outlined"
            fullWidth
            margin="normal"
            value={companyFilter}
            onChange={handleCompanyFilterChange}
            sx={{ ml: 2 }}
          />
          <TextField
            label="Job Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={jobTitleFilter}
            onChange={handleJobTitleFilterChange}
            sx={{ ml: 2 }}
          />
        </Box>

        {/* Show loading spinner while fetching applications */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {applications.length > 0 ? (
              applications.map((application) => (
                <ApplicationBox
                  key={application.id}
                  application={application}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <Typography>No applications yet.</Typography>
            )}

            {/* Pagination Controls */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                onClick={handlePreviousPage}
                disabled={page === 1}
                variant="contained"
              >
                Previous
              </Button>
              <Typography>
                Page {page} of {totalPages}
              </Typography>
              <Button
                onClick={handleNextPage}
                disabled={page === totalPages}
                variant="contained"
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
