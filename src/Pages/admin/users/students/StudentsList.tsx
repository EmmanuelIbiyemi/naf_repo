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
import CustomPagination from "../../../../components/CustomPagination";
import { Pagination } from "../../../../types/pagination";
import StudentSidebar from "./StudentSidebar";

const StudentsList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
    sidebar: false,
  });
  const [selectedStudent, setSelectedStudent] = useState<StudentType>();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const {
    data: stds,
    isFetching,
    isError,
  } = useGetStudentsQuery({ ...pagination, search_term: keyword });
  const [students, setStudents] = useState(stds?.data);
  const [deleteStudent] = useDeleteStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();

  useEffect(() => {
    if (stds?.data) setStudents(stds?.data);
  }, [keyword, stds]);

  useEffect(() => {
    if (isFetching && isError) dispatch(setPageLoading(true));
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
      <StudentSidebar
        open={openModal.sidebar}
        student={selectedStudent}
        toggleDrawer={() => handleCloseModal("sidebar")}
      />
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

      {stds?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
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
                      style={{
                        cursor: "pointer",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                      onClick={() => handleOpenModal(student, "sidebar")}
                    >
                      {student.first_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenModal(student, "edit")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenModal(student, "delete")}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <CustomPagination
            count={Math.ceil(
              stds?.pagination.total / stds?.pagination.per_page
            )}
            page={stds?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: stds?.pagination.per_page, page });
            }}
            startIndex={
              stds?.pagination.per_page * (stds?.pagination.page - 1) + 1
            }
            endIndex={stds?.pagination.per_page * stds?.pagination.page}
            totalNumber={stds?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default StudentsList;
