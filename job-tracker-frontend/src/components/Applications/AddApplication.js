import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AuthService from "../../services/AuthService";
import ReminderForm from "./ReminderForm"; // Import ReminderForm component

const AddApplication = () => {
  const navigate = useNavigate();

  const [application, setApplication] = useState({
    company: "",
    jobTitle: "",
    statusTimeline: [], // Initialize status timeline
    notes: "",
  });

  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleStatusChange = (index, field, value) => {
    const updatedTimeline = [...application.statusTimeline];
    updatedTimeline[index] = { ...updatedTimeline[index], [field]: value };
    setApplication({ ...application, statusTimeline: updatedTimeline });
  };

  const handleAddStatus = () => {
    setApplication({
      ...application,
      statusTimeline: [
        ...application.statusTimeline,
        { status: "", date_changed: "" },
      ],
    });
  };

  const handleRemoveStatus = (index) => {
    const updatedTimeline = application.statusTimeline.filter(
      (_, i) => i !== index
    );
    setApplication({ ...application, statusTimeline: updatedTimeline });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any status in the timeline is not selected
    const hasEmptyStatus = application.statusTimeline.some(
      (entry) => !entry.status
    );

    if (hasEmptyStatus) {
      setErrorMessage("Please select a status for each timeline entry.");
      return;
    }

    try {
      const user_id = localStorage.getItem("user_id");
      const newApplication = { ...application, user_id };
      await AuthService.addApplication(newApplication);
      alert("Application added successfully");
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add application";
      setErrorMessage(message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Add New Job Application
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Display the error message */}
          {errorMessage && (
            <Typography color="error" gutterBottom>
              {errorMessage}
            </Typography>
          )}

          <TextField
            label="Company"
            variant="outlined"
            fullWidth
            margin="normal"
            value={application.company}
            onChange={(e) =>
              setApplication({ ...application, company: e.target.value })
            }
            required
          />
          <TextField
            label="Job Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={application.jobTitle}
            onChange={(e) =>
              setApplication({ ...application, jobTitle: e.target.value })
            }
            required
          />

          <Typography variant="h6" gutterBottom>
            Status Timeline
          </Typography>

          {/* Render status timeline */}
          {application.statusTimeline.map((statusEntry, index) => (
            <Box
              key={index}
              sx={{ mb: 3, display: "flex", alignItems: "center" }}
            >
              <FormControl fullWidth margin="normal" sx={{ flex: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusEntry.status}
                  onChange={(e) =>
                    handleStatusChange(index, "status", e.target.value)
                  }
                  label="Status"
                >
                  <MenuItem value="Applied">Applied</MenuItem>
                  <MenuItem value="Interviewing">Interviewing</MenuItem>
                  <MenuItem value="Offered">Offered</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Date"
                type="date"
                variant="outlined"
                sx={{ ml: 2, flex: 1 }}
                value={statusEntry.date_changed}
                onChange={(e) =>
                  handleStatusChange(index, "date_changed", e.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
                onClick={() => handleRemoveStatus(index)}
              >
                Remove
              </Button>
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStatus}
            sx={{ mb: 2 }}
          >
            Add Status
          </Button>

          <TextField
            label="Notes"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={application.notes}
            onChange={(e) =>
              setApplication({ ...application, notes: e.target.value })
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Application
          </Button>
        </form>

        {/* Reminder Form */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Set Reminder
        </Typography>
        <ReminderForm applicationId={application.id} />

        {/* Back to Dashboard Button */}
        <Button
          component={Link}
          to="/dashboard"
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default AddApplication;
