import { useEffect, useState } from "react";
import CBTForm from "./components/QuizzesForm";
import QuizList from "./CBTsList";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import FormModal from "../../../../components/FormModal";
import SuccessModal from "../../../../components/SuccessModal";
import PageHeader from "../../../../components/PageHeader";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import { useGetInstructorCoursesQuery } from "../../../../store/api/courses.api";
import EmptyState from "../../../../components/EmptyState";

const CourseQuizSelector = ({
  selectedCourseId,
  onCourseChange,
}: {
  selectedCourseId: string;
  onCourseChange: (courseId: string) => void;
}) => {
  // Fetch instructor courses
  const { data: instructorCourses, isLoading: isLoadingCourses } =
    useGetInstructorCoursesQuery({
      page: 1,
      per_page: 1000,
    });

  // Event handler for course selection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCourseChange = (event: any) => {
    const courseId = event.target.value as string;
    onCourseChange(courseId);
  };

  return (
    <Box>
      {isLoadingCourses && <LinearProgress />}

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="course-select-label">Select Course</InputLabel>
        <Select
          labelId="course-select-label"
          id="course-select"
          value={selectedCourseId}
          label="Select Course"
          onChange={handleCourseChange}
        >
          {instructorCourses?.data.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name} ({course.code})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!selectedCourseId ? (
        <EmptyState
          title="Please select a course"
          subTitle="Choose a course from the dropdown to view its quizzes"
        />
      ) : (
        <QuizList courseId={selectedCourseId} />
      )}
    </Box>
  );
};

const CBTsPage = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
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

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Quiz",
          disabled: !selectedCourseId,
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
        <CourseQuizSelector
          selectedCourseId={selectedCourseId}
          onCourseChange={handleCourseChange}
        />
      </Box>
    </Box>
  );
};

export default CBTsPage;
