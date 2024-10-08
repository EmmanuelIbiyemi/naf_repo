import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteProgramMutation,
  useGetProgramsQuery,
  useUpdateProgramMutation,
} from "../../../store/api/programs.api";
import FormModal from "../../../components/FormModal";
import SuccessModal from "../../../components/SuccessModal";
import ProgramForm from "./ProgramForm";
import { FormAction } from "../../../types/forms";
import { ProgramType } from "../../../types/programs";

const ProgramList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>();
  const { data: programs } = useGetProgramsQuery(null);
  const [deleteProgram] = useDeleteProgramMutation();
  const [updateProgram] = useUpdateProgramMutation();

  const handleOpenModal = (program: ProgramType, type: string) => {
    setSelectedProgram(program);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedProgram(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (course_id: number) => {
    try {
      await deleteProgram(course_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProgram = async (program: ProgramType) => {
    try {
      await updateProgram(program).unwrap();
      console.log(program);
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(program, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <ProgramForm
          actions={{
            submit: handleEditProgram as FormAction<ProgramType>,
            cancel: () => handleCloseModal("edit"),
          }}
          program={selectedProgram}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedProgram) handleDelete(selectedProgram.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The students enrolled in this Program will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Program <strong>“${selectedProgram?.name}”</strong>? You can’t undo this action.`}
        title="Delete Program?"
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
          setSelectedProgram(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Program <strong>“${selectedProgram?.name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {programs?.data.map((program) => (
            <TableRow
              key={program.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/program/${program.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {program.name}
                </Link>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(program, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(program, "delete")}>
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

export default ProgramList;
