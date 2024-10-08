import { Box, Button, Typography } from "@mui/material";
import { CourseContents } from "../../../types/courses";
import { AccessTime, CalendarToday } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type Props = {
  course: CourseContents;
};

const CoursesCard = ({ course }: Props) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        padding: "1em",
        border: "1px solid #E6E6E6",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: 1,
        borderRadius: "5px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: "1.1rem",
          color: "#3C3C3C",
          lineHeight: "25.2px",
        }}
      >
        {course.topic}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: ".9rem",
          color: "#9A9A9A",
          lineHeight: "20.16px",
          fontWeight: 300,
        }}
      >
        Course: {course.course}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: ".9rem",
          color: "#9A9A9A",
          lineHeight: "20.16px",
          fontWeight: 300,
        }}
      >
        Subject: {course.subject}
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: ".8rem",
            color: "#3C3C3C",
            lineHeight: "20.16px",
            fontWeight: 300,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CalendarToday /> {course.days}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: ".8rem",
            color: "#3C3C3C",
            lineHeight: "20.16px",
            fontWeight: 300,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AccessTime /> {course.time}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontSize: ".9rem",
          color: "#9A9A9A",
          lineHeight: "20.16px",
          fontWeight: 300,
        }}
      >
        Students: {course.num_of_students}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ width: "100%", fontSize: ".8rem" }}
        onClick={() => navigate(`${course.id}`)}
      >
        View Details
      </Button>
    </Box>
  );
};

export default CoursesCard;
