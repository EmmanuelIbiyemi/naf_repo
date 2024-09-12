import { Box } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import FormModal from "../../components/FormModal";
import { useRef, useState } from "react";
import CourseForm from "./CourseForm";
import CourseList from "./CourseList";
import { CourseType } from "../../types/courses";

const CoursesPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [courses] = useState<CourseType[] | []>([
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
  };

  return (
    <Box ref={containerRef}>
      <FormModal
        name="Create New Course"
        open={openModal}
        close={handleCloseModal}
      >
        <CourseForm />
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
        {courses.length ? <CourseList courses={courses} /> : <EmptyState />}
      </Box>
    </Box>
  );
};

export default CoursesPage;
