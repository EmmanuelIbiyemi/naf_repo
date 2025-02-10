import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { StudentFormAction, StudentType } from "../../../../types/students";
import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit, LockReset } from "@mui/icons-material"; // <-- added LockReset icon
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useDeleteStudentMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../../../../store/api/students.api";
import { useResetUserPasswordMutation } from "../../../../store/api/auth.api"; // <-- import the reset mutation
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
    bulkDelete: false,
    resetPassword: false, // <-- new flag
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
  const [deleteStudent, deleteState] = useDeleteStudentMutation();
  const [updateStudent, updateState] = useUpdateStudentMutation();
  const [resetUserPassword, resetUserPasswordState] = useResetUserPasswordMutation(); // <-- add reset password mutation
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    if (stds?.data) setStudents(stds?.data);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!stds?.data.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [keyword, stds]);

  useEffect(() => {
    if (
      (isFetching && isError) ||
      deleteState.isLoading ||
      updateState.isLoading ||
      resetUserPasswordState.isLoading
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, stds, deleteState, updateState, resetUserPasswordState]);

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

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (students?.length && event.target.checked)
      setDeleteIds(students.map((std) => std.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    studentId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != studentId);
    setDeleteIds(event.target.checked ? [...newIds, studentId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteStudent(id).unwrap();
        setDeleteIds([]);
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

  const handleResetPassword = async (student: StudentType) => {
    try {
      const result = await resetUserPassword(student.user_id as number).unwrap();
      console.log(result.message);
      setSelectedStudent(student);
      setOpenModal((prev) => ({ ...prev, resetPassword: true }));
    } catch (error) {
      console.log(error);
    }
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

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Students ?`}
        title="Delete Students?"
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

      {/* Reset Password Success */}
      <SuccessModal
        close={() => handleCloseModal("resetPassword")}
        infoText=""
        open={openModal.resetPassword}
        subTitle={`You have successfully reset the password for ${selectedStudent?.first_name}.`}
        title="Password Reset Successful"
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

      {/* Bulk delete */}
      <Box sx={{ paddingLeft: "1rem", display: "flex", gap: "1rem" }}>
        <Checkbox
          onChange={handleSelectAll}
          checked={students?.length == deleteIds.length}
        />
        {deleteIds.length ? (
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              setOpenModal((prev) => ({ ...prev, bulkDelete: true }))
            }
          >
            <Delete sx={{ marginRight: ".3rem" }} />
            Delete selected
          </Button>
        ) : null}
      </Box>
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
                    <Checkbox
                      onChange={(event) =>
                        handleSelect(event, student.id as number)
                      }
                      checked={deleteIds.includes(student.id as number)}
                    />
                    <Typography
                      style={{
                        cursor: "pointer",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                      onClick={() => handleOpenModal(student, "sidebar")}
                    >
                      {student.first_name} {student.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {student.matric_number}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenModal(student, "edit")}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenModal(student, "delete")}>
                      <Delete />
                    </IconButton>
                    <IconButton 
                      onClick={() => student.user_id && handleResetPassword(student)}
                      disabled={!student.user_id}
                    >
                      <LockReset />
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
