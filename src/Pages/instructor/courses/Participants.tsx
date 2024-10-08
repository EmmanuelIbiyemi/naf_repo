import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import CoursesTable from "./CoursesTable";

const Students = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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
              fontWeight: 500,
              fontSize: "1.5rem",
              lineHeight: "40.32px",
              marginBottom: ".2em",
            }}
          >
            Students
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
        </Box>
        <Box sx={{ margin: "2em 0" }}>
          <CoursesTable />
        </Box>
      </Box>
    </Box>
  );
};

export default Students;
