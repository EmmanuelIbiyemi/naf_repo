import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import AssessmentList from "./AssessmentList";
import AssessmentsForm from "./components/AssessmentsForm";
import FormModal from "../../../../../components/FormModal";
import SuccessModal from "../../../../../components/SuccessModal";
import InstructorPageHeader from "../../../../../components/layout/InstructorPageHeader";
import { useAppDispatch } from "../../../../../store/hooks";
import { setPageName } from "../../../../../store/app.slice";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCourseParticipantsQuery } from "../../../../../store/api/participants.api";
import ShareWithList from "../../../../../components/ShareWithList";

const AssessmentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });

  const navigate = useNavigate();

  const { courseId, quiz_id } = useParams();

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

  const [openShareModal, setOpenShareModal] = useState(false);
  const handleCloseShareModal = () => {
    setOpenShareModal(false);
  };
  const { data: participants, isLoading: isFetchingParticipants } =
    useGetCourseParticipantsQuery(
      { course_id: parseInt(courseId || "") },
      { skip: !courseId }
    );

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

      <InstructorPageHeader
        heading="Assessments"
        subHeading="Manage assessments for this quiz"
        button={{
          action: () => navigate("participants"),
          text: "View Participants",
        }}
        additionalButton={{
          action: () => handleOpenModal("add"),
          text: "Add Assessment",
        }}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          onClick={() => setOpenShareModal(true)}
          variant="contained"
          sx={{
            alignSelf: "end",
            textTransform: "capitalize",
          }}
          disabled={isFetchingParticipants}
        >
          Share Quiz
        </Button>
        <AssessmentList />
      </Box>
      <ShareWithList
        open={openShareModal}
        handleClose={handleCloseShareModal}
        // handleSelectedRecipients={handleSelectedRecipients}
        quizId={parseInt(quiz_id || "")}
        participants={participants?.data || []}
      />
    </Box>
  );
};

export default AssessmentsPage;
