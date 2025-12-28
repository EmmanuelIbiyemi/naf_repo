import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
  Modal,
  Stack,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Chip,
  LinearProgress,
} from "@mui/material";
import { 
  AccessTime, 
  Assignment, 
  Close, 
  NavigateNext, 
  NavigateBefore,
  CheckCircle,
} from "@mui/icons-material";
import {
  useSubmitQuizMutation,
  useSubmitSingleQuizMutation,
  useUnlockQuizMutation,
} from "../../../store/api/quizzes.api";
import {
  Option,
  Question,
  QuizResponse1,
} from "../../../types/quizzes";
import { useAppSelector } from "../../../store/hooks";
import { selectCurrentUser } from "../../../store/auth.slice";

interface TimerProps {
  duration: number;
  onTimeUp: () => void; // Changed from {} to void
  onTick: (timeLeft: number) => void; // Changed from string to function type
}

const Timer = ({ duration, onTimeUp, onTick }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  // Changed from null to NodeJS.Timeout
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Initial setup of timer
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        // Call onTick with the new time value
        if (newTime >= 0) {
          onTick(newTime);
        }
        return newTime;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, onTimeUp, onTick]); // Added back dependencies

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "primary.main",
        py: 1,
      }}
    >
      <AccessTime fontSize="small" />
      <Typography variant="h6" component="span">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </Typography>
    </Box>
  );
};

const QuizInfoModal = ({
  quiz,
  open,
  onClose,
  onStart,
}: {
  quiz?: QuizResponse1["data"]["quiz"];
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}) => {
  if (!quiz) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          sx={{ position: "absolute", right: 8, top: 8 }}
          onClick={onClose}
        >
          <Close />
        </IconButton>

        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {quiz.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {quiz.instructions}
            </Typography>
          </Box>

          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTime color="primary" />
              <Typography>Duration: {quiz.time_allowed} minutes</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment color="primary" />
              <Typography>
                Total Score: {quiz.obtainable_score} points
              </Typography>
            </Box>
          </Stack>

          <Alert severity="warning">
            <AlertTitle>Important Notice</AlertTitle>
            - The timer will start immediately after clicking "Start Quiz"
            <br />
            - You cannot pause or restart the quiz once started
            <br />
            - Ensure you have a stable internet connection
            <br />- Do not refresh or close the browser window
          </Alert>

          <Button variant="contained" size="large" fullWidth onClick={onStart}>
            Start Quiz
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

interface SubmitConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SubmitConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
}: SubmitConfirmationDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Submit Quiz?</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to submit your quiz? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} variant="contained" color="primary">
        Submit Quiz
      </Button>
    </DialogActions>
  </Dialog>
);

const CBTTest = () => {
  const { quizCode } = useParams<{ quizCode: string }>();
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitAllQuiz] = useSubmitQuizMutation();
  const [submitSingleQuiz] = useSubmitSingleQuizMutation();
  const [unlockQuiz, { data: quizData, isLoading, error }] =
    useUnlockQuizMutation();

  const user = useAppSelector(selectCurrentUser);

  // Add effect to unlock quiz when component mounts
  useEffect(() => {
    if (quizCode) {
      unlockQuiz({
        quiz_code: quizCode,
        email: user?.email || "", // You'll need to get this from your auth context or user state
      });
    }
  }, [quizCode, unlockQuiz, user?.email]);

  const handleTimeTick = useCallback((newTimeLeft: number) => {
    setTimeLeft(newTimeLeft);
  }, []);

  const handleStartQuiz = () => {
    setShowInfoModal(false);
    setQuizStarted(true);
    if (quizData?.data) {
      setTimeLeft(quizData.data.time_allowed * 60);
    }
  };

  const handleAnswerChange =
    (questionId: number) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const optionId = parseInt(event.target.value);

      try {
        setAnswers((prev) => ({
          ...prev,
          [questionId]: optionId,
        }));

        await submitSingleQuiz({
          quiz_id: quizData?.data.quiz.id || 0,
          option_id: optionId,
          time_left: timeLeft,
        }).unwrap();
      } catch (error) {
        console.error("Failed to submit answer:", error);
        setAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[questionId];
          return newAnswers;
        });
      }
    };

  const handleQuestionClick = (questionIndex: number) => {
    setCurrentQuestionIndex(questionIndex);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = useCallback(async () => {
    try {
      setSubmitting(true);

      const quiz = quizData?.data.quiz;
      const questions = quiz?.assessments[0].questions;

      const unansweredCount = (questions?.length || 0) - Object.keys(answers).length;
      if (unansweredCount > 0) {
        throw new Error(
          `Please answer all questions. ${unansweredCount} questions remaining.`
        );
      }

      const orderedOptionIds = questions?.map((question) =>
        Number(answers[question.id])
      );

      const submissionData = {
        quiz_id: quiz?.id || 0,
        option_ids: orderedOptionIds || [],
        time_left: timeLeft,
      };

      const response = await submitAllQuiz(submissionData).unwrap();

      if (response.status === "success") {
        navigate(`/student/cbt-result/${quiz?.id}`);
      } else {
        throw new Error(response.message || "Failed to submit quiz");
      }
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setSubmitting(false);
    }
  }, [answers, quizData, timeLeft, navigate, submitAllQuiz]);

  const handleTimeUp = useCallback(() => {
    handleSubmitQuiz();
  }, [handleSubmitQuiz]);

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
          Failed to load quiz. Please try again later.
        </Alert>
      </Box>
    );
  }

  const quiz = quizData?.data.quiz;
  const questions = quiz?.assessments[0].questions as Question[];
  const currentQuestion = questions?.[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = questions ? (answeredCount / questions.length) * 100 : 0;

  return (
    <Box sx={{ p: 2, maxWidth: 1200, mx: "auto" }}>
      <QuizInfoModal
        quiz={quiz}
        open={showInfoModal}
        onClose={() => navigate(-1)}
        onStart={handleStartQuiz}
      />

      {quizStarted && currentQuestion && (
        <>
          {/* Header with Timer */}
          <Paper
            elevation={2}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="h6" component="h1" sx={{ fontWeight: 600 }}>
                {quiz?.name}
              </Typography>
              <Timer
                duration={quiz?.time_allowed || 60}
                onTimeUp={handleTimeUp}
                onTick={handleTimeTick}
              />
            </Box>
            
            {/* Progress Bar */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress: {answeredCount} of {questions?.length} answered
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(progress)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          </Paper>

          {/* Question Navigation Grid */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
              Question Navigator
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {questions?.map((question, index) => (
                <Chip
                  key={question.id}
                  label={index + 1}
                  onClick={() => handleQuestionClick(index)}
                  color={currentQuestionIndex === index ? "primary" : "default"}
                  variant={currentQuestionIndex === index ? "filled" : "outlined"}
                  icon={answers[question.id] ? <CheckCircle /> : undefined}
                  sx={{
                    fontWeight: currentQuestionIndex === index ? 600 : 400,
                    bgcolor: answers[question.id] && currentQuestionIndex !== index ? "success.light" : undefined,
                    color: answers[question.id] && currentQuestionIndex !== index ? "success.dark" : undefined,
                    borderColor: answers[question.id] && currentQuestionIndex !== index ? "success.main" : undefined,
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Current Question Card */}
          <Card
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="overline" 
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                Question {currentQuestionIndex + 1} of {questions?.length}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ mt: 1, mb: 3, fontWeight: 500, lineHeight: 1.5 }}
              >
                {currentQuestion.body}
              </Typography>
            </Box>

            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ""}
              onChange={handleAnswerChange(currentQuestion.id)}
              sx={{ flexGrow: 1 }}
            >
              {currentQuestion.options.map((option: Option, index: number) => (
                <FormControlLabel
                  key={option.id}
                  value={option.id.toString()}
                  control={<Radio />}
                  label={
                    <Box sx={{ py: 1 }}>
                      <Typography variant="body1">
                        <strong>{String.fromCharCode(65 + index)}.</strong> {option.body}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mb: 1,
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: answers[currentQuestion.id] === option.id ? "primary.main" : "divider",
                    bgcolor: answers[currentQuestion.id] === option.id ? "primary.lighter" : "transparent",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </Card>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 3,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              startIcon={<NavigateBefore />}
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              sx={{ minWidth: 120 }}
            >
              Previous
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  variant="contained"
                  size="large"
                  color="success"
                  onClick={() => setShowSubmitDialog(true)}
                  disabled={submitting}
                  sx={{ minWidth: 150, fontWeight: 600 }}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<NavigateNext />}
                  onClick={handleNextQuestion}
                  sx={{ minWidth: 120 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </>
      )}

      <SubmitConfirmationDialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmitQuiz}
      />
    </Box>
  );
};

export default CBTTest;
