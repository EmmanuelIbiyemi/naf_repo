import { Box, Typography } from "@mui/material";
import { useRef } from "react";
import CoursesParticipantsTable from "./CoursesParticipantsTable";
import { useGetCourseQuery } from "../../../store/api/courses.api";

const Students = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 2];
  const { data: course } = useGetCourseQuery(parseInt(courseId));

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
            List of students enrolled in the course “{course?.data.name}”
          </Typography>
        </Box>
        <Box sx={{ margin: "2em 0" }}>
          <CoursesParticipantsTable />
        </Box>
      </Box>
    </Box>
  );
};

export default Students;
