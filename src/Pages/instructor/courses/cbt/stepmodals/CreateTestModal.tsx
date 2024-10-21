import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Close, East, West } from "@mui/icons-material";
import {
  Box,
  IconButton,
  LinearProgress,
  Modal,
  Typography,
} from "@mui/material";
import Step1Content from "./Step1Content";
import Step2Content from "./Step2Content";
import Step3Content from "./Step3Content";
import Step4Content from "./Step4Content";
import { TestFormData } from "./testformtypes";
import UploadFileModal from "../../../../../components/UploadFileModal";
import { ParticipantData } from "../../../../../types/participants";

const initialFormData: TestFormData = {
  subject: 0,
  totalQuestions: 0,
  passingPercentage: 0,
  scheduleDate: "",
  expirationDate: "",
  type: "",
  questions: [],
};

const steps = [
  { title: "Select Subject", component: Step1Content },
  { title: "Test Specifications", component: Step2Content },
  { title: "Import Questions", component: Step3Content },
  { title: "Review and Confirm", component: Step4Content },
];

interface CreateTestModalProps {
  open: boolean;
  handleClose: () => void;
  formData?: TestFormData;
  activeStep?: number;
  participants?: ParticipantData[];
}

const CreateTestModal: React.FC<CreateTestModalProps> = ({
  open,
  handleClose,
  formData,
  activeStep = 0,
  participants,
}) => {
  const [currentActiveStep, setCurrentActiveStep] = useState(activeStep);
  const [openCSVModal, setOpenCSVModal] = useState(false);
  const [localFormData, setLocalFormData] = useState<TestFormData>(
    formData || initialFormData
  );
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentActiveStep((prevStep) =>
      Math.min(prevStep + 1, steps.length - 1)
    );
  };

  const handleBack = () => {
    setCurrentActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleFileChange = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // Attach the file to FormData

      setLocalFormData((prevData) => ({ ...prevData, questionsFileId: file }));
      //   setFormData((prevData) => ({ ...prevData, questionsFileId: uploadedFileId }));

      setOpenCSVModal(false);
      handleNext();
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  //   const handleFileChange = async (
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     file: any
  //   ) => {
  //     try {
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       console.log(file);

  //       // const response = await uploadResource(formData).unwrap();
  //       // formik.setFieldValue("resources", [
  //       //   ...formik.values.resources,
  //       //   ...response.resources.map((resource) => resource.id),
  //       // ]);
  //       setFormData((prevData) => ({ ...prevData, file }));
  //       setOpenCSVModal(false);
  //       handleBack();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   const handleFileChange = (questions: TestFormData["questions"]) => {
  //     setFormData((prevData) => ({ ...prevData, questions }));
  //   };

  const handleInputManually = () => {
    navigate("manual-input", { state: { localFormData } });
    handleClose();
  };

  const handleFormChange = (newData: Partial<TestFormData>) => {
    setLocalFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleSubmit = () => {
    if (localFormData.subject && localFormData.totalQuestions > 0) {
      console.log("Final form data:", formData);
    } else {
      alert("Please complete all required fields.");
    }
  };

  const StepContent = steps[currentActiveStep].component;

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "2em",
            borderRadius: "6px",
            width: "40%",
            maxHeight: "98vh",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
              marginBottom: ".7em",
            }}
          >
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.8rem",
                fontWeight: 700,
                marginBottom: ".7em",
              }}
            >
              Create New Test
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: ".9rem", color: "#787878", marginBottom: ".3em" }}
            >
              {currentActiveStep + 1}/{steps.length} Steps
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(currentActiveStep + 1) * (100 / steps.length)}
              sx={{ marginBottom: "1em" }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "85%" }}>
                <StepContent
                  formData={localFormData}
                  onChange={handleFormChange}
                  onImportCSV={() => setOpenCSVModal(true)}
                  onInputManually={handleInputManually}
                  onSubmit={handleSubmit}
                  handleNext={handleNext}
                  disabledInput={
                    localFormData.questions &&
                    localFormData.questions.length > 0
                  }
                  participants={participants}
                />
                {currentActiveStep !== 4 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1em",
                    }}
                  >
                    <Box
                      onClick={handleBack}
                      sx={{
                        border: "none",
                        color: "#6B6B6B",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        visibility:
                          currentActiveStep === 0 ? "hidden" : "visible",
                      }}
                    >
                      <West /> Back
                    </Box>
                    <Box
                      onClick={handleNext}
                      sx={{
                        border: "none",
                        color: "#6B6B6B",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        visibility:
                          currentActiveStep === 3 ? "hidden" : "visible",
                      }}
                    >
                      Next <East />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
      <UploadFileModal
        open={openCSVModal}
        handleClose={() => setOpenCSVModal(false)}
        handleFileChange={handleFileChange}
      />
    </>
  );
};

export default CreateTestModal;
