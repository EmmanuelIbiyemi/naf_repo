import { Box } from "@mui/material";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import FormModal from "../../../components/FormModal";
import { useState } from "react";
import CBTQuestionForm from "./CBTQuestionForm";
import SuccessModal from "../../../components/SuccessModal";
import { CBTQuestion, CBTSubjectType } from "../../../types/subjects";
import EmptyState from "../../../components/EmptyState";
import CBTQuestiontList from "./CBTQuestionList";
import QuestionPageHeader from "./components/QuestionPageHeader";

const CBTQuestionsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedQuestion, setSelectedQuestion] = useState<CBTQuestion>();
  const [subject, setSubject] = useState<CBTSubjectType>({
    id: 1,
    name: "Subject 1",
    questions: [],
  });

  const dispatch = useAppDispatch();
  dispatch(setPageName("CBT Screening"));

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleOpenEditModal = (question: CBTQuestion) => {
    handleOpenModal("edit");
    setSelectedQuestion(question);
  };

  const handleOpenDeleteModal = (question: CBTQuestion) => {
    handleOpenModal("delete");
    setSelectedQuestion(question);
  };

  const handleAddQuestion = (question: CBTQuestion) => {
    question.id = subject.questions.length + 1;
    subject.questions.push(question);
    handleCloseModal("add");
    setSelectedQuestion(question);
    handleOpenModal("success");
  };

  const handleEditQuestion = (question: CBTQuestion) => {
    console.log(question);

    setSubject((prev) => {
      const foundQuestion = prev.questions.find(
        (q) => q.id == question.id
      ) as CBTQuestion;
      foundQuestion.answer = question.answer;
      foundQuestion.options = question.options;
      foundQuestion.question = question.question;
      return prev;
    });
    handleCloseModal("edit");
    handleOpenModal("success");
  };

  const setQuestions = (questions: CBTQuestion[]) => {
    subject.questions = questions;
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
        <CBTQuestionForm
          actions={{
            submit: openModal.add ? handleAddQuestion : handleEditQuestion,
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
          }}
          question={selectedQuestion}
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
          setSelectedQuestion(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new question`}
        title="Updates Successful"
      />
      <QuestionPageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Question",
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
        {subject.questions.length ? (
          <CBTQuestiontList
            questions={subject.questions}
            setQuestions={setQuestions}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
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
            subTitle="There are no Questions at the moment."
          />
        )}
      </Box>
    </Box>
  );
};

export default CBTQuestionsPage;
