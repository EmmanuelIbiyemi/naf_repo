import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function CoursesLayout() {
  return (
    <Box>
      <Box sx={{ gridArea: "sidebar" }}></Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default CoursesLayout;
