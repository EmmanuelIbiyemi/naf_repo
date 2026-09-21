import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { LecturerFormAction, Lecturer } from "../../../../types/lecturers";
import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit, LockReset } from "@mui/icons-material"; // <-- added LockReset
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useDeleteLecturerMutation,
  useGetLecturersQuery,
  useUpdateLecturerMutation,
} from "../../../../store/api/lecturers.api";
import { useResetUserPasswordMutation } from "../../../../store/api/auth.api"; // <-- imported reset mutation
import FormModal from "../../../../components/FormModal";
import LecturerForm from "./LecturersForm";
import SuccessModal from "../../../../components/SuccessModal";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import EmptyState from "../../../../components/EmptyState";
import { Pagination } from "../../../../types/pagination";
import CustomPagination from "../../../../components/CustomPagination";
import LecturerSidebar from "./LecturerSidebar";

const LecturersList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
    sidebar: false,
    bulkDelete: false,
    resetPassword: false, // <-- added flag for reset password
  });
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer>();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const dispatch = useAppDispatch();
  const keyword = useAppSelector(selectKeyword);
  const {
    data: ltcs,
    isFetching,
    isError,
  } = useGetLecturersQuery({ ...pagination, search_term: keyword });
  const [lecturers, setLecturers] = useState(ltcs?.data);
  const [deleteLecturer, deleteState] = useDeleteLecturerMutation();
  const [updateLecturer, updateState] = useUpdateLecturerMutation();
  const [resetUserPassword, resetUserPasswordState] = useResetUserPasswordMutation(); // <-- added reset mutation
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    if (ltcs?.data) setLecturers(ltcs?.data);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!ltcs?.data.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [keyword, ltcs]);

  useEffect(() => {
    if (
      isFetching ||
      deleteState.isLoading ||
      updateState.isLoading ||
      resetUserPasswordState.isLoading // <-- include reset state
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, ltcs, deleteState, updateState, resetUserPasswordState]);

  const handleOpenModal = (lecturer: Lecturer, type: string) => {
    setSelectedLecturer(lecturer);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedLecturer(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (lecturer_id: number) => {
    try {
      await deleteLecturer(lecturer_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (lecturers?.length && event.target.checked)
      setDeleteIds(lecturers.map((ltc) => ltc.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    lecturerId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != lecturerId);
    setDeleteIds(event.target.checked ? [...newIds, lecturerId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteLecturer(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        console.log(error);
      }
  };

  const handleEditLecturer = async (lecturer: Lecturer) => {
    try {
      await updateLecturer(lecturer).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(lecturer, "success");
  };

  // New reset password handler for lecturers
  const handleResetPassword = async (lecturer: Lecturer) => {
    try {
      const result = await resetUserPassword(lecturer.user_id as number).unwrap();
      console.log(result.message);
      setSelectedLecturer(lecturer);
      setOpenModal((prev) => ({ ...prev, resetPassword: true }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer>
      <LecturerSidebar
        open={openModal.sidebar}
        lecturer={selectedLecturer}
        toggleDrawer={() => handleCloseModal("sidebar")}
      />
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <LecturerForm
          actions={{
            submit: handleEditLecturer as LecturerFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          lecturer={selectedLecturer}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedLecturer) handleDelete(selectedLecturer.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Lecturer "${selectedLecturer?.first_name} ${selectedLecturer?.last_name}"?.`}
        title="Delete Lecturer?"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Instructors ?`}
        title="Delete Instructors?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedLecturer(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Lecturer ${selectedLecturer?.first_name}.`}
        title="Updates Successful"
      />

      {/* Reset Password Success */}
      <SuccessModal
        close={() => handleCloseModal("resetPassword")}
        infoText=""
        open={openModal.resetPassword}
        subTitle={`You have successfully reset the password for ${selectedLecturer?.first_name}.`}
        title="Password Reset Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Lecturers"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!lecturers?.length ? (
        <EmptyState
          title="No Lecturers found"
          subTitle="Lecturers will appear here after you add them in your school."
        />
      ) : null}

      {/* Bulk delete */}
      <Box sx={{ paddingLeft: "1rem", display: "flex", gap: "1rem" }}>
        <Checkbox
          onChange={handleSelectAll}
          checked={lecturers?.length === deleteIds.length}
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
      {ltcs?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {lecturers?.map((lecturer) => (
                <TableRow
                  key={lecturer.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Checkbox
                      onChange={(event) =>
                        handleSelect(event, lecturer.id as number)
                      }
                      checked={deleteIds.includes(lecturer.id as number)}
                    />
                    <Typography
                      style={{
                        cursor: "pointer",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                      onClick={() => handleOpenModal(lecturer, "sidebar")}
                    >
                      {lecturer.first_name} {lecturer.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenModal(lecturer, "edit")}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleOpenModal(lecturer, "delete")}>
                      <Delete />
                    </IconButton>
                    <IconButton 
                      onClick={() => lecturer.user_id && handleResetPassword(lecturer)}
                      disabled={!lecturer.user_id}
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
              ltcs?.pagination.total / ltcs?.pagination.per_page
            )}
            page={ltcs?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: ltcs?.pagination.per_page, page });
            }}
            startIndex={
              ltcs?.pagination.per_page * (ltcs?.pagination.page - 1) + 1
            }
            endIndex={ltcs?.pagination.per_page * ltcs?.pagination.page}
            totalNumber={ltcs?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default LecturersList;
