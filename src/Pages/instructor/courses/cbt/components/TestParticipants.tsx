import { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AccessTime,
  ArrowBack,
  CalendarToday,
  CheckCircle,
  ContentCopy,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import TestParticipantsList from "./TestParticipantsList";
import { useGetSingleInstructorQuizQuery } from "../../../../../store/api/quizzes.api";
import EmptyState from "../../../../../components/EmptyState";
import { useAppDispatch } from "../../../../../store/hooks";
import { setPageLoading } from "../../../../../store/app.slice";

const Students = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { quiz_id } = useParams();
  const [copiedCode, setCopiedCode] = useState(false);
  const dispatch = useAppDispatch();

  const { data: quizData, isLoading } = useGetSingleInstructorQuizQuery({
    quiz_id: +(quiz_id || 0),
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isLoading, dispatch]);

  if (!quizData) {
    return <EmptyState title={"Quiz data does not exist"} subTitle={""} />;
  }
  const handleCodeCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Box ref={containerRef} className="content-container">
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                fontSize: "1.5rem",
                lineHeight: "40.32px",
                marginBottom: ".2em",
              }}
            >
              Participants
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "1rem",
                color: "#9A9A9A",
                lineHeight: "20.16px",
                fontWeight: 300,
              }}
            >
              List of students that are participating in the test "
              {quizData?.data.name}"
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                marginTop: "1em",
                cursor: "pointer",
                "&:hover": {
                  color: "#7c7c7c",
                },
              }}
              onClick={() => handleCodeCopy(quizData.data.code)}
            >
              <Typography variant="body2" sx={{ color: "#9A9A9A" }}>
                Code to access CBT: "{quizData?.data.code}"
              </Typography>
              <Tooltip
                title={copiedCode ? "Copied!" : "Click to copy"}
                placement="right"
                arrow
              >
                <Box>
                  {copiedCode ? (
                    <CheckCircle sx={{ color: "green" }} />
                  ) : (
                    <ContentCopy sx={{ color: "#9A9A9A" }} />
                  )}
                </Box>
              </Tooltip>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginTop: "1em",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  color: "#989898",
                }}
              >
                <AccessTime />
                <Typography
                  variant="body2"
                  sx={{ color: "#989898", fontSize: ".9rem" }}
                >
                  {quizData?.data.start_date.split("T")[0]}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  color: "#989898",
                }}
              >
                <CalendarToday />
                <Typography
                  variant="body2"
                  sx={{ color: "#989898", fontSize: ".9rem" }}
                >
                  {quizData?.data.expiry_date.split("T")[0]}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <Button
              onClick={() => navigate(-1)}
              variant="outlined"
              sx={{ paddingLeft: ".5rem" }}
            >
              <ArrowBack sx={{ marginRight: ".4rem" }} /> Back
            </Button>
          </Box>
        </Box>
        <Box sx={{ margin: "2em 0" }}>
          <TestParticipantsList
            participants={quizData.data.participants || []}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Students;
