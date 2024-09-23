import { Box, SxProps } from "@mui/material";
import { setPageName } from "../../store/app.slice";
import { useAppDispatch } from "../../store/hooks";
import ElementsSideBar from "./ElementsSideBar";

const ApplicationFormPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Application Form"));

  return (
    <Box className="content-container" sx={pageStyles}>
      <ElementsSideBar />
    </Box>
  );
};

export default ApplicationFormPage;

const pageStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "300px 100% 300px",
};
