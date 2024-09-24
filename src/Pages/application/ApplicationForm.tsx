import { Box, SxProps } from "@mui/material";
import { setPageName } from "../../store/app.slice";
import { useAppDispatch } from "../../store/hooks";
import ElementsSideBar from "./ElementsSideBar";
import FormContentArea from "./FormContentArea";
import PropertiesSideBar from "./PropertiesSideBar";

const ApplicationFormPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Application Form"));

  return (
    <Box className="content-container" sx={pageStyles}>
      <ElementsSideBar />
      <FormContentArea />
      <PropertiesSideBar />
    </Box>
  );
};

export default ApplicationFormPage;

const pageStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "300px 1fr 300px",
};
