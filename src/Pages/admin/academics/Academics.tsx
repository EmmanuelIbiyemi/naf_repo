import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { useEffect } from "react";
import AcademicsSideBar from "./components/AcademicsSideBar";
// import AcademicsSideBar from "./components/AcademicsSideBar";

const Academics = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Academics"));
  }, []);

  return (
    <Box sx={layoutStyles}>
      <Box>
        <AcademicsSideBar />
      </Box>
      <Outlet />
    </Box>
  );
};

export default Academics;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "225px 1fr",
  height: "100%",
};
