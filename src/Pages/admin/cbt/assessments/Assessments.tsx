import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import FormModal from "../../../../components/FormModal";
import PageHeader from "../../../../components/PageHeader";
import AssessmentList from "./AssessmentList";
import AssessmentsForm from "./components/AssessmentsForm";

const AssessmentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [isDownloading, setIsDownloading] = useState(false);

  // Retrieve quiz id from route parameters set by the CBT list
  const { quiz_id } = useParams();
  const quizId = quiz_id ? parseInt(quiz_id, 10) : 0;

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Quizzes/Assessments"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDownloadResult = async () => {
    try {
      setIsDownloading(true);
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/quiz/result/${quizId}?download=true`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quiz_result.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => handleCloseModal("add")}
      >
        <AssessmentsForm actions={{ cancel: () => handleCloseModal("add") }} />
      </FormModal>

      <SuccessModal
        close={() => handleCloseModal("success")}
        infoText=""
        open={openModal.success}
        subTitle="You have successfully added new questions."
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Assessment",
        }}
        secondaryButton={{
          action: handleDownloadResult,
          text: isDownloading ? "Downloading..." : "Download Result",
          disabled: isDownloading,
        }}
      />

      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <AssessmentList />
      </Box>
    </Box>
  );
};

export default AssessmentsPage;
