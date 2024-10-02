import React from "react";
import { Box, Typography } from "@mui/material";

// Color mapping for each status
const statusColors = {
  Applied: "blue",
  Interviewing: "orange",
  Offered: "green",
  Rejected: "red",
};
const StatusTimeline = ({ statusHistory = [] }) => {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h6">Status Timeline</Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {statusHistory.length > 0 ? (
          statusHistory.map((history, index) => (
            <Box key={index} sx={{ mr: 2, textAlign: "center" }}>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: statusColors[history.status],
                  borderRadius: "50%",
                  marginBottom: "5px",
                }}
              />
              <Typography variant="body2">{history.date_changed}</Typography>
              <Typography variant="body2">{history.status}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No status updates yet.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default StatusTimeline;
