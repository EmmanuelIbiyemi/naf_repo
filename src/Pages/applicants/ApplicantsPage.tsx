import { Box } from "@mui/material";
import { setPageName } from "../../store/app.slice";
import { useAppDispatch } from "../../store/hooks";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import { useState } from "react";
import ApplicantsList from "./components/ApplicantsList";
import { ApplicantType } from "../../types/applicants";

const ApplicationPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Applicants"));
  const [applicants] = useState<ApplicantType[]>([
    {
      id: 1,
      name: "Application Form HND 24/25",
      email: "user@email.com",
      phone: "09012345678",
      status: "accepted",
    },
    {
      id: 2,
      name: "Application Form HND 24/25",
      email: "user@email.com",
      phone: "09012345678",
      status: "accepted",
    },
    {
      id: 3,
      name: "Application Form HND 24/25",
      email: "user@email.com",
      phone: "09012345678",
      status: "accepted",
    },
  ]);

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
        {applicants.length ? (
          <ApplicantsList />
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
