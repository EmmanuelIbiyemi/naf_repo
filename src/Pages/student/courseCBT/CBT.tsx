import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  AccessTime,
  Assignment,
  Close,
} from '@mui/icons-material';
import { 
  useGetSingleQuizQuery, 
  useSubmitQuizMutation,
  useSubmitSingleQuizMutation 
} from '../../../store/api/quizzes.api';
import QuestionSummaryGrid from './CBTSummary';

const Timer = ({ duration, onTimeUp, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    // Initial setup of timer
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        // Call onTick after state update, in the next render cycle
        if (newTime >= 0) {
          // Use requestAnimationFrame to ensure we're not updating state during render
          requestAnimationFrame(() => onTick(newTime));
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
  }, [onTimeUp]); // Remove timeLeft and onTick from dependencies

    // Separate effect for handling time up
  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      color: 'primary.main',
      py: 1,
    }}>
      <AccessTime fontSize="small" />
      <Typography variant="h6" component="span">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Typography>
    </Box>
  );
};

const QuizInfoModal = ({ quiz, open, onClose, onStart }) => {
  if (!quiz) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 500,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="primary" />
              <Typography>Duration: {quiz.time_allowed} minutes</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Assignment color="primary" />
              <Typography>Total Score: {quiz.obtainable_score} points</Typography>
            </Box>
          </Stack>

          <Alert severity="warning">
            <AlertTitle>Important Notice</AlertTitle>
            - The timer will start immediately after clicking "Start Quiz"<br />
            - You cannot pause or restart the quiz once started<br />
            - Ensure you have a stable internet connection<br />
            - Do not refresh or close the browser window
          </Alert>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onStart}
          >
            Start Quiz
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

const SubmitConfirmationDialog = ({ open, onClose, onConfirm }) => (
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
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitAllQuiz] = useSubmitQuizMutation();
  const [submitSingleQuiz] = useSubmitSingleQuizMutation();
  const { data: quizData, isLoading, error } = useGetSingleQuizQuery(quizId);

  const handleTimeUp = useCallback(() => {
    handleSubmitQuiz();
  }, []);

  const handleTimeTick = useCallback((newTimeLeft) => {
    setTimeLeft(newTimeLeft);
  }, []);

  const handleStartQuiz = () => {
    setShowInfoModal(false);
    setQuizStarted(true);
    if (quizData?.data) {
      setTimeLeft(quizData.data.time_allowed * 60);
    }
  };

  const handleAnswerChange = (questionId) => async (event) => {
    const optionId = parseInt(event.target.value);
    
    try {
      // Update local state first for immediate UI feedback
      setAnswers(prev => ({
        ...prev,
        [questionId]: optionId
      }));

      // Submit the single answer
      const response = await submitSingleQuiz({
        quiz_id: Number(quizId),
        option_id: optionId,
        time_left: timeLeft
      }).unwrap();

      // Optional: Handle the response if needed
      console.log('Answer submitted successfully:', response);
    } catch (error) {
      // Handle error - maybe show an alert
      console.error('Failed to submit answer:', error);
      // Optionally revert the local state if submission failed
      setAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      });
    }
  };

  const handleQuestionClick = (questionId) => {
    const questionElement = document.getElementById(`question-${questionId}`);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmitQuiz = async () => {
  try {
    setSubmitting(true);
    
    const questions = quiz?.assessments?.[0]?.questions || [];
    
    // Check if all questions are answered
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      // You can show this in your UI
      throw new Error(`Please answer all questions. ${unansweredCount} questions remaining.`);
    }

    const orderedOptionIds = questions.map(question => 
      Number(answers[question.id])
    );

    const submissionData = {
      quiz_id: Number(quizId),
      option_ids: orderedOptionIds,
      time_left: timeLeft
    };

    const response = await submitAllQuiz(submissionData).unwrap();
    
    if (response.status === "success") {
      navigate(`/student/cbt-result/${quizId}`);
    } else {
      throw new Error(response.message || 'Failed to submit quiz');
    }
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    // Show error to user
  } finally {
    setSubmitting(false);
  }
};
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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

  const quiz  = quizData?.data;
  const questions = quizData?.data.assessments?.[0]?.questions || [];

  return (
    <Box sx={{ p: 2, maxWidth: 1800, mx: 'auto' }}>
      <QuizInfoModal
        quiz={quiz}
        open={showInfoModal}
        onClose={() => navigate(-1)}
        onStart={handleStartQuiz}
      />

      {quizStarted && (
        <>
          <Paper 
            elevation={1}
            sx={{
              position: "sticky",
              width: "100%",
              mb: 2,
              p: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
              }}>
                <Typography variant="h5" component="h1">
                  {quiz.name}
                </Typography>
                <Timer
                  duration={quiz.time_allowed}
                  onTimeUp={handleTimeUp}
                  onTick={handleTimeTick}
                />
              </Box>
              <QuestionSummaryGrid 
                questions={questions}
                answers={answers}
                onQuestionClick={handleQuestionClick}
              />
            </Box>
          </Paper>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
          }}>
            {questions.map((question, index) => (
              <Card 
                key={question.id} 
                sx={{ 
                  p: 3,
                  minWidth: 360,
                  maxWidth: 360,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography variant="subtitle1" sx={{ mb: 0 }}>
                  Question {index + 1}
                </Typography>
                <Typography variant="body1" sx={{ mb: 0 }}>
                  {question.body}
                </Typography>
                <RadioGroup
                  value={answers[question.id]?.toString() || ''}
                  onChange={handleAnswerChange(question.id)}
                >
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id.toString()}
                      control={<Radio />}
                      label={option.body}
                      sx={{ 
                        mb: 0,
                        '& .MuiTypography-root': {
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
              </Card>
            ))}
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 4,
            position: 'sticky',
            bottom: 16,
            bgcolor: 'background.paper',
            p: 2,
            borderRadius: 1,
            boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography>
              Questions answered: {Object.keys(answers).length} of {questions.length}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSubmitDialog(true)}
              disabled={submitting}
            >
              Submit Quiz
            </Button>
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