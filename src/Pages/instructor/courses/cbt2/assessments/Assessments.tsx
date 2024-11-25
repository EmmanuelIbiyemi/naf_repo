import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import AssessmentList from "./AssessmentList";
import AssessmentsForm from "./components/AssessmentsForm";
import FormModal from "../../../../../components/FormModal";
import SuccessModal from "../../../../../components/SuccessModal";
import PageHeader from "../../../../../components/PageHeader";
import { useAppDispatch } from "../../../../../store/hooks";
import { setPageName } from "../../../../../store/app.slice";
import { useNavigate } from "react-router-dom";

const AssessmentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });

  const navigate = useNavigate();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Quizzes/Assessments"));
  }, []);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <Box className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
        }}
      >
        <AssessmentsForm
          actions={{
            cancel: () => handleCloseModal("add"),
          }}
        />
      </FormModal>

      <SuccessModal
        close={() => handleCloseModal("success")}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added new questions.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Assessment",
        }}
        secondaryButton={{
          action: () => navigate("participants"),
          text: "View Participants",
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
