import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import LecturerForm from "./LecturersForm";
import LecturerList from "./LecturersList";
import { Lecturer, LecturerFormAction } from "../../../../types/lecturers";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageLoading, setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddLecturerMutation } from "../../../../store/api/lecturers.api";

const LecturersPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [lecturerName, setLecturerName] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [addLecturer, addState] = useAddLecturerMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Users/Lecturers"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedLecturer(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddLecturer = async (lecturer: Lecturer) => {
    try {
      await addLecturer(lecturer).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setLecturerName(`${lecturer.first_name} ${lecturer.last_name}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (addState.isLoading) dispatch(setPageLoading(true));
    else if (addState.isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [addState]);

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <LecturerForm
          actions={{
            submit: handleAddLecturer as LecturerFormAction,
            cancel: () => handleCloseModal("add"),
          }}
          lecturer={selectedLecturer}
        />
      </FormModal>

      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedLecturer(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new lecturer "${lecturerName}".`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Lecturers",
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
        <LecturerList />
      </Box>
    </Box>
  );
};

export default LecturersPage;
