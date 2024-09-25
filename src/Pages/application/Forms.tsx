import { Box } from "@mui/material";
import { setPageName } from "../../store/app.slice";
import { useAppDispatch } from "../../store/hooks";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormList from "./components/FormList";

type FormType = {
  id: number;
  last_edited: string;
  name: string;
  submissions: number;
};

const ApplicationPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Application Form"));
  const navigate = useNavigate();
  const [forms] = useState<FormType[]>([
    {
      id: 1,
      last_edited: "Last edited on Aug 11, 2024",
      name: "Application Form HND 24/25",
      submissions: 100,
    },
    {
      id: 2,
      last_edited: "Last edited on Aug 11, 2024",
      name: "Application Form HND 24/25",
      submissions: 100,
    },
    {
      id: 3,
      last_edited: "Last edited on Aug 11, 2024",
      name: "Application Form HND 24/25",
      submissions: 100,
    },
  ]);

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
