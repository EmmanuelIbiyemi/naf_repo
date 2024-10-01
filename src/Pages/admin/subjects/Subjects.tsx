import { Box } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import FormModal from "../../../components/FormModal";
import { useRef, useState } from "react";
import SubjectForm from "./SubjectForm";
import SubjectList from "./SubjectList";
import {
  SubjectCreateType,
  SubjectEditFuncType,
  SubjectType,
} from "../../../types/subjects";
import dayjs from "dayjs";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { instructors } from "../instructors/instructors-data";

const SubjectsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [subjects, setSubjects] = useState<SubjectType[] | []>([
    {
      id: 1,
      name: "subject 1",
      duration: "2hr",
      end_date: dayjs("25/12/2024"),
      instructors: instructors,
      phone: "09012345678",
      rank: "Captain",
      start_date: dayjs("01/01/2024"),
    },
    {
      id: 2,
      name: "subject 2",
      duration: "1hr 30min",
      end_date: dayjs("25/12/2024"),
      instructors: instructors,
      phone: "09012345678",
      rank: "Captain",
      start_date: dayjs("01/01/2024"),
    },
    {
      id: 3,
      name: "subject 3",
      duration: "1hr",
      end_date: dayjs("25/12/2024"),
      instructors: instructors,
      phone: "09012345678",
      rank: "Captain",
      start_date: dayjs("01/01/2024"),
    },
  ]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectCreateType>();

  const dispatch = useAppDispatch();
  dispatch(setPageName("Subjects"));

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type != "success") setSelectedSubject(undefined);
  };

  const handdleAddSubject = (subject: SubjectCreateType) => {
    setSubjects((prev) => [...prev, { ...subject, id: prev.length + 1 }]);
    setSelectedSubject(subject);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  const handdleEditSubject = (subject: SubjectType) => {
    setSubjects((prev) => {
      const temp = [...prev];
      const foundSubjectIndex = subjects.findIndex(
        (crs) => crs.id == subject.id
      );
      temp[foundSubjectIndex] = { ...subject };
      return temp;
    });
    handleCloseModal("edit");
    setSelectedSubject(subject);
    handleOpenModal("success");
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects((prev) => prev.filter((crs) => crs.id != id));
  };

  const handleOpenEditModal = (subject: SubjectType) => {
    console.log(subject);

    setSelectedSubject(subject);
    handleOpenModal("edit");
  };

  return (
    <Box ref={containerRef}>
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
          handleCloseModal("edit");
        }}
      >
        <SubjectForm
          actions={{
            submit: openModal.add
              ? handdleAddSubject
              : (handdleEditSubject as SubjectEditFuncType),
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
          }}
          subject={selectedSubject as SubjectType}
        />
      </FormModal>
      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
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
          <SubjectList
            subjects={subjects}
            editSubject={handleOpenEditModal}
            deleteSubject={handleDeleteSubject}
            selectedSubject={selectedSubject as SubjectType}
            setSelectedSubject={setSelectedSubject}
          />
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
