import { Box } from "@mui/material";
import { setPageName } from "../../store/app.slice";
import { useAppDispatch } from "../../store/hooks";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import { useNavigate } from "react-router-dom";

const ApplicationPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Application Form"));

  const navigate = useNavigate();

  return (
    <Box className="content-container">
      <PageHeader
        button={{
          action: () => navigate("/applications/form"),
          text: "Create",
        }}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <EmptyState
          title="Oops! There’s nothing here!"
          subTitle="Forms will appear here after you add them in your school."
        />
      </Box>
    </Box>
  );
};

export default ApplicationPage;
