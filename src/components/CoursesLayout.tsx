import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import CoursesSidebar from "./CoursesSidebar";

function CoursesLayout() {
  return (
    <Box sx={layoutStyles}>
      <Box sx={{ gridArea: "sidebar" }}>
        <CoursesSidebar />
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
