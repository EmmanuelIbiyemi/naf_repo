import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import FormModal from "../../../../components/FormModal";
import GradeForm from "./GradesForm";
import SuccessModal from "../../../../components/SuccessModal";
import {
  useDeleteGradeMutation,
  useGetGradesQuery,
  useUpdateGradeMutation,
} from "../../../../store/api/grades.api";

import { Grade, GradeFormAction } from '../../../../types/grades';

const GradesList: React.FC = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedGrade, setSelectedGrade] = useState<Grade>();
  const { data: grades, isLoading } = useGetGradesQuery(null);
  const [deleteGrade] = useDeleteGradeMutation();
  const [updateGrade] = useUpdateGradeMutation();
  
  const handleOpenModal = (grade: Grade, type: string) => {
    setSelectedGrade(grade);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedGrade(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (grade_id: number) => {
    try {
      await deleteGrade(grade_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditGrade = async (grade: Grade) => {
    try {
      await updateGrade(grade).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(grade, "success");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!grades?.data || grades.data.length === 0) {
    return <div>No grades found.</div>;
  }

  return (
    <TableContainer>
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <GradeForm
          actions={{
            submit: handleEditGrade as GradeFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          grade={selectedGrade}
        />
      </FormModal>

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedGrade?.id) handleDelete(selectedGrade.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The students enrolled in this Grade will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Grade <strong>"${selectedGrade?.name}"</strong>? You can't undo this action.`}
        title="Delete Grade?"
      />

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
          setSelectedGrade(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully updated the Grade <strong>"${selectedGrade?.name}"</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {grades.data.map((grade: Grade) => (
            <TableRow
              key={grade.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/grades/${grade.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {grade.name}
                </Link>
              </TableCell>
              <TableCell align="right">{grade.point}</TableCell>
              <TableCell align="right">{grade.program_id}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(grade, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(grade, "delete")}>
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

export default GradesList;