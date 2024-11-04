import { Box, Grid2, LinearProgress, Typography } from "@mui/material";
import { useRef } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import CoursesCard from "./CoursesCard";
import { useGetInstructorCoursesQuery } from "../../../store/api/courses.api";

const Courses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: courses, isLoading } = useGetInstructorCoursesQuery(null);

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
        <Box sx={{ width: "100%" }}>
          <Typography variant="h3" sx={{ fontSize: "2em", color: "#000000" }}>
            Assigned Courses
          </Typography>
          <Box sx={{ marginTop: "3em" }}>
            {isLoading && <LinearProgress />}
            <Grid2 container spacing={2}>
              {courses?.data.map((course) => (
                <Grid2 size={4} key={course.id}>
                  <CoursesCard course={course} />
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Courses;
