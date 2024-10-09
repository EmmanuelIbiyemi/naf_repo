import { Box } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import FormModal from "../../../components/FormModal";
import { useEffect, useState } from "react";
import StudentsForm from "./StudentsForm";
import StudentList from "./StudentsList";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import SuccessModal from "../../../components/SuccessModal";
import { StudentCreateType, StudentType } from "../../../types/students";
import {
  useAddStudentMutation,
  useGetStudentsQuery,
} from "../../../store/api/students.api";
import LoadingScreen from "../../../components/LoadingScreen";

const StudentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [selectedStudent, setSelectedStudent] = useState<StudentCreateType>();
  const { data: students, isLoading } = useGetStudentsQuery(null);
  const [addStudent, addState] = useAddStudentMutation();

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Students"));
  }, []);

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedStudent(undefined);
  };

  const handleAddStudent = async (student: StudentCreateType) => {
    try {
      await addStudent(student).unwrap();
    } catch (error) {
      console.log(error);
    }
    setSelectedStudent(student);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  return (
    <Box className="content-container">
      {[isLoading, addState.isLoading].some((item) => item) ? (
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
        <StudentsForm
          actions={{
            submit: handleAddStudent,
            cancel: () => handleCloseModal("add"),
          }}
          student={selectedStudent as StudentType}
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
        infoText="The student added will get notified via mail."
        open={openModal.success}
        subTitle={`You have successfully added a new student to your school.`}
        title="Updates Successful"
      />

      <PageHeader
        button={{
          action: () => handleOpenModal("add"),
          text: "Add Student",
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
        {students?.data.length ? (
          <StudentList
            selectedStudent={selectedStudent as StudentType}
            setSelectedStudent={setSelectedStudent}
          />
        ) : (
          <EmptyState
            title="No Students at this time"
            subTitle="Students will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default StudentsPage;
