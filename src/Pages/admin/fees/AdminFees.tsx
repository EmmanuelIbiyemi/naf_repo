import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import FeesSideBar from "./components/feesSideBar";

const Fees = () => {

  return (
    <Box sx={layoutStyles}>
      <Box>
        <FeesSideBar />
      </Box>
      <Outlet />
    </Box>
  );
};

export default Fees;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "225px 1fr",
  height: "100%",
};
