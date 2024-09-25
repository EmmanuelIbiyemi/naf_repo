import { Box } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import FormModal from "../../components/FormModal";
import { useRef, useState } from "react";
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";
import {
  CourseCreateType,
  CourseEditFuncType,
  CourseType,
} from "../../types/courses";
import { useAppDispatch } from "../../store/hooks";
import { setPageName } from "../../store/app.slice";
import SuccessModal from "../../components/SuccessModal";

const CoursesPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [courseName, setCourseName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const [courses, setCourses] = useState<CourseType[] | []>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Course"));

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    setSelectedCourse(undefined);
  };

  const handdleAddCourse = (course: CourseCreateType) => {
    setCourses((prev) => [
      ...prev,
      { id: prev.length + 1, name: course.name, instructor: "" },
    ]);
    setCourseName(course.name);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  const handdleEditCourse = (course: CourseType) => {
    setCourses((prev) => {
      const temp = [...prev];
      const foundCourseIndex = courses.findIndex((crs) => crs.id == course.id);
      temp[foundCourseIndex] = course;
      return temp;
    });
    handleCloseModal("edit");
    handleOpenModal("success");
  };

  const handleDeleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((crs) => crs.id != id));
  };

  const handleOpenEditModal = (course: CourseType) => {
    setSelectedCourse(course);
    handleOpenModal("edit");
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
          handleCloseModal("edit");
        }}
      >
        <CourseForm
          actions={{
            submit: openModal.add
              ? handdleAddCourse
              : (handdleEditCourse as CourseEditFuncType),
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
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
        infoText="The students enrolled in this subject will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new subject to the course <strong>“${courseName}”</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
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
        {courses.length ? (
          <CourseList
            courses={courses}
            editCourse={handleOpenEditModal}
            deleteCourse={handleDeleteCourse}
          />
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
