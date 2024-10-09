import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import EmptyState from "../../../../components/EmptyState";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";
import {
  CourseCreateType,
  CourseFormAction,
  CourseType,
} from "../../../../types/courses";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useAddCourseMutation,
  useGetCoursesQuery,
} from "../../../../store/api/courses.api";

const CoursesPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [courseName, setCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const { data: courses } = useGetCoursesQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addCourse] = useAddCourseMutation();

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
      await addCourse(course).unwrap();
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
            submit: handleAddCourse as CourseFormAction,
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
        subTitle={`You have successfully added a new course <strong>“${courseName}”</strong>.`}
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
        {courses?.data.length ? (
          <CourseList />
        ) : (
          <EmptyState
            title="No Courses at this time"
            subTitle="Courses will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default CoursesPage;
