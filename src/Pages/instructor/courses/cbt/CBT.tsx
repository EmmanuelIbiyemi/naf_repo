import { useEffect, useState } from "react";
import CBTForm from "./components/QuizzesForm";
import QuizList from "./CBTsList";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import FormModal from "../../../../components/FormModal";
import SuccessModal from "../../../../components/SuccessModal";
import InstructorPageHeader from "../../../../components/layout/InstructorPageHeader";
import { Box } from "@mui/material";
import InstructorCourseSelector from "../../../../components/layout/InstructorCourseSelector";
import { useLocation } from "react-router-dom";

const CBTsPage = () => {
  const location = useLocation();

  // Get persisted course ID from localStorage or location state
  const getInitialCourseId = () => {
    const locationState = location.state as { selectedCourseId?: string } | null;
    if (locationState?.selectedCourseId) {
      return locationState.selectedCourseId;
    }
    return localStorage.getItem("lastSelectedCourseId") || "";
  };

  const [selectedCourseId, setSelectedCourseId] = useState<string>(getInitialCourseId);
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
  });

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Quizzes"));
  }, []);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  return (
    <Box className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
        }}
      >
        <CBTForm
          actions={{
            cancel: () => {
              handleCloseModal("add");
              handleCloseModal("success");
            },
          }}
          courseId={parseInt(selectedCourseId)}
        />
      </FormModal>

      <SuccessModal
        close={() => handleCloseModal("success")}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Quiz to your school.`}
        title="Updates Successful"
      />

      <InstructorPageHeader
        heading="Quizzes"
        subHeading="List of quizzes for your courses"
        additionalButton={{
          action: () => handleOpenModal("add"),
          text: "Add Quiz",
          isLoading: !selectedCourseId,
        }}
      />

      <InstructorCourseSelector
        selectedCourseId={selectedCourseId}
        onCourseChange={handleCourseChange}
        emptyStateTitle="Please select a course"
        emptyStateSubtitle="Choose a course from the dropdown to view its quizzes"
      >
        <QuizList courseId={selectedCourseId} />
      </InstructorCourseSelector>
    </Box>
  );
};

export default CBTsPage;
