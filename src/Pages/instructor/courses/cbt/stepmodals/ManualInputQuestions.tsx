import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Pagination,
  Grid2,
} from "@mui/material";
import CreateTestModal from "./CreateTestModal";
import { useGetParticipantsQuery } from "../../../../../store/api/participants.api";
import { TestFormData, TestQuestion } from "./testformtypes";
import { ManualUploadQuestion } from "../../../../../types/quizzes";

interface QuestionFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const QuestionField: React.FC<QuestionFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <Box>
    <Typography variant="subtitle1" gutterBottom>
      {label}
    </Typography>
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        backgroundColor: "#F8FAFC",
        border: "1px solid #CCCCCC",
        borderRadius: "10px",
      }}
    />
  </Box>
);

const ManualInputQuestions: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TestFormData>({} as TestFormData);
  const [updatedFormData, setUpdatedFormData] = useState<TestFormData | null>(
    null
  );
  const [uploadPayload, setUploadPayload] =
    useState<ManualUploadQuestion | null>(null);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [createTestModalOpen, setCreateTestModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questionsPerPage = 9;

  const { data: participants, isLoading: isFetchingParticipants } =
    useGetParticipantsQuery(null);

  useEffect(() => {
    const localFormData = location.state?.localFormData;
    if (localFormData) {
      setFormData(localFormData);
      const totalQuestions = localFormData.totalQuestions || 0;
      const initialQuestions = Array.from({ length: totalQuestions }, () => ({
        question: "",
        options: ["", "", ""],
        correctAnswer: "",
      }));
      setQuestions(initialQuestions);
    }
  }, [location.state]);

  const handleQuestionChange = (
    index: number,
    field: keyof TestQuestion | "options",
    value: string,
    optionIndex?: number
  ) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const currentQuestion = { ...updatedQuestions[index] };

      if (field === "options" && optionIndex !== undefined) {
        currentQuestion.options = currentQuestion.options.map((opt, idx) =>
          idx === optionIndex ? value : opt
        );
      } else if (field === "question" || field === "correctAnswer") {
        currentQuestion[field] = value;
      }

      updatedQuestions[index] = currentQuestion;
      return updatedQuestions;
    });
  };

  const validateQuestions = (): boolean => {
    const isValid = questions.every(
      (q) => q.question && q.options.every((opt) => opt) && q.correctAnswer
    );

    if (!isValid) {
      setError("All questions must be fully filled out before proceeding.");
    } else {
      setError(null);
    }

    return isValid;
  };

  const transformQuestionsForUpload = (): ManualUploadQuestion => {
    const transformedQuestions = questions.map((question) => ({
      body: question.question,
      options: question.options.map((option) => ({
        body: option,
        is_answer: option === question.correctAnswer,
      })),
    }));

    return {
      questions: transformedQuestions,
      assessment_id: formData.assessmentId,
    };
  };
  const handleNext = () => {
    if (!validateQuestions()) return;

    const newUploadPayload = transformQuestionsForUpload();
    const newFormData = { ...formData, questions };

    // Update both states
    setUploadPayload(newUploadPayload);
    setUpdatedFormData(newFormData);

    // Log both payloads
    console.log("Upload Payload:", newUploadPayload);
    console.log("Updated Form Data:", newFormData);

    setCreateTestModalOpen(true);
  };

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  return (
    <Box sx={{ margin: "auto", padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Input Questions Manually
          </Typography>
          <Typography variant="subtitle1">
            Test for: {formData.subject || "Loading..."}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#CCCCCC",
              borderRadius: "6px",
              width: "11em",
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            sx={{
              borderRadius: "6px",
              width: "11em",
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
          <Grid2 size={5} key={indexOfFirstQuestion + index}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                padding: "1em",
              }}
            >
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

              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <QuestionField
                    label="Answer"
                    value={question.correctAnswer}
                    onChange={(value) =>
                      handleQuestionChange(
                        indexOfFirstQuestion + index,
                        "correctAnswer",
                        value
                      )
                    }
                    placeholder="Type the correct answer here"
                  />
                </Grid2>
                {question.options.map((option, optIndex) => (
                  <Grid2 size={6} key={optIndex}>
                    <QuestionField
                      label="Option"
                      value={option}
                      onChange={(value) =>
                        handleQuestionChange(
                          indexOfFirstQuestion + index,
                          "options",
                          value,
                          optIndex
                        )
                      }
                      placeholder="Type an option here"
                    />
                  </Grid2>
                ))}
              </Grid2>
            </Box>
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ display: "flex", justifyContent: "center", marginY: 2 }}>
        <Pagination
          count={Math.ceil(questions.length / questionsPerPage)}
          page={currentPage}
          onChange={(_event, value) => setCurrentPage(value)}
        />
      </Box>

      <CreateTestModal
        open={createTestModalOpen}
        handleClose={() => setCreateTestModalOpen(false)}
        formData={updatedFormData || { ...formData, questions }}
        uploadPayload={uploadPayload}
        activeStep={1}
        participants={participants?.data ?? []}
      />
    </Box>
  );
};

export default ManualInputQuestions;
