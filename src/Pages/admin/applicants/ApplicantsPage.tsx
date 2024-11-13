import { Box } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch } from "../../../store/hooks";
import PageHeader from "../../../components/PageHeader";
import ApplicantsList from "./components/ApplicantsList";
import { useEffect } from "react";

const ApplicationPage = () => {
  // set page name
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageName("Applicants"));
  }, [dispatch]);

  return (
    <Box className="content-container">
      <PageHeader />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <ApplicantsList />
      </Box>
    </Box>
  );
};

export default ApplicationPage;
