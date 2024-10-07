import { Box, Grid2, Typography } from "@mui/material";
import { useRef } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import CoursesCard from "./CoursesCard";

const Courses = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Courses"));

  return (
    <Box ref={containerRef} className="content-container">
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          padding: "var(--padding)",
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontSize: "2em", color: "#000000" }}>
            Assigned Courses
          </Typography>
          <Box sx={{ marginTop: "3em" }}>
            <Grid2 container spacing={2}>
              {courseCardContent.map((item) => (
                <Grid2 size={4} key={item.id}>
                  <CoursesCard
                    course={{
                      id: item.id,
                      topic: item.topic,
                      subject: item.subject,
                      course: item.course,
                      days: item.days,
                      time: item.time,
                      num_of_students: item.num_of_students,
                    }}
                  />
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const courseCardContent = [
  {
    id: 1,
    topic: "Articulate structure of C++ and Java in Semester 1",
    subject: "Network Engineering",
    course: "B.Tech Specialization in Health Informatics",
    days: "Mon - Thur",
    time: "12:30 AM - 01:40 PM",
    num_of_students: 120,
  },
  {
    id: 2,
    topic: "Articulate structure of C++ and Java in Semester 1",
    subject: "Network Engineering",
    course: "B.Tech Specialization in Health Informatics",
    days: "Mon - Thur",
    time: "12:30 AM - 01:40 PM",
    num_of_students: 120,
  },
  {
    id: 3,
    topic: "Articulate structure of C++ and Java in Semester 1",
    subject: "Network Engineering",
    course: "B.Tech Specialization in Health Informatics",
    days: "Mon - Thur",
    time: "12:30 AM - 01:40 PM",
    num_of_students: 120,
  },
  {
    id: 4,
    topic: "Articulate structure of C++ and Java in Semester 1",
    subject: "Network Engineering",
    course: "B.Tech Specialization in Health Informatics",
    days: "Mon - Thur",
    time: "12:30 AM - 01:40 PM",
    num_of_students: 120,
  },
  {
    id: 5,
    topic: "Articulate structure of C++ and Java in Semester 1",
    subject: "Network Engineering",
    course: "B.Tech Specialization in Health Informatics",
    days: "Mon - Thur",
    time: "12:30 AM - 01:40 PM",
    num_of_students: 120,
  },
];

export default Courses;
