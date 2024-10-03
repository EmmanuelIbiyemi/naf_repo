import { Box } from "@mui/material";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import PageHeader from "../../../components/PageHeader";
import FormModal from "../../../components/FormModal";
import { useState } from "react";
import CBTSubjectForm from "./CBTSubjectForm";
import SuccessModal from "../../../components/SuccessModal";
import { CBTSubjectType } from "../../../types/subjects";
import EmptyState from "../../../components/EmptyState";
import CBTtList from "./CBTList";
import HostCBTModal from "./components/HostCBTModal";

const CBTPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: false,
    host: false,
  });
  const [selectedSubject, setSelectedSubject] = useState<CBTSubjectType>();
  const [subjects, setSubjects] = useState<CBTSubjectType[]>([
    {
      id: 1,
      name: "Subject 1",
      questions: [
        {
          id: 1,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
        {
          id: 2,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
        {
          id: 3,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
      ],
    },
  ]);

  const dispatch = useAppDispatch();
  dispatch(setPageName("CBT Screening"));

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleOpenEditModal = (subject: CBTSubjectType) => {
    handleOpenModal("edit");
    setSelectedSubject(subject);
  };

  const handleOpenDeleteModal = (subject: CBTSubjectType) => {
    handleOpenModal("delete");
    setSelectedSubject(subject);
  };

  const handleAddSubject = (subject: CBTSubjectType) => {
    subject.id = subjects.length + 1;
    setSubjects((prev) => [...prev, subject]);
    handleCloseModal("add");
    setSelectedSubject(subject);
    handleOpenModal("success");
  };
  const handdleEditSubject = (subject: CBTSubjectType) => {
    setSubjects((prev) => {
      const temp = [...prev];
      const foundSubjectIndex = subjects.findIndex(
        (sub) => sub.id == subject.id
      );
      temp[foundSubjectIndex] = subject;
      return temp;
    });
    handleCloseModal("edit");
    handleOpenModal("success");
  };

  return (
    <Box className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
          handleCloseModal("edit");
        }}
      >
        <CBTSubjectForm
          actions={{
            submit: openModal.add ? handleAddSubject : handdleEditSubject,
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
          }}
          subject={selectedSubject}
        />
      </FormModal>

      <HostCBTModal
        open={openModal.host}
        close={() => handleCloseModal("host")}
      />

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
          setSelectedSubject(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new subject`}
        title="Updates Successful"
      />
      <PageHeader
        button={{
          action: () => handleOpenModal("host"),
          text: "Host Test",
        }}
        secondaryButton={{
          action: () => console.log("active tests"),
          text: "Active Tests",
        }}
      />
      <Box
        sx={{
          bgcolor: "rgba(252, 250, 250, 1)",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        {subjects.length ? (
          <CBTtList
            subjects={subjects}
            setSubjects={setSubjects}
            selectedSubject={selectedSubject}
            modals={{
              openModals: openModal,
              handleOpenModal,
              handleCloseModal,
              handleOpenEditModal,
              handleOpenDeleteModal,
            }}
          />
        ) : (
          <EmptyState
            title="Oops there’s nothing here!"
            subTitle="There are no Subjects at the moment."
          />
        )}
      </Box>
    </Box>
  );
};

export default CBTPage;
