import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ScoreFormAction, Score } from "../../../../types/scores";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteScoreMutation,
  useGetScoresQuery,
  useUpdateScoreMutation,
} from "../../../../store/api/scores.api";
import FormModal from "../../../../components/FormModal";
import ScoreForm from "./ScoresForm";
import SuccessModal from "../../../../components/SuccessModal";

const ScoresList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedScore, setSelectedScore] = useState<Score>();
  const { data: scores } = useGetScoresQuery(null);
  const [deleteScore] = useDeleteScoreMutation();
  const [updateScore] = useUpdateScoreMutation();

  const handleOpenModal = (score: Score, type: string) => {
    setSelectedScore(score);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedScore(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (score_id: number) => {
    try {
      await deleteScore(score_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditScore = async (score: Score) => {
    try {
      await updateScore(score).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(score, "success");
  };

  return (
    <TableContainer>
      {/* EDIT */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <ScoreForm
          actions={{
            submit: handleEditScore as ScoreFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          score={selectedScore}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedScore) handleDelete(selectedScore.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="This action cannot be undone."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete the score with name "${selectedScore?.name}"?`}
        title="Delete Score?"
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
          setSelectedScore(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully updated the score with name "${selectedScore?.name}".`}
        title="Update Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {scores?.data.map((score: Score) => (
            <TableRow
              key={score.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link to={`/scores/${score.id}`}>
                  Name: {score.name}
                </Link>
              </TableCell>
              <TableCell>Min Score: {score.min_score}</TableCell>
              <TableCell>Max Score: {score.max_score}</TableCell>
              <TableCell>Remark: {score.remark}</TableCell>
              <TableCell>Program ID: {score.program_id}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(score, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(score, "delete")}>
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

export default ScoresList;