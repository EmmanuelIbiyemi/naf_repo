import { useParams } from "react-router-dom";
import { useGetQuizResultQuery } from "../../../store/api/quizzes.api";
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  Stack,
  Alert,
  AlertTitle,
  Button,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import {
  CheckCircleOutline,
  Cancel,
  EmojiEvents,
  Assignment,
} from "@mui/icons-material";
import { ReactNode } from "react";

type ScoreCircleProps = {
  score: number;
  total: number;
};

const ScoreCircle = ({ score, total }: ScoreCircleProps) => {
  const percentage = (score / total) * 100;
  const color =
    percentage >= 70 ? "success" : percentage >= 50 ? "warning" : "error";

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: 200,
        height: 200,
      }}
    >
      <CircularProgress
        variant="determinate"
        value={percentage}
        size={200}
        thickness={4}
        color={color}
      />
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" component="div" color={`${color}.main`}>
          {score}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          out of {total}
        </Typography>
      </Box>
    </Box>
  );
};
type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  color: string;
};
const StatCard = ({ icon, title, value, color }: StatCardProps) => (
  <Paper
    elevation={2}
    sx={{
      p: 2,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <Box sx={{ color: `${color}.main`, mb: 1 }}>{icon}</Box>
    <Typography variant="h6" gutterBottom>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Paper>
);

const QuizResult = () => {
  const { quizId } = useParams();
  const {
    data: resultData,
    isLoading,
    error,
  } = useGetQuizResultQuery(Number(quizId));

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Failed to load quiz results. Please try again later.
        </Alert>
      </Box>
    );
  }

  const score = resultData?.data.result[0].right || 0;
  const wrong = resultData?.data.result[0].wrong || 0;
  const total = score + wrong;
  const percentage = (score / total) * 100;
  const passStatus = percentage >= 70;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Card sx={{ p: 4 }}>
        <Stack spacing={4} alignItems="center">
          {/* Status Alert */}
          <Alert
            severity={passStatus ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            <AlertTitle>
              {passStatus ? "Congratulations!" : "Keep Practicing!"}
            </AlertTitle>
            {passStatus
              ? "You have successfully passed this quiz!"
              : "You didn't meet the passing score this time. Review and try again!"}
          </Alert>

          {/* Score Circle */}
          <ScoreCircle score={score} total={total} />

          {/* Stats Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<CheckCircleOutline fontSize="large" />}
                title="Correct Answers"
                value={String(score)}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Cancel fontSize="large" />}
                title="Wrong Answers"
                value={String(wrong)}
                color="error"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<EmojiEvents fontSize="large" />}
                title="Score Percentage"
                value={`${percentage.toFixed(1)}%`}
                color={passStatus ? "success" : "warning"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<Assignment fontSize="large" />}
                title="Total Questions"
                value={String(total)}
                color="info"
              />
            </Grid>
          </Grid>

          <Divider sx={{ width: "100%" }} />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={() => window.history.back()}>
              Back to Quizzes
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export default QuizResult;
