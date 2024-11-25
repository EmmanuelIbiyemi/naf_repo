import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import CBTForm from "./components/QuizzesForm";
import QuizList from "./CBTsList";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import SuccessModal from "../../../components/SuccessModal";
import FormModal from "../../../components/FormModal";
import PageHeader from "../../../components/PageHeader";

const CBTsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });

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
      <FormModal
        open={openModal.add || openModal.edit}
        close={() => {
          handleCloseModal("add");
        }}
      >
        <CBTForm
          actions={{
            cancel: () => {
              handleCloseModal("add");
              handleCloseModal("success");
            },
          }}
        />
      </FormModal>

      <SuccessModal
        close={() => handleCloseModal("success")}
        infoText=""
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
        <QuizList />
      </Box>
    </Box>
  );
};

export default CBTsPage;
