import { Box, SxProps } from "@mui/material";
import SideBar from "./AdminSideBar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { useEffect } from "react";
import { setLastVisitedPage } from "../../store/auth.slice";

function AdminLayout() {
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(setLastVisitedPage(location.pathname));
  }, [location]);

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

export default AdminLayout;

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
