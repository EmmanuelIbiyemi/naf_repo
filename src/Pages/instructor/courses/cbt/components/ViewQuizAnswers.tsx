import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid2,
  Paper,
  LinearProgress,
} from "@mui/material";
import { useGetStudentQuery } from "../../../../../store/api/students.api";
import { useGetUserQuizResultQuery } from "../../../../../store/api/quizzes.api";
import CustomPagination from "../../../../../components/CustomPagination";
import { ArrowBack } from "@mui/icons-material";
import { Question } from "../../../../../types/quizzes";
import { option } from "../../../../../types/options";

interface QuestionDisplay {
  id: number;
  question: string;
  correctAnswer: string | undefined;
  selectedAnswer: string | undefined;
  options: string[];
}

const ViewQuizAnswers: React.FC = () => {
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
        backgroundColor: "#F0FDF4",
        borderColor: "#22C55E",
        color: "#22C55E",
      };
    } else if (isSelected && !isCorrect) {
      return {
        backgroundColor: "#FEF2F2",
        borderColor: "#EF4444",
        color: "#EF4444",
      };
    } else if (!isSelected && isCorrect) {
      return {
        backgroundColor: "#F0FDF4",
        borderColor: "#22C55E",
        color: "#22C55E",
      };
    }

    return { backgroundColor: "#F8FAFC", borderRadius: "10px" };
  };

  return (
    <Box sx={{ p: 4, mx: "auto" }}>
      {(isGettingResult || isGettingStudent) && <LinearProgress />}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Quiz Performance:{" "}
          {studentData
            ? `${studentData?.data.first_name} ${studentData?.data.last_name}`
            : ""}
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "33%",
            justifyContent: "end",
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            sx={{ paddingLeft: ".5rem" }}
          >
            <ArrowBack sx={{ marginRight: ".4rem" }} /> Back
          </Button>
        </Box>
      </Box>

      <Grid2 container spacing={2}>
        {currentQuestions.map((question, qIndex) => (
          <Grid2 size={4} key={question.id}>
            <Paper
              elevation={0}
              sx={{ p: 3, borderRadius: 2, border: "1px solid #E5E7EB" }}
            >
              <Typography variant="h6" gutterBottom>
                Question {qIndex + 1}
              </Typography>
              <TextField
                fullWidth
                disabled
                variant="outlined"
                value={question.question}
                sx={{
                  marginBottom: "1em",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #CCCCCC",
                  borderRadius: "10px",
                }}
              />
              <Grid2 container spacing={2}>
                {question.options.map((option, oIndex) => (
                  <Grid2 size={6} key={oIndex}>
                    <Typography variant="body2" gutterBottom>
                      Option
                    </Typography>
                    <TextField
                      fullWidth
                      disabled
                      variant="outlined"
                      value={option}
                      size="small"
                      sx={{
                        ...getOptionStyle(question, option),
                        borderRadius: "10px",
                      }}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Paper>
          </Grid2>
        ))}
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
