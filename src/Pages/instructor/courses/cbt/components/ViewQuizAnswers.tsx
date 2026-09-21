import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid2,
  Paper,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import { 
  ArrowBack, 
  CheckCircle, 
  Cancel,
  Person,
  Quiz as QuizIcon,
} from "@mui/icons-material";
import { useGetStudentQuery } from "../../../../../store/api/students.api";
import { useGetUserQuizResultQuery } from "../../../../../store/api/quizzes.api";
import CustomPagination from "../../../../../components/CustomPagination";
import { Question } from "../../../../../types/quizzes";
import { option } from "../../../../../types/options";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../../../store/app.slice";

interface QuestionDisplay {
  id: number;
  question: string;
  correctAnswer: string | undefined;
  selectedAnswer: string | undefined;
  options: string[];
}

const ViewQuizAnswers: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const locationData = location.pathname.split("/");
  const quizId = locationData[locationData.length - 5];
  const userId = locationData[locationData.length - 2];
  const studentId = locationData[locationData.length - 1];

  const { data: studentData, isLoading: isGettingStudent } = useGetStudentQuery(
    parseInt(studentId)
  );

  const { data: resultData, isLoading: isGettingResult } =
    useGetUserQuizResultQuery({
      quizId: parseInt(quizId),
      userId: parseInt(userId),
    });

  useEffect(() => {
    if (isGettingResult || isGettingStudent) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isGettingResult, isGettingStudent, dispatch]);

  const questionsPerPage = 9;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  const questions: QuestionDisplay[] =
    resultData?.data?.quiz?.assessments?.flatMap((assessment) =>
      assessment.questions.map((question: Question) => {
        const answer = resultData?.data?.answers.find(
          (ans) => ans.question_id === question.id
        );
        return {
          id: question.id,
          question: question.body,
          correctAnswer: question.options.find((opt: option) => opt.is_answer)
            ?.body,
          selectedAnswer: question.options.find(
            (opt: option) => opt.id === answer?.option_id
          )?.body,
          options: question.options.map((opt: option) => opt.body),
        };
      })
    ) || [];

  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  const getOptionStyle = (question: QuestionDisplay, option: string) => {
    const isSelected = option === question.selectedAnswer;
    const isCorrect = option === question.correctAnswer;

    if (isSelected && isCorrect) {
      return {
        backgroundColor: "#DCFCE7",
        border: "2px solid #22C55E",
        "& .MuiInputBase-input": {
          color: "#166534",
          fontWeight: 600,
        },
      };
    } else if (isSelected && !isCorrect) {
      return {
        backgroundColor: "#FEE2E2",
        border: "2px solid #EF4444",
        "& .MuiInputBase-input": {
          color: "#991B1B",
          fontWeight: 600,
        },
      };
    } else if (!isSelected && isCorrect) {
      return {
        backgroundColor: "#F0FDF4",
        border: "2px solid #86EFAC",
        "& .MuiInputBase-input": {
          color: "#166534",
          fontWeight: 500,
        },
      };
    }

    return { 
      backgroundColor: "#F8FAFC", 
      border: "1px solid #E5E7EB",
    };
  };

  const correctAnswersCount = questions.filter(
    (q) => q.selectedAnswer === q.correctAnswer
  ).length;
  const wrongAnswersCount = questions.length - correctAnswersCount;
  const scorePercentage = questions.length > 0 
    ? ((correctAnswersCount / questions.length) * 100).toFixed(1)
    : 0;

  return (
    <Box sx={{ p: 3, mx: "auto", maxWidth: 1400 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
              <Person fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="overline" color="text.secondary">
                Student Performance
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {studentData
                  ? `${studentData?.data.first_name} ${studentData?.data.last_name}`
                  : "Loading..."}
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            startIcon={<ArrowBack />}
            size="large"
          >
            Back
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Stats Cards */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CheckCircle sx={{ color: "success.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Correct Answers
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: "success.main" }}>
                {correctAnswersCount}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Cancel sx={{ color: "error.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Wrong Answers
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: "error.main" }}>
                {wrongAnswersCount}
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <QuizIcon sx={{ color: "primary.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Score Percentage
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: "primary.main" }}>
                {scorePercentage}%
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, minWidth: 200 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <QuizIcon sx={{ color: "info.main" }} />
                <Typography variant="body2" color="text.secondary">
                  Total Questions
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, color: "info.main" }}>
                {questions.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* Legend */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
          Answer Key Legend
        </Typography>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "#DCFCE7", border: "2px solid #22C55E", borderRadius: 1 }} />
            <Typography variant="body2">Correct (Selected)</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "#FEE2E2", border: "2px solid #EF4444", borderRadius: 1 }} />
            <Typography variant="body2">Wrong (Selected)</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 20, height: 20, bgcolor: "#F0FDF4", border: "2px solid #86EFAC", borderRadius: 1 }} />
            <Typography variant="body2">Correct Answer (Not Selected)</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Questions Grid */}
      <Grid2 container spacing={3}>
        {currentQuestions.map((question, qIndex) => {
          const isCorrect = question.selectedAnswer === question.correctAnswer;
          const globalIndex = indexOfFirstQuestion + qIndex;
          
          return (
            <Grid2 size={{ xs: 12, md: 6, lg: 4 }} key={question.id}>
              <Paper
                elevation={2}
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  height: "100%",
                  border: isCorrect ? "2px solid #22C55E" : "2px solid #EF4444",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Question {globalIndex + 1}
                  </Typography>
                  <Chip
                    icon={isCorrect ? <CheckCircle /> : <Cancel />}
                    label={isCorrect ? "Correct" : "Wrong"}
                    color={isCorrect ? "success" : "error"}
                    size="small"
                  />
                </Box>
                
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <Typography variant="body1">
                    {question.question}
                  </Typography>
                </Paper>

                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Answer Options:
                </Typography>
                
                <Grid2 container spacing={1.5}>
                  {question.options.map((option, oIndex) => (
                    <Grid2 size={6} key={oIndex}>
                      <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={option}
                        size="small"
                        sx={{
                          ...getOptionStyle(question, option),
                          borderRadius: "8px",
                          "& .MuiInputBase-input.Mui-disabled": {
                            WebkitTextFillColor: "inherit",
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1, fontWeight: 600 }}>
                              {String.fromCharCode(65 + oIndex)}.
                            </Typography>
                          ),
                        }}
                      />
                    </Grid2>
                  ))}
                </Grid2>
              </Paper>
            </Grid2>
          );
        })}
      </Grid2>

      <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
        <CustomPagination
          startIndex={indexOfFirstQuestion + 1}
          endIndex={Math.min(indexOfLastQuestion, questions.length)}
          totalNumber={questions.length}
          count={Math.ceil(questions.length / questionsPerPage)}
          page={currentPage}
          handleChangePage={handleChangePage}
        />
      </Box>
    </Box>
  );
};

export default ViewQuizAnswers;
