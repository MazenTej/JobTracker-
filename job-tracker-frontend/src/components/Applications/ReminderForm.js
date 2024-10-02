import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  TextField,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import AuthService from "../../services/AuthService";

const ReminderForm = ({ applicationId, fetchReminders }) => {
  const [reminderDate, setReminderDate] = useState("");
  const [reminderType, setReminderType] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const formatDateToBackend = (datetimeLocal) => {
    const date = new Date(datetimeLocal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00";
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = formatDateToBackend(reminderDate);
      const reminder = {
        reminder_date: formattedDate,
        reminder_type: reminderType,
        message,
      };
      await AuthService.addReminderToApplication(applicationId, reminder);
      alert("Reminder added successfully");
      setReminderDate("");
      setReminderType("");
      setMessage("");
      navigate("/dashboard");

      if (fetchReminders) fetchReminders(); // Fetch reminders if provided
    } catch (error) {
      console.error("Error adding reminder:", error);
      alert("Failed to add reminder");
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Reminder Date and Time"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={reminderDate}
          onChange={(e) => setReminderDate(e.target.value)}
          required
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Select
          label="Reminder Type"
          fullWidth
          margin="normal"
          value={reminderType}
          onChange={(e) => setReminderType(e.target.value)}
          required
        >
          <MenuItem value="Follow-up">Follow-up</MenuItem>
          <MenuItem value="Interview">Interview</MenuItem>
        </Select>
        <TextField
          label="Custom Message"
          fullWidth
          margin="normal"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Set Reminder
        </Button>
      </form>
    </Box>
  );
};

export default ReminderForm;
