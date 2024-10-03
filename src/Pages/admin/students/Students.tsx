import { Box } from "@mui/material";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import FormModal from "../../../components/FormModal";
import { useState } from "react";
import StudentsForm from "./StudentsForm";
import StudentList from "./StudentsList";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import SuccessModal from "../../../components/SuccessModal";
import {
  StudentCreateType,
  StudentEditFuncType,
  StudentType,
} from "../../../types/students";

const StudentsPage = () => {
  const [openModal, setOpenModal] = useState({
    add: false,
    edit: false,
    success: false,
    delete: true,
  });
  const [selectedStudent, setSelectedStudent] = useState<StudentCreateType>();
  const [students, setStudents] = useState<StudentType[] | []>([]);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Students"));

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedStudent(undefined);
  };

  const handleAddStudent = (student: StudentCreateType) => {
    setStudents((prev) => [...prev, { ...student, id: prev.length + 1 }]);
    setSelectedStudent(student);
    handleCloseModal("add");
    handleOpenModal("success");
  };

  const handleEditStudent = (student: StudentType) => {
    setStudents((prev) => {
      const temp = [...prev];
      const foundStudentIndex = students.findIndex(
        (crs) => crs.id == student.id
      );
      temp[foundStudentIndex] = { ...student };
      return temp;
    });
    handleCloseModal("edit");
    setSelectedStudent(student);
    handleOpenModal("success");
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((crs) => crs.id != id));
  };

  const handleOpenEditModal = (student: StudentType) => {
    setSelectedStudent(student);
    handleOpenModal("edit");
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
        <StudentsForm
          actions={{
            submit: openModal.add
              ? handleAddStudent
              : (handleEditStudent as StudentEditFuncType),
            cancel: () =>
              openModal.add
                ? handleCloseModal("add")
                : handleCloseModal("edit"),
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
        subTitle={`You have successfully added a new participant to your school.`}
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
        {students.length ? (
          <StudentList
            students={students}
            editStudent={handleOpenEditModal}
            deleteStudent={handleDeleteStudent}
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
