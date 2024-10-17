import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ExamOfficerFormAction, ExamOfficer } from "../../../../types/examOfficers";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteExamOfficerMutation,
  useGetExamOfficersQuery,
  useUpdateExamOfficerMutation,
} from "../../../../store/api/examOfficers.api";
import FormModal from "../../../../components/FormModal";
import ExamOfficerForm from "./ExamOfficersForm";
import SuccessModal from "../../../../components/SuccessModal";

const ExamOfficersList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedExamOfficer, setSelectedExamOfficer] = useState<ExamOfficer>();
  const { data: examOfficers } = useGetExamOfficersQuery(null);
  const [deleteExamOfficer] = useDeleteExamOfficerMutation();
  const [updateExamOfficer] = useUpdateExamOfficerMutation();

  const handleOpenModal = (examOfficer: ExamOfficer, type: string) => {
    setSelectedExamOfficer(examOfficer);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedExamOfficer(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (examOfficer_id: number) => {
    try {
      await deleteExamOfficer(examOfficer_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditExamOfficer = async (examOfficer: ExamOfficer) => {
    try {
      await updateExamOfficer(examOfficer).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(examOfficer, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <ExamOfficerForm
          actions={{
            submit: handleEditExamOfficer as ExamOfficerFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          examOfficer={selectedExamOfficer}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedExamOfficer) handleDelete(selectedExamOfficer.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The students enrolled in this ExamOfficer will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete ExamOfficer <strong>“${selectedExamOfficer?.first_name + ' ' + selectedExamOfficer?.last_name}”</strong>? You can’t undo this action.`}
        title="Delete ExamOfficer?"
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
          setSelectedExamOfficer(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new ExamOfficer <strong>“${selectedExamOfficer?.first_name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {examOfficers?.data.map((examOfficer: ExamOfficer) => (
            <TableRow
              key={examOfficer.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/examOfficers/${examOfficer.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {examOfficer.first_name}
                </Link>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(examOfficer, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(examOfficer, "delete")}>
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

export default ExamOfficersList;
