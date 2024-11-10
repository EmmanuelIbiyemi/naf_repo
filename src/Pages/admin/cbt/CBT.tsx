import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import CBTForm from "./components/QuizzesForm";
import QuizList from "./CBTsList";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import SuccessModal from "../../../components/SuccessModal";
import LoadingScreen from "../../../components/LoadingScreen";
import FormModal from "../../../components/FormModal";
import EmptyState from "../../../components/EmptyState";
import { useGetQuizzesQuery } from "../../../store/api/quizzes.api";
import PageHeader from "../../../components/PageHeader";

const CBTsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const { data: Quizzes, isLoading } = useGetQuizzesQuery(null);

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Quizzes"));
  }, []);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <Box className="content-container">
      {[isLoading].some((item) => item) ? (
        <Box sx={{ position: "relative", zIndex: 2000 }}>
          <LoadingScreen />
        </Box>
      ) : null}
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
        }}
      >
        <CBTForm
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
        subTitle={`You have successfully added a new Quiz to your school.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Quiz",
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
        {Quizzes?.data.length ? (
          <QuizList />
        ) : (
          <EmptyState
            title="No Exams at this time"
            subTitle="Exams will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default CBTsPage;
