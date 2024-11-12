import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";
import {
  CourseCombinedType,
  CourseCreateType,
  CourseType,
} from "../../../../types/courses";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useAddCourseMutation,
  useAddLevelCourseMutation,
} from "../../../../store/api/courses.api";
import { useParams } from "react-router-dom";
import { FormAction } from "../../../../types/forms";

const CoursesPage = () => {
  const { level_id } = useParams();
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [courseName, setCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [addCourse] = useAddCourseMutation();
  const [addCourseToLevel] = useAddLevelCourseMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Academics/Courses"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedCourse(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddCourse = async (course: CourseCreateType) => {
    try {
      const response = await addCourse(course).unwrap();
      await addCourseToLevel({
        level_id: +(level_id || 0),
        course_ids: [response.data.id as number],
        type: response.data.type,
      }).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setCourseName(course.name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <CourseForm
          actions={{
            submit: handleAddCourse as FormAction<CourseCombinedType>,
            cancel: () => handleCloseModal("add"),
          }}
          course={selectedCourse}
        />
      </FormModal>

      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => {
          handleCloseModal("success");
          setSelectedCourse(undefined);
        }}
        infoText="The instructors added in this course will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new course “${courseName}”.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Courses",
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
        <CourseList />
      </Box>
    </Box>
  );
};

export default CoursesPage;
