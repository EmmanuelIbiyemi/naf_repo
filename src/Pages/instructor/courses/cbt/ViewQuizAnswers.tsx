/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  //   Radio,
  Grid2,
  Paper,
} from "@mui/material";
import CustomPagination from "../../../../components/CustomPagination";

const dummyQuestions = [
  {
    id: 1,
    question:
      "What vitamin helps in maintaining healthy skin and immune system?",
    correctAnswer: "Vitamin C",
    selectedAnswer: "Vitamin C", // Correct answer selected
    options: ["Vitamin C", "Vitamin F", "Vitamin B", "Vitamin E"],
  },
  {
    id: 2,
    question: "Which vitamin is essential for blood clotting?",
    correctAnswer: "Vitamin K",
    selectedAnswer: "Vitamin F", // Wrong answer selected
    options: ["Vitamin F", "Vitamin K", "Vitamin C", "Vitamin B"],
  },
  {
    id: 3,
    question: "What vitamin is produced when skin is exposed to sunlight?",
    correctAnswer: "Vitamin D",
    selectedAnswer: "Vitamin C", // Wrong answer selected
    options: ["Vitamin C", "Vitamin F", "Vitamin D", "Vitamin B"],
  },
  {
    id: 4,
    question: "Which vitamin is important for eye health?",
    correctAnswer: "Vitamin A",
    selectedAnswer: "Vitamin A", // Correct answer selected
    options: ["Vitamin F", "Vitamin C", "Vitamin A", "Vitamin E"],
  },
  {
    id: 5,
    question: "What vitamin helps in energy metabolism?",
    correctAnswer: "Vitamin B",
    selectedAnswer: "Vitamin E", // Wrong answer selected
    options: ["Vitamin E", "Vitamin C", "Vitamin B", "Vitamin F"],
  },
  {
    id: 6,
    question: "Which vitamin has antioxidant properties?",
    correctAnswer: "Vitamin E",
    selectedAnswer: "Vitamin E", // Correct answer selected
    options: ["Vitamin F", "Vitamin E", "Vitamin C", "Vitamin B"],
  },
  {
    id: 7,
    question: "What vitamin is essential for bone health?",
    correctAnswer: "Vitamin D",
    selectedAnswer: "Vitamin B", // Wrong answer selected
    options: ["Vitamin F", "Vitamin C", "Vitamin D", "Vitamin B"],
  },
  {
    id: 8,
    question: "Which vitamin helps in wound healing?",
    correctAnswer: "Vitamin C",
    selectedAnswer: "Vitamin F", // Wrong answer selected
    options: ["Vitamin E", "Vitamin B", "Vitamin C", "Vitamin F"],
  },
  {
    id: 9,
    question: "What vitamin supports nervous system function?",
    correctAnswer: "Vitamin B",
    selectedAnswer: "Vitamin B", // Correct answer selected
    options: ["Vitamin C", "Vitamin B", "Vitamin E", "Vitamin F"],
  },
  {
    id: 10,
    question: "What vitamin supports nervous system function?",
    correctAnswer: "Vitamin B",
    selectedAnswer: "Vitamin B", // Correct answer selected
    options: ["Vitamin C", "Vitamin B", "Vitamin E", "Vitamin F"],
  },
  {
    id: 11,
    question: "What vitamin supports nervous system function?",
    correctAnswer: "Vitamin B",
    selectedAnswer: "Vitamin B", // Correct answer selected
    options: ["Vitamin C", "Vitamin B", "Vitamin E", "Vitamin F"],
  },
];

const ViewQuizAnswers = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [questions] = useState(dummyQuestions);

  const questionsPerPage = 9;
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
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

  const getOptionStyle = (
    question: {
      id?: number;
      question?: string;
      correctAnswer: any;
      selectedAnswer: any;
      options?: string[];
    },
    option: string
  ) => {
    const isSelected = option === question.selectedAnswer;
    const isCorrect = option === question.correctAnswer;

    if (isSelected && isCorrect) {
      // Correct answer selected - green
      return {
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#F0FDF4",
          borderColor: "#22C55E",
          color: "#22C55E",
          "&.Mui-disabled": {
            "& > fieldset": {
              borderColor: "#22C55E !important",
            },
          },
        },
      };
    } else if (isSelected && !isCorrect) {
      // Wrong answer selected - red
      return {
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#FEF2F2",
          borderColor: "#EF4444",
          color: "#EF4444",
          "&.Mui-disabled": {
            "& > fieldset": {
              borderColor: "#EF4444 !important",
            },
          },
        },
      };
    } else if (!isSelected && isCorrect) {
      // Correct answer not selected - green
      return {
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#F0FDF4",
          borderColor: "#22C55E",
          color: "#22C55E",
          "&.Mui-disabled": {
            "& > fieldset": {
              borderColor: "#22C55E !important",
            },
          },
        },
      };
    }

    // Default style for other options
    return {
      "& .MuiOutlinedInput-root": {
        backgroundColor: "#F8FAFC",
        borderRadius: "10px",
      },
    };
  };

  //   const getRadioStyle = (
  //     question: {
  //       id?: number;
  //       question?: string;
  //       correctAnswer: any;
  //       selectedAnswer: any;
  //       options?: string[];
  //     },
  //     option: string
  //   ) => {
  //     const isSelected = option === question.selectedAnswer;
  //     const isCorrect = option === question.correctAnswer;

  //     if (isSelected && isCorrect) {
  //       return { color: "#22C55E" };
  //     } else if (isSelected && !isCorrect) {
  //       return { color: "#EF4444" };
  //     } else if (!isSelected && isCorrect) {
  //       return { color: "#22C55E" };
  //     }
  //     return {};
  //   };

  return (
    <Box sx={{ p: 4, maxWidth: "1400px", mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Quiz Performance : Harsh Kadyan
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, width: "33%" }}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              width: "100%",
              backgroundColor: "#CCCCCC",
              color: "#FFF",
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              width: "100%",
            }}
          >
            Generate Report
          </Button>
        </Box>
      </Box>

      <Grid2 container spacing={3}>
        {currentQuestions.map((question, qIndex) => (
          <Grid2 size={4} key={question.id}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: "1px solid #E5E7EB",
              }}
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
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#F8FAFC",
                    borderRadius: "10px",
                  },
                }}
              />

              <Grid2 container spacing={2}>
                {question.options.map((option, oIndex) => (
                  <Grid2 size={6} key={oIndex}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* <Radio
                        disabled
                        checked={option === question.selectedAnswer}
                        size="small"
                        sx={{
                          p: 0.5,
                          ...getRadioStyle(question, option),
                        }}
                      /> */}
                      <TextField
                        fullWidth
                        disabled
                        variant="outlined"
                        value={option}
                        size="small"
                        sx={getOptionStyle(question, option)}
                      />
                    </Box>
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
