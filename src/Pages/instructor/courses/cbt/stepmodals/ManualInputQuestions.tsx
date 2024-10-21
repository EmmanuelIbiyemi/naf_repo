import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid2,
  Pagination,
  Alert,
} from "@mui/material";
import { TestFormData, TestQuestion } from "./testformtypes";
import CreateTestModal from "./CreateTestModal";
import { useGetParticipantsQuery } from "../../../../../store/api/participants.api";

const ManualInputQuestions: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TestFormData>({} as TestFormData);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [updatedFormData, setUpdatedFormData] = useState<TestFormData>();
  const [currentPage, setCurrentPage] = useState(1);
  const [createTestModalOpen, setCreateTestModalOpen] = useState(false);
  const questionsPerPage = 9;
  const [error, setError] = useState<string | null>(null);
  const { data: participants, isLoading: isFetchingParticipants } =
    useGetParticipantsQuery(null);

  useEffect(() => {
    if (location.state && location.state.localFormData) {
      setFormData(location.state.localFormData);
      const totalQuestions = location.state.localFormData.totalQuestions || 0;
      const initialQuestions = Array(totalQuestions)
        .fill(null)
        .map(() => ({
          question: "",
          options: ["", "", ""],
          correctAnswer: "",
        }));
      setQuestions(initialQuestions);
    }
  }, [location.state]);

  const handleQuestionChange = (
    index: number,
    field: keyof TestQuestion | string,
    value: string,
    optionIndex?: number
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      if (field === "options" && optionIndex !== undefined) {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          options: updatedQuestions[index].options.map((opt, idx) =>
            idx === optionIndex ? value : opt
          ),
        };
      } else if (field === "question" || field === "correctAnswer") {
        updatedQuestions[index] = {
          ...updatedQuestions[index],
          [field]: value,
        };
      }

      return updatedQuestions;
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    if (
      questions.some(
        (q) => !q.question || q.options.some((opt) => !opt) || !q.correctAnswer
      )
    ) {
      setError("All questions must be fully filled out before proceeding.");
      return;
    }

    setUpdatedFormData({ ...formData, questions });
    setCreateTestModalOpen(true);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );
  console.log("Updated", updatedFormData);

  return (
    <Box sx={{ margin: "auto", padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Input Questions Manually
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            List of test that have been created in the course: "Sosososo And So"
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#CCCCCC",
              borderRadius: "6px",
              width: "11em",
              alignSelf: "end",
            }}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: "6px",
              width: "11em",
              alignSelf: "end",
            }}
            onClick={handleNext}
            disabled={isFetchingParticipants}
          >
            Save
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Grid2 container spacing={2}>
        {currentQuestions.map((question, index) => (
          <Grid2
            size={{ md: 12, lg: 6, xl: 4 }}
            key={indexOfFirstQuestion + index}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "1em",
              }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  Question {indexOfFirstQuestion + index + 1}
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a question here"
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(
                      indexOfFirstQuestion + index,
                      "question",
                      e.target.value
                    )
                  }
                  sx={{
                    marginBottom: "1em",
                    backgroundColor: "#F8FAFC",
                    border: "1px solid #CCCCCC",
                    borderRadius: "10px",
                  }}
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto auto",
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Answer
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Type the correct answer here"
                      value={question.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          indexOfFirstQuestion + index,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      sx={{
                        backgroundColor: "#F8FAFC",
                        border: "1px solid #CCCCCC",
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                  {question.options.map((option, optIndex) => (
                    <Box key={optIndex}>
                      <Typography variant="subtitle1" gutterBottom>
                        Option
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={`Type an option here`}
                        value={option}
                        onChange={(e) =>
                          handleQuestionChange(
                            indexOfFirstQuestion + index,
                            "options",
                            e.target.value,
                            optIndex
                          )
                        }
                        sx={{
                          backgroundColor: "#F8FAFC",
                          border: "1px solid #CCCCCC",
                          borderRadius: "10px",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
        <Pagination
          count={Math.ceil(questions.length / questionsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
      <CreateTestModal
        open={createTestModalOpen}
        handleClose={() => setCreateTestModalOpen(false)}
        formData={updatedFormData}
        activeStep={1}
        participants={participants?.data ?? []}
      />
    </Box>
  );
};

export default ManualInputQuestions;
