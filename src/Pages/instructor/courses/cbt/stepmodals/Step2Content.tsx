import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { TestFormData } from "./testformtypes";
import { AccessTime, CalendarToday } from "@mui/icons-material";
import { ParticipantData } from "../../../../../types/participants";
import ShareWithModal from "../../../../../components/ShareWithModal";
import {
  useAddQuizMutation,
  useCreateAssessmentMutation,
  useCreateQuestionManuallyMutation,
} from "../../../../../store/api/quizzes.api";
import { CreateQuiz, ManualUploadQuestion } from "../../../../../types/quizzes";
// import { useNavigate } from "react-router-dom";

interface ModalProps {
  formData: TestFormData;
  onChange: (newData: Partial<TestFormData>) => void;
  onImportCSV: () => void;
  onInputManually: () => void;
  handleNext: () => void;
  disabledInput?: boolean;
  participants?: ParticipantData[];
  uploadPayload?: ManualUploadQuestion | null;
}

const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  field: keyof TestFormData,
  onChange: (newData: Partial<TestFormData>) => void
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = event.target.value;

  if (field === "totalQuestions" || field === "passingPercentage") {
    const parsedValue = parseInt(value);
    value = isNaN(parsedValue) ? 0 : parsedValue;
  }

  onChange({ [field]: value });
};

const isFormValid = (formData: TestFormData) => {
  return (
    formData.totalQuestions > 0 &&
    formData.passingPercentage > 0 &&
    formData.scheduleDate !== "" &&
    formData.expirationDate !== "" &&
    formData.type !== ""
  );
};

const Step2Content: React.FC<ModalProps> = ({
  formData,
  onChange,
  handleNext,
  disabledInput,
  participants,
  uploadPayload,
}) => {
  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 2];
  const [openShareModal, setOpenShareModal] = useState(false);
  const [disableUploadQuestions, setDisableUploadQuestions] = useState(true);
  const [createTest, setCreateTest] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  // const navigate = useNavigate();

  const handleCloseShareModal = () => {
    setOpenShareModal(false);
    setHasShared(true);
  };
  const [createQuiz, { isLoading }] = useAddQuizMutation();
  const [uploadManualQuestion, { isLoading: isUploadingQuestions }] =
    useCreateQuestionManuallyMutation();
  const [createAssessment, { isLoading: isCreatingAssessment }] =
    useCreateAssessmentMutation();
  const [checked, setChecked] = useState(false);
  const handleShowResult = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const handleCreateQuiz = async () => {
    const createQuizData: CreateQuiz & { course_id: number } = {
      name: formData.subject,
      instructions: "",
      time_allowed: 60,
      start_date: formData.scheduleDate,
      expiry_date: formData.expirationDate,
      obtainable_score: formData.passingPercentage,
      type: formData.type,
      show_result: checked,
      course_id: parseInt(courseId),
    };
    try {
      const createQuizResponse = await createQuiz(createQuizData).unwrap();
      const createAssessmentResponse = await createAssessment({
        name: formData.subject,
        quiz_id: createQuizResponse.data.id,
      });
      onChange({ quizId: createQuizResponse.data.id });
      onChange({ assessmentId: createAssessmentResponse.data?.data.id });
      setDisableUploadQuestions(false);
      setCreateTest(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadQuestions = async () => {
    if (!uploadPayload && !formData.file) {
      console.error("Upload payload or file is missing");
      return;
    }

    try {
      if (uploadPayload && !hasShared) {
        await uploadManualQuestion(uploadPayload).unwrap();
        setOpenShareModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          border: "1px solid #E1E1E1",
          padding: "1em",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "1.2rem",
            color: "#434343",
            marginBottom: ".7em",
          }}
        >
          Test Specifications
        </Typography>
        <Box>
          <label htmlFor="totalQuestions" style={{ color: "#1D2026" }}>
            Total Questions
          </label>
          <TextField
            id="totalQuestions"
            placeholder="Total Questions"
            value={formData.totalQuestions}
            onChange={(e) => handleChange(e, "totalQuestions", onChange)}
            sx={{
              marginBottom: "1em",
              width: "100%",
              backgroundColor: "#F1F1F1",
            }}
            disabled={disabledInput}
          />

          <label
            htmlFor="passingPercentage"
            style={{
              color: "#1D2026",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Passing Percentage</span>{" "}
            <span>{formData.passingPercentage}%</span>
          </label>
          <Slider
            defaultValue={0}
            valueLabelDisplay="off"
            value={formData.passingPercentage}
            onChange={(_, value) =>
              onChange({ passingPercentage: value as number })
            }
            disabled={disabledInput}
          />

          <label htmlFor="scheduleDate" style={{ color: "#1D2026" }}>
            Exam Schedule/Expiration
          </label>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#F1F1F1",
                borderRadius: "5px",
                padding: ".4em",
              }}
            >
              <CalendarToday />
              <TextField
                fullWidth
                variant="outlined"
                id="scheduleDate"
                name="scheduleDate"
                value={formData.scheduleDate}
                onChange={(e) => handleChange(e, "scheduleDate", onChange)}
                type="date"
                disabled={disabledInput}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#F1F1F1",
                borderRadius: "5px",
                padding: ".4em",
              }}
            >
              <AccessTime />
              <TextField
                fullWidth
                variant="outlined"
                id="expirationDate"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={(e) => handleChange(e, "expirationDate", onChange)}
                type="date"
                disabled={disabledInput}
              />
            </Box>
          </Box>

          <Box>
            <Checkbox
              checked={checked}
              onChange={handleShowResult}
              inputProps={{ "aria-label": "controlled" }}
            />
            <label htmlFor="result" style={{ color: "#1D2026" }}>
              Display Result
            </label>
          </Box>

          <label htmlFor="type" style={{ color: "#1D2026" }}>
            Type of CBT
          </label>
          <TextField
            id="type"
            placeholder="Type of CBT"
            value={formData.type}
            onChange={(e) => handleChange(e, "type", onChange)}
            sx={{
              marginBottom: "1em",
              width: "100%",
              backgroundColor: "#F1F1F1",
            }}
            disabled={disabledInput}
          />
          <Box
            sx={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleNext}
              sx={{ color: "#9A9A9A" }}
              disabled={
                !isFormValid(formData) ||
                disabledInput ||
                disableUploadQuestions
              }
            >
              {disabledInput ? "Questions Uploaded" : "Upload Question(s)"}
            </Button>
            {disabledInput ? (
              <Button
                variant="contained"
                disabled={uploadPayload === null || isUploadingQuestions}
                onClick={handleUploadQuestions}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="contained"
                disabled={
                  !isFormValid(formData) ||
                  isLoading ||
                  createTest ||
                  isCreatingAssessment
                }
                onClick={handleCreateQuiz}
              >
                Continue
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      {!hasShared && (
        <ShareWithModal
          open={openShareModal}
          handleClose={handleCloseShareModal}
          participants={participants || []}
          quizId={formData.quizId}
        />
      )}
    </Box>
  );
};

export default Step2Content;
