import { Box } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import { useNavigate } from "react-router-dom";
import FormList from "./components/FormList";
import { selectForms, setCurrentForm } from "../../../store/forms.slice";

const ApplicationPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Application Form"));
  const navigate = useNavigate();
  const forms = useAppSelector(selectForms);

  const action = () => {
    dispatch(setCurrentForm(undefined));
    navigate("/applications/form");
  };

  return (
    <Box className="content-container">
      <PageHeader
        button={{
          action: action,
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
        {forms.length ? (
          <FormList />
        ) : (
          <EmptyState
            title="Oops! There’s nothing here!"
            subTitle="Forms will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default ApplicationPage;
