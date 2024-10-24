import { Box, Button, Typography } from "@mui/material";
import { useRef } from "react";
import TestParticipantsPage from "./TestParticipantsList";
import { AccessTime, CalendarToday } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Students = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                fontSize: "1.5rem",
                lineHeight: "40.32px",
                marginBottom: ".2em",
              }}
            >
              Participants
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "1rem",
                color: "#9A9A9A",
                lineHeight: "20.16px",
                fontWeight: 300,
              }}
            >
              List of students enrolled in the course “Sosososo And So”
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginTop: "1em",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#989898",
                  fontSize: ".9rem",
                  padding: ".6em ",
                  border: "1px solid #D3D3D3",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "5px",
                }}
              >
                Batch 3CO-JVY
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#0CC740",
                  fontSize: ".9rem",
                  padding: ".6em ",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "5px",
                  backgroundColor: "#DDFFE7",
                }}
              >
                Status Completed
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  color: "#989898",
                }}
              >
                <AccessTime />
                <Typography
                  variant="body2"
                  sx={{ color: "#989898", fontSize: ".9rem" }}
                >
                  12:40 PM
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  color: "#989898",
                }}
              >
                <CalendarToday />
                <Typography
                  variant="body2"
                  sx={{ color: "#989898", fontSize: ".9rem" }}
                >
                  03 Jan 2023
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "40%",
            }}
          >
            <Button
              sx={{ width: "100%", backgroundColor: "#CCCCCC", color: "#fff" }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              sx={{ width: "100%" }}
              // onClick={() => navigate("/instructor/reports")}
              variant="contained"
            >
              Generate Report
            </Button>
          </Box>
        </Box>
        <Box sx={{ margin: "2em 0" }}>
          <TestParticipantsPage />
        </Box>
      </Box>
    </Box>
  );
};

export default Students;
