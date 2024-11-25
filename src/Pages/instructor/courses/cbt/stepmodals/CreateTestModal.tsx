import React, { useEffect, useState } from "react";
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
// import Step4Content from "./Step4Content";
import { TestFormData } from "./testformtypes";
import UploadFileModal from "../../../../../components/UploadFileModal";
import { ParticipantData } from "../../../../../types/participants";
// import { CourseType } from "../../../../../types/courses";
import { useAddMediaMutation } from "../../../../../store/api/media.api";
import { useCreateQuestionFromFileMutation } from "../../../../../store/api/quizzes.api";
import { ManualUploadQuestion } from "../../../../../types/quizzes";
import ShareWithModal from "../../../../../components/ShareWithModal";
import SuccessModal from "../../../../../components/SuccessModal";

const initialFormData: TestFormData = {
  subject: "",
  totalQuestions: 0,
  passingPercentage: 0,
  scheduleDate: "",
  expirationDate: "",
  type: "",
  questions: [],
  assessmentId: 0,
  file: "",
  quizId: 0,
};

const steps = [
  { title: "Select Course", component: Step1Content },
  { title: "Test Specifications", component: Step2Content },
  { title: "Import Questions", component: Step3Content },
  // { title: "Review and Confirm", component: Step4Content },
];

interface CreateTestModalProps {
  open: boolean;
  handleClose: () => void;
  formData?: TestFormData;
  uploadPayload?: ManualUploadQuestion | null;
  activeStep?: number;
  participants?: ParticipantData[];
  // courses?: CourseType[];
}

const CreateTestModal: React.FC<CreateTestModalProps> = ({
  open,
  handleClose,
  formData,
  uploadPayload,
  activeStep = 0,
  participants,
  // courses = [],
}) => {
  const [currentActiveStep, setCurrentActiveStep] = useState(activeStep);
  const [openCSVModal, setOpenCSVModal] = useState(false);
  const [localFormData, setLocalFormData] = useState<TestFormData>(
    formData ? formData : initialFormData
  );

  useEffect(() => {
    if (formData) {
      setLocalFormData(formData);
    }
  }, [formData]);

  const navigate = useNavigate();
  const [uploadMedia] = useAddMediaMutation();
  const [createQuestionFromFile] = useCreateQuestionFromFileMutation();
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const handleCloseShareModal = () => {
    setOpenShareModal(false);
  };

  const handleNext = () => {
    setCurrentActiveStep((prevStep) =>
      Math.min(prevStep + 1, steps.length - 1)
    );
  };

  const handleBack = () => {
    setCurrentActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleInputManually = () => {
    navigate("manual-input", { state: { localFormData } });
    handleClose();
  };

  const handleFormChange = (newData: Partial<TestFormData>) => {
    setLocalFormData((prevData) => ({ ...prevData, ...newData }));
  };

  const handleFileChange = async (file: File) => {
    try {
      setUploadingDocument(true);
      const formData = new FormData();
      formData.append("file", file);

      const uploadMediaResponse = await uploadMedia(formData).unwrap();
      const fileUrl = uploadMediaResponse.media[0].url;

      if (fileUrl) {
        // First update the state
        await new Promise<void>((resolve) => {
          setLocalFormData((prevData) => {
            const newData = { ...prevData, file: fileUrl };
            resolve();
            return newData;
          });
        });

        await createQuestionFromFile({
          assessment_id: localFormData.assessmentId,
          file_url: fileUrl,
        });

        setUploadingDocument(false);
        setOpenCSVModal(false);
        setOpenShareModal(true);
        handleClose();

        // handleBack();
      } else {
        console.error("File URL not found in the response.");
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  // const handleSubmit = () => {
  //   if (localFormData.subject && localFormData.totalQuestions > 0) {
  //     console.log("Final form data:", formData);
  //   } else {
  //     alert("Please complete all required fields.");
  //   }
  // };

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
                  // onSubmit={handleSubmit}
                  handleNext={handleNext}
                  uploadPayload={uploadPayload}
                  disabledInput={
                    (!!localFormData.questions &&
                      localFormData.questions.length > 0) ||
                    (!!localFormData.file && localFormData.file !== "") ||
                    !!uploadPayload
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
        isUploading={uploadingDocument}
      />

      <SuccessModal
        close={() => {
          setOpenSuccessModal(false);
          setOpenCSVModal(false);
        }}
        infoText=""
        open={openSuccessModal}
        subTitle={`File has been successfully uploaded`}
        title="Successful"
      />
      <ShareWithModal
        open={openShareModal}
        handleClose={handleCloseShareModal}
        participants={participants || []}
        quizId={localFormData.quizId}
      />
    </>
  );
};

export default CreateTestModal;
