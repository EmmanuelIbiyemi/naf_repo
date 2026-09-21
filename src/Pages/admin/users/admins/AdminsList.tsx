import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { AdminFormAction, Admin } from "../../../../types/admins";
import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit, LockReset } from "@mui/icons-material"; // <-- added LockReset
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminMutation,
} from "../../../../store/api/admins.api";
import { useResetUserPasswordMutation } from "../../../../store/api/auth.api"; // <-- imported reset mutation
import FormModal from "../../../../components/FormModal";
import AdminForm from "./AdminsForm";
import SuccessModal from "../../../../components/SuccessModal";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { Pagination } from "../../../../types/pagination";
import CustomPagination from "../../../../components/CustomPagination";
import AdminSidebar from "./AdminSidebar";

const AdminsList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
    sidebar: false,
    bulkDelete: false,
    resetPassword: false, // <-- added flag for reset password
  });
  const [selectedAdmin, setSelectedAdmin] = useState<Admin>();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const {
    data: adminsData,
    isFetching,
    isError,
  } = useGetAdminsQuery({ ...pagination, search_term: keyword });
  const [admins, setAdmins] = useState<Admin[] | undefined>(adminsData?.data);
  const [deleteAdmin, deleteState] = useDeleteAdminMutation();
  const [updateAdmin, updateState] = useUpdateAdminMutation();
  const [resetUserPassword, resetUserPasswordState] = useResetUserPasswordMutation(); // <-- added reset mutation
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    if (adminsData?.data) setAdmins(adminsData?.data);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!adminsData?.data.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [keyword, adminsData]);

  useEffect(() => {
    if (
      (isFetching && !isError) ||
      deleteState.isLoading ||
      updateState.isLoading ||
      resetUserPasswordState.isLoading // <-- include reset state
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, adminsData, deleteState, updateState, resetUserPasswordState]);

  const handleOpenModal = (admin: Admin, type: string) => {
    setSelectedAdmin(admin);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedAdmin(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (admin_id: number) => {
    try {
      await deleteAdmin(admin_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (admins?.length && event.target.checked)
      setDeleteIds(admins.map((fac) => fac.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    facultyId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != facultyId);
    setDeleteIds(event.target.checked ? [...newIds, facultyId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteAdmin(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        console.log(error);
      }
  };

  const handleEditAdmin = async (admin: Admin) => {
    try {
      await updateAdmin(admin).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(admin, "success");
  };

  // New reset password handler
  const handleResetPassword = async (admin: Admin) => {
    try {
      const result = await resetUserPassword(admin.user_id as number).unwrap();
      console.log(result.message);
      setSelectedAdmin(admin);
      setOpenModal((prev) => ({ ...prev, resetPassword: true }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TableContainer>
      <AdminSidebar
        open={openModal.sidebar}
        admin={selectedAdmin}
        toggleDrawer={() => handleCloseModal("sidebar")}
      />
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <AdminForm
          actions={{
            submit: handleEditAdmin as AdminFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          admin={selectedAdmin}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedAdmin) handleDelete(selectedAdmin.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Admin "${selectedAdmin?.first_name} ${selectedAdmin?.last_name}" ?`}
        title="Delete Admin?"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Admins ?`}
        title="Delete Admins?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedAdmin(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Admin ${selectedAdmin?.first_name}.`}
        title="Updates Successful"
      />

      {/* Reset Password Success */}
      <SuccessModal
        close={() => handleCloseModal("resetPassword")}
        infoText=""
        open={openModal.resetPassword}
        subTitle={`You have successfully reset the password for ${selectedAdmin?.first_name}.`}
        title="Password Reset Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Lecturers"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!admins?.length ? (
        <EmptyState
          title="No Lecturers found"
          subTitle="Lecturers will appear here after you add them in your school."
        />
      ) : null}

      {/* Bulk delete */}
      <Box sx={{ paddingLeft: "1rem", display: "flex", gap: "1rem" }}>
        <Checkbox
          onChange={handleSelectAll}
          checked={admins?.length === deleteIds.length}
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
      {adminsData?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {admins?.map((admin) => (
                <TableRow
                  key={admin.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Checkbox
                      onChange={(event) =>
                        handleSelect(event, admin.id as number)
                      }
                      checked={deleteIds.includes(admin.id as number)}
                    />
                    <Typography
                      style={{
                        cursor: "pointer",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                      onClick={() => handleOpenModal(admin, "sidebar")}
                    >
                      {admin.first_name} {admin.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenModal(admin, "edit")}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenModal(admin, "delete")}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton 
                      onClick={() => admin.user_id && handleResetPassword(admin)}
                      disabled={!admin.user_id}
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
              adminsData?.pagination.total / adminsData?.pagination.per_page
            )}
            page={adminsData?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({
                per_page: adminsData?.pagination.per_page,
                page,
              });
            }}
            startIndex={
              adminsData?.pagination.per_page *
                (adminsData?.pagination.page - 1) +
              1
            }
            endIndex={
              adminsData?.pagination.per_page * adminsData?.pagination.page
            }
            totalNumber={adminsData?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default AdminsList;
