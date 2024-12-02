import { Box, Button, Typography } from "@mui/material";
import { CourseBaseType, CourseType } from "../../../types/courses";
import { useNavigate } from "react-router-dom";
import { useGetCourseParticipantsQuery } from "../../../store/api/participants.api";

type Props = {
  course: CourseBaseType & CourseType;
};

const CoursesCard = ({ course }: Props) => {
  const navigate = useNavigate();

  const { data: participants, isLoading: isFetchingParticipants } =
    useGetCourseParticipantsQuery({ course_id: course?.id || null });

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
      {isFetchingParticipants && <Box></Box>}
      <Typography
        variant="h4"
        sx={{
          fontSize: "1.1rem",
          color: "#3C3C3C",
          lineHeight: "25.2px",
        }}
      >
        {course.name}
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
        Course code: {course.code}
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
        Semester: {course.semester}
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
        Students: {participants?.data.length}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ width: "100%", fontSize: ".8rem" }}
        onClick={() => navigate(`${course.id}/students`, { state: { course } })}
      >
        View Details
      </Button>
    </Box>
  );
};

export default CoursesCard;
