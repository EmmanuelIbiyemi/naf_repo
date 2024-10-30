import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { useEffect } from "react";

const Academics = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Academics"));
  }, []);

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
