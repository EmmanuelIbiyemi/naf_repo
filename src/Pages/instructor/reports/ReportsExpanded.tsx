import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import TestParticipantsList from "../courses/cbt/TestParticipantsList";

const ReportsExpanded = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  console.log(location.state);

  return (
    <Box ref={containerRef} className="content-container">
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: "#3C3C3C",
              fontSize: "1.5rem",
              marginBottom: ".7em",
              fontWeight: 600,
            }}
          >
            Cumulative Report on Computer Course
          </Typography>
          <Box>
            <Typography
              variant="h4"
              sx={{ color: "#6A6A6A", fontSize: ".8rem" }}
            >
              Date Generated : 25/10 • Last Modified : 25/10
            </Typography>
          </Box>
        </Box>
        <Box sx={{ marginTop: "2em", height: "20em" }}>
          <Typography
            variant="h4"
            sx={{ color: "#6A6A6A", fontSize: "1rem", marginBottom: "2em" }}
          >
            Below are the students performance on the Computer course CBT Quiz
          </Typography>
          <TestParticipantsList />
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsExpanded;
