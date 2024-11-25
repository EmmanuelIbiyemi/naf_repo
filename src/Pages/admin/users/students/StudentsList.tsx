import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { StudentFormAction, StudentType } from "../../../../types/students";
import { Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteStudentMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../../../../store/api/students.api";
import FormModal from "../../../../components/FormModal";
import StudentForm from "./StudentsForm";
import SuccessModal from "../../../../components/SuccessModal";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";

const StudentsList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedStudent, setSelectedStudent] = useState<StudentType>();
  const { data: stds, isFetching, isError } = useGetStudentsQuery(null);
  const [students, setStudents] = useState(stds?.data);
  const [deleteStudent] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && stds?.data)
      setStudents(
        stds.data.filter(
          (f) =>
            f.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
            f.last_name.toLowerCase().includes(keyword.toLowerCase()) ||
            f.email.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setStudents(stds?.data);
  }, [keyword, stds]);

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, stds]);

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
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Student ${selectedStudent?.first_name} ${selectedStudent?.last_name}" ?`}
        title="Delete Student?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedStudent(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Student "${selectedStudent?.first_name}".`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {isError ? (
            <EmptyState
              title="Could not fetch Students"
              subTitle="Check your internet connection"
            />
          ) : null}
          {!students?.length ? (
            <EmptyState
              title="No Students found"
              subTitle="Students will appear here after you add them in your school."
            />
          ) : null}
          {students?.map((student: StudentType) => (
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
                <Typography
                  sx={{
                    fontWeight: "500 !important",
                    textTransform: "capitalize",
                  }}
                >
                  {student.first_name}
                </Typography>
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
