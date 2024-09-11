import { Box } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import FormModal from "../../components/FormModal";
import { useRef, useState } from "react";
import CourseForm from "./CourseForm";

const CoursesPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
        <EmptyState />
      </Box>
    </Box>
  );
};

export default CoursesPage;
