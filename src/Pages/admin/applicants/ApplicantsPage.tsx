import { Box } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch } from "../../../store/hooks";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import ApplicantsList from "./components/ApplicantsList";
import { useGetApplicantsQuery } from "../../../store/api/applicants.api";
import LoadingScreen from "../../../components/LoadingScreen";

const ApplicationPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Applicants"));

  const { data: applicants, isLoading } = useGetApplicantsQuery(null);

  return (
    <Box className="content-container">
      {[isLoading].some((item) => item) ? (
        <Box sx={{ position: "relative", zIndex: 2000 }}>
          <LoadingScreen />
        </Box>
      ) : null}

      <PageHeader />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        {applicants?.data.length ? (
          <ApplicantsList />
        ) : (
          <EmptyState
            title="Oops! There’s nothing here!"
            subTitle="Applicants will appear here."
          />
        )}
      </Box>
    </Box>
  );
};

export default ApplicationPage;
