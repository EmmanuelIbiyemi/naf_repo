import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import FormModal from "../../../../components/FormModal";
import PageHeader from "../../../../components/PageHeader";
import QuestionList from "./QuestionList";
import QuestionsForm from "./components/QuestionsForm";

const QuestionsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Quizzes/Questions"));
  }, []);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <Box className="content-container">
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
        }}
      >
        <QuestionsForm
          actions={{
            cancel: () => handleCloseModal("add"),
          }}
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
        close={() => handleCloseModal("success")}
        infoText="The Quiz added will get notified via mail."
        open={openModal.success}
        subTitle={`You have successfully added a new questions your school.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Upload Questions",
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
        <QuestionList />
      </Box>
    </Box>
  );
};

export default QuestionsPage;
