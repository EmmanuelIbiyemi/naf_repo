import { Box } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import EmptyState from "../../components/EmptyState";
import FormModal from "../../components/FormModal";
import { useRef, useState } from "react";
import SubjectForm from "./SubjectForm";
import SubjectList from "./SubjectList";
import { SubjectType } from "../../types/subjects";
import dayjs from "dayjs";
import { useAppDispatch } from "../../store/hooks";
import { setPageName } from "../../store/app.slice";

const SubjectsPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [subjects] = useState<SubjectType[] | []>([
    {
      id: 1,
      name: "subject 1",
      duration: "2hr",
      end_date: dayjs("25/12/2024"),
      instructors: [1],
      phone: "09012345678",
      rank: "Captain",
      start_date: dayjs("01/01/2024"),
    },
    {
      id: 2,
      name: "subject 2",
      duration: "1hr 30min",
      end_date: dayjs("25/12/2024"),
      instructors: [1],
      phone: "09012345678",
      rank: "Captain",
      start_date: dayjs("01/01/2024"),
    },
    {
      id: 3,
      name: "subject 3",
      duration: "1hr",
      end_date: dayjs("25/12/2024"),
      instructors: [1],
      phone: "09012345678",
      rank: "Captain",
      start_date: dayjs("01/01/2024"),
    },
  ]);
  const dispatch = useAppDispatch();
  dispatch(setPageName("Subjects"));

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
      <FormModal open={openModal} close={handleCloseModal}>
        <SubjectForm />
      </FormModal>
      <PageHeader
        button={{
          action: handleOpenModal,
          text: "Add Subject",
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
        {subjects.length ? (
          <SubjectList subjects={subjects} />
        ) : (
          <EmptyState
            title="No Subjects at this time"
            subTitle="Subjects will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default SubjectsPage;
