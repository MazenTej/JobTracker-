import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Box, Grid, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Material-UI close icon
import AuthService from "../services/AuthService";
import StatusTimeline from "./StatusTimeline"; // Assuming StatusTimeline is working

const ApplicationBox = ({ application, handleDelete }) => {
  const handleDeleteReminder = async (reminderId) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        await AuthService.deleteReminder(reminderId);
        alert("Reminder deleted successfully");
        window.location.reload(); // Refresh the page to reflect changes (you may improve this to update state without reload)
      } catch (error) {
        console.error("Error deleting reminder:", error);
        alert("Failed to delete reminder");
      }
    }
  };

  return (
    <Box sx={{ mb: 3, border: "1px solid #ccc", padding: "16px" }}>
      <Grid container spacing={2}>
        {/* Application details and timeline */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6">{application.company}</Typography>
          <Typography>Job Title: {application.job_title}</Typography>
          <Typography>Status: {application.status}</Typography>
          <Typography>Date Applied: {application.date_applied}</Typography>
          <Typography>Notes: {application.notes}</Typography>

          {/* Status Timeline */}
          <StatusTimeline statusHistory={application.status_history || []} />

          {/* Edit and Delete buttons */}
          <Box sx={{ mt: 2 }}>
            <Button
              component={Link}
              to={`/edit-application/${application.id}`}
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(application.id)}
            >
              Delete
            </Button>
          </Box>
        </Grid>

        {/* Display Reminders */}
        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom>
            Reminders
          </Typography>
          {application.reminders && application.reminders.length > 0 ? (
            application.reminders.map((reminder, index) => (
              <Box
                key={index}
                sx={{
                  mt: 2,
                  p: 2,
                  border: "1px solid #ccc",
                  position: "relative",
                }}
              >
                {/* Close button to delete the reminder */}
                <IconButton
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => handleDeleteReminder(reminder.id)}
                >
                  <CloseIcon />
                </IconButton>

                <Typography>Reminder Type: {reminder.reminder_type}</Typography>
                <Typography>
                  Reminder Date:{" "}
                  {new Date(reminder.reminder_date).toLocaleString()}
                </Typography>
                <Typography>Message: {reminder.message}</Typography>
              </Box>
            ))
          ) : (
            <Typography>No reminders set.</Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplicationBox;
