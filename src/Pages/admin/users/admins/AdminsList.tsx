import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { AdminFormAction, Admin } from "../../../../types/admins";
import { Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminMutation,
} from "../../../../store/api/admins.api";
import FormModal from "../../../../components/FormModal";
import AdminForm from "./AdminsForm";
import SuccessModal from "../../../../components/SuccessModal";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import AdminSidebar from "./AdminSidebar";

const AdminsList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
    sidebar: false,
  });
  const [selectedAdmin, setSelectedAdmin] = useState<Admin>();
  const { data: adminsData, isFetching, isError } = useGetAdminsQuery(null);
  const [admins, setAdmins] = useState<Admin[] | undefined>(adminsData?.data);
  const [deleteAdmin] = useDeleteAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && adminsData?.data)
      setAdmins(
        adminsData.data.filter(
          (f) =>
            f.first_name.toLowerCase().includes(keyword.toLowerCase()) ||
            f.last_name.toLowerCase().includes(keyword.toLowerCase()) ||
            f.email.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setAdmins(adminsData?.data);
  }, [keyword, adminsData]);

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, adminsData]);

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

  const handleEditAdmin = async (admin: Admin) => {
    try {
      await updateAdmin(admin).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(admin, "success");
  };

  return (
    <TableContainer>
      <AdminSidebar
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

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedAdmin(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Admin ${selectedAdmin?.first_name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
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
          {admins?.map((admin: Admin) => (
            <TableRow
              key={admin.id}
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
                    textTransform: "capitalize",
                    fontWeight: 500,
                  }}
                  onClick={() => setSelectedAdmin(admin)}
                >
                  {admin.first_name} {admin.last_name}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(admin, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(admin, "delete")}>
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

export default AdminsList;
