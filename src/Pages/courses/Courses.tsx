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

const CoursesPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [courses, setCourses] = useState<CourseType[] | []>([
    { id: 1, name: "course 1" },
    { id: 2, name: "course 1" },
    { id: 3, name: "course 1" },
    { id: 4, name: "course 1" },
  ]);

  const handleOpenModal = () => {
    setOpenModal(true);
    document.querySelector(".sidebar")?.classList.add("blur_effect");
    document.querySelector(".header")?.classList.add("blur_effect");
    containerRef.current?.classList.add("blur_effect");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    containerRef.current?.classList.remove("blur_effect");
    document.querySelector(".sidebar")?.classList.remove("blur_effect");
    document.querySelector(".header")?.classList.remove("blur_effect");
    setSelectedCourse(undefined);
  };

  const handdleAddCourse = (course: CourseCreateType) => {
    setCourses((prev) => [...prev, { id: prev.length + 1, name: course.name }]);
    handleCloseModal();
  };

  const handdleEditCourse = (course: CourseType) => {
    setCourses((prev) => {
      const temp = [...prev];
      const foundCourseIndex = courses.findIndex((crs) => crs.id == course.id);
      temp[foundCourseIndex] = { id: course.id, name: course.name };
      return temp;
    });
    handleCloseModal();
  };

  const handleDeleteCourse = (id: number) => {
    setCourses((prev) => prev.filter((crs) => crs.id != id));
  };

  const handleOpenEditModal = (course: CourseType) => {
    console.log(course);
    setSelectedCourse(course);
    handleOpenModal();
  };

  return (
    <Box ref={containerRef}>
      <FormModal
        open={Boolean(selectedCourse) || openModal}
        close={handleCloseModal}
      >
        <CourseForm
          action={
            selectedCourse
              ? (handdleEditCourse as CourseEditFuncType)
              : handdleAddCourse
          }
          course={selectedCourse}
        />
      </FormModal>
      <PageHeader
        button={{
          action: handleOpenModal,
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
          <EmptyState />
        )}
      </Box>
    </Box>
  );
};

export default CoursesPage;
