import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";

const Academics = () => {
  return (
    <Box sx={layoutStyles}>
      <Outlet />
    </Box>
  );
};

export default Academics;

const layoutStyles: SxProps = {
  height: "100%",
};
