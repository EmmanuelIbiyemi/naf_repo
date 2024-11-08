import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import UsersSideBar from "./components/UsersSideBar";

const Users = () => {
  return (
    <Box sx={layoutStyles}>
      <Box sx={{ height: "100%" }}>
        <UsersSideBar />
      </Box>
      <Outlet />
    </Box>
  );
};

export default Users;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "225px 1fr",
  height: "100%",
};
