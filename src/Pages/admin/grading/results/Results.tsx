import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader.tsx";
import { useEffect, useRef } from "react";
import ResultList from "./ResultsList.tsx";
import { useAppDispatch } from "../../../../store/hooks.ts";
import { setPageName } from "../../../../store/app.slice.ts";

const ResultsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Grading System / Results"));
  }, [dispatch]);

  return (
    <Box ref={containerRef} className="content-container">
      <PageHeader />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <ResultList />
      </Box>
    </Box>
  );
};

export default ResultsPage;
