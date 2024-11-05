import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { LecturerFormAction, Lecturer } from "../../../../types/lecturers";
import { Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteLecturerMutation,
  useGetLecturersQuery,
  useUpdateLecturerMutation,
} from "../../../../store/api/lecturers.api";
import FormModal from "../../../../components/FormModal";
import LecturerForm from "./LecturersForm";
import SuccessModal from "../../../../components/SuccessModal";

const LecturersList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer>();
  const { data: lecturers } = useGetLecturersQuery(null);
  const [deleteLecturer] = useDeleteLecturerMutation();
  const [updateLecturer] = useUpdateLecturerMutation();

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

  const handleEditLecturer = async (lecturer: Lecturer) => {
    try {
      await updateLecturer(lecturer).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(lecturer, "success");
  };

  return (
    <TableContainer>
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
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The students enrolled in this Lecturer will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Lecturer <strong>“${
          selectedLecturer?.first_name + " " + selectedLecturer?.last_name
        }”</strong>? You can’t undo this action.`}
        title="Delete Lecturer?"
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
          setSelectedLecturer(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Lecturer <strong>“${selectedLecturer?.first_name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {lecturers?.data.map((lecturer: Lecturer) => (
            <TableRow
              key={lecturer.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Typography
                  style={{ textTransform: "capitalize", fontWeight: 500 }}
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LecturersList;
