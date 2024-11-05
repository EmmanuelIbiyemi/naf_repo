import { Box, Button, Typography } from "@mui/material";
import { useRef } from "react";
import { AccessTime, CalendarToday } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizzesResponse } from "../../../../types/quizzes";
import TestParticipantsList from "./TestParticipantsList";

const Students = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTest = location.state?.selectedTest as
    | QuizzesResponse
    | undefined;

  console.log(selectedTest);

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
              List of students that submitted the test "{selectedTest?.name}"
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginTop: "1em",
              }}
            >
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
                  {selectedTest?.start_date.split("T")[0]}
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
                  {selectedTest?.expiry_date.split("T")[0]}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Button
              sx={{ width: "100%", backgroundColor: "#CCCCCC", color: "#fff" }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Box>
        </Box>
        <Box sx={{ margin: "2em 0" }}>
          <TestParticipantsList
            participants={selectedTest?.participants || []}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Students;
