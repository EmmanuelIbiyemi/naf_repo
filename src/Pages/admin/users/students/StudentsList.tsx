import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { StudentFormAction, StudentType } from "../../../../types/students";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteStudentMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../../../../store/api/students.api";
import FormModal from "../../../../components/FormModal";
import StudentForm from "./StudentsForm";
import SuccessModal from "../../../../components/SuccessModal";

const StudentsList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedStudent, setSelectedStudent] = useState<StudentType>();
  const { data: students } = useGetStudentsQuery(null);
  const [deleteStudent] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();

  const handleOpenModal = (student: StudentType, type: string) => {
    setSelectedStudent(student);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedStudent(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (student_id: number) => {
    try {
      await deleteStudent(student_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditStudent = async (student: StudentType) => {
    try {
      await updateStudent(student).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(student, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <StudentForm
          actions={{
            submit: handleEditStudent as StudentFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          student={selectedStudent}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedStudent) handleDelete(selectedStudent.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The students enrolled in this Student will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Student <strong>“${
          selectedStudent?.first_name + " " + selectedStudent?.last_name
        }”</strong>? You can’t undo this action.`}
        title="Delete Student?"
      />

      {/* Success */}
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
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Student <strong>“${selectedStudent?.first_name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {students?.data.map((student: StudentType) => (
            <TableRow
              key={student.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/students/${student.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {student.first_name}
                </Link>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(student, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(student, "delete")}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentsList;
