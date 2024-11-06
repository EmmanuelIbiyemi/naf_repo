import { Box } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import { useEffect } from "react";
import ResultsList from "./ResultsList";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";

const ResultsPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Results"));
  }, []);

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
        <ResultsList />
      </Box>
    </Box>
  );
};

export default ResultsPage;
