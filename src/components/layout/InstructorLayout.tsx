import { Box, SxProps } from "@mui/material";
import SideBar from "./InstructorSideBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

function InstructorLayout() {
  return (
    <Box sx={layoutStyles}>
      <Box sx={{ gridArea: "sidebar" }}>
        <SideBar />
      </Box>
      <Header />
      <Outlet />
    </Box>
  );
}

export default InstructorLayout;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateAreas: `
  "sidebar header"
  "sidebar main"
  `,
  gridTemplateColumns: "280px 1fr",
  gridTemplateRows: "100px 1fr",
  minHeight: "100vh",
};
