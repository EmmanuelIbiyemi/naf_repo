import { Box } from "@mui/material";
import PageHeader from "../../../../components/PageHeader";
import EmptyState from "../../../../components/EmptyState";
import FormModal from "../../../../components/FormModal";
import { useEffect, useRef, useState } from "react";
import StudentForm from "./StudentsForm";
import StudentList from "./StudentsList";
import { StudentType, StudentFormAction } from "../../../../types/students";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useAddStudentMutation,
  useGetStudentsQuery,
} from "../../../../store/api/students.api";

const StudentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
  });
  const [studentName, setStudentName] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentType>();
  const { data: students } = useGetStudentsQuery(null);
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
    setSelectedStudent(undefined);
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
          student={selectedStudent}
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
          setSelectedStudent(undefined);
        }}
        infoText="The instructors added in this student will get notified."
        open={openModal.success}
        subTitle={`You have successfully added a new student <strong>“${studentName}”</strong>.`}
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
        {students?.data.length ? (
          <StudentList />
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
