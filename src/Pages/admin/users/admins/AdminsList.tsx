import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { AdminFormAction, Admin } from "../../../../types/admins";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteAdminMutation,
  useGetAdminsQuery,
  useUpdateAdminMutation,
} from "../../../../store/api/admins.api";
import FormModal from "../../../../components/FormModal";
import AdminForm from "./AdminsForm";
import SuccessModal from "../../../../components/SuccessModal";

const AdminsList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedAdmin, setSelectedAdmin] = useState<Admin>();
  const { data: admins } = useGetAdminsQuery(null);
  const [deleteAdmin] = useDeleteAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();

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
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The students enrolled in this Admin will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Admin <strong>“${selectedAdmin?.first_name + ' ' + selectedAdmin?.last_name}”</strong>? You can’t undo this action.`}
        title="Delete Admin?"
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
          setSelectedAdmin(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Admin <strong>“${selectedAdmin?.first_name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {admins?.data.map((admin: Admin) => (
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
                <Link
                  to={`/admins/${admin.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {admin.first_name}
                </Link>
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
