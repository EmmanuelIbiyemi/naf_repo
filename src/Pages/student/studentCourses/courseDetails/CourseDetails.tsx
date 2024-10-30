import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import { useEffect } from "react";
import CourseDetailSideBar from "./CourseDetailSideBar";

const CourseDetails = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Course Details"));
  }, []);

  return (
    <Box sx={layoutStyles}>
      <Box>
        <CourseDetailSideBar />
      </Box>
      <Outlet />
    </Box>
  );
};

export default CourseDetails;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "225px 1fr",
  height: "100%",
};
