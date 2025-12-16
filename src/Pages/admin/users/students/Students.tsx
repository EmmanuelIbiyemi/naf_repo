import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import StudentForm from "./StudentsForm";
import StudentList from "./StudentsList";
import { StudentType, StudentFormAction } from "../../../../types/students";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import { useAddStudentMutation } from "../../../../store/api/students.api";

const StudentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [studentName, setStudentName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [addStudent] = useAddStudentMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Users/Students"));
  }, [dispatch]);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleAddStudent = async (student: StudentType) => {
    try {
      await addStudent(student).unwrap();
      handleCloseModal("add");
      handleOpenModal("success");
      setStudentName(student.first_name + " " + student.last_name);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box ref={containerRef} className="content-container">
      <FormModal open={openModal.add} close={() => handleCloseModal("add")}>
        <StudentForm
          actions={{
            submit: handleAddStudent as StudentFormAction,
            cancel: () => handleCloseModal("add"),
          }}
        />
      </FormModal>

      <SuccessModal
        close={() => {
          handleCloseModal("success");
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new student "${studentName}".`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => setOpenModal((prev) => ({ ...prev, add: true })),
          text: "Add Students",
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
        <StudentList />
      </Box>
    </Box>
  );
};

export default StudentsPage;
