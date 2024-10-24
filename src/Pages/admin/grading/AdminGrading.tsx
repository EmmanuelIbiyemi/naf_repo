import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import GradingSideBar from "./components/gradingSideBar";

const Grading = () => {

  return (
    <Box sx={layoutStyles}>
      <Box>
        <GradingSideBar />
      </Box>
      <Outlet />
    </Box>
  );
};

export default Grading;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "225px 1fr",
  height: "100%",
};
