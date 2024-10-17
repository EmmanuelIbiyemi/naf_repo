import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import EmptyState from "../../../../components/EmptyState";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import ExamOfficerForm from "./ExamOfficersForm";
import ExamOfficerList from "./ExamOfficersList";
import {
  ExamOfficer,
  ExamOfficerFormAction
} from "../../../../types/examOfficers";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useAddExamOfficerMutation,
  useGetExamOfficersQuery,
} from "../../../../store/api/examOfficers.api";

const ExamOfficersPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [examOfficerName, setExamOfficerName] = useState("");
  const [selectedExamOfficer, setSelectedExamOfficer] = useState<ExamOfficer>();
  const { data: examOfficers } = useGetExamOfficersQuery(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [addExamOfficer] = useAddExamOfficerMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Academics/Exam Officers"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedExamOfficer(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddExamOfficer = async (examOfficer: ExamOfficer) => {
    try {
      await addExamOfficer(examOfficer).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setExamOfficerName(examOfficer.first_name + ' ' + examOfficer.last_name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <ExamOfficerForm
          actions={{
            submit: handleAddExamOfficer as ExamOfficerFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          examOfficer={selectedExamOfficer}
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
          setSelectedExamOfficer(undefined);
        }}
        infoText="The instructors added in this examOfficer will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new examOfficer <strong>“${examOfficerName}”</strong>.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add ExamOfficers",
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
        {examOfficers?.data.length ? (
          <ExamOfficerList />
        ) : (
          <EmptyState
            title="No ExamOfficers at this time"
            subTitle="ExamOfficers will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default ExamOfficersPage;
