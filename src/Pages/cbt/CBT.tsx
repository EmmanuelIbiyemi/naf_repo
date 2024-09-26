import { Box } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import { setPageName } from "../../store/app.slice";
import PageHeader from "../../components/PageHeader";
import FormModal from "../../components/FormModal";
import { useState } from "react";
import CBTSubjectForm from "./CBTSubjectForm";
import SuccessModal from "../../components/SuccessModal";
import { CBTSubjectType } from "../../types/subjects";
import EmptyState from "../../components/EmptyState";
import CBTtList from "./CBTList";

const CBTPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [selectedSubject, setSelectedSubject] = useState<CBTSubjectType>();
  const [subjects] = useState<CBTSubjectType[]>([
    {
      id: 1,
      name: "Subject 1",
      questions: [
        {
          id: 1,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
        {
          id: 2,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
        {
          id: 3,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
      ],
    },
  ]);

  const dispatch = useAppDispatch();
  dispatch(setPageName("CBT Screening"));

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddSubject = (subject: CBTSubjectType) => {
    console.log(subject);
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
            submit: handleAddSubject,
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
          }}
          subject={selectedSubject}
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
          setSelectedSubject(undefined);
        }}
        infoText="The students enrolled in this subject will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new subject to the course <strong>“${selectedSubject?.name}”</strong>.`}
        title="Updates Successful"
      />
      <PageHeader />
      <Box
        sx={{
          bgcolor: "rgba(252, 250, 250, 1)",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        {subjects.length ? (
          <CBTtList />
        ) : (
          <EmptyState
            title="Oops there’s nothing here!"
            subTitle="There are no questions at the moment."
          />
        )}
      </Box>
    </Box>
  );
};

export default CBTPage;
