import { Box, SxProps } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import CoursesSidebar from "./CoursesSidebar";
import { useGetCourseQuery } from "../store/api/courses.api";

function CoursesLayout() {
  const location = useLocation();
  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 2];
  const { data: courses, isLoading } = useGetCourseQuery(parseInt(courseId), {
    skip: !courseId,
  });

  return (
    <Box sx={layoutStyles}>
      {isLoading && <Box></Box>}
      <Box sx={{ gridArea: "sidebar" }}>
        <CoursesSidebar course={courses} />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default CoursesLayout;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateAreas: `
  "sidebar header"
  "sidebar main"
  `,
  gridTemplateColumns: "220px 1fr",
  gridTemplateRows: "100px 1fr",
  minHeight: "100vh",
};
