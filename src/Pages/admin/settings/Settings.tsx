import { Box, SxProps } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import SettingsSideBar from "./components/SettingsSideBar";

const Settings = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Settings"));

  return (
    <Box sx={layoutStyles}>
      <Box>
        <SettingsSideBar />
      </Box>
      <Outlet />
    </Box>
  );
};

export default Settings;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "225px 1fr",
  height: "100%",
};
