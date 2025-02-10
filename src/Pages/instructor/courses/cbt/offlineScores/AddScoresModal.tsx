import {
  Box,
  Button,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Close, Add, Remove } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import SuccessModal from "../../../../../components/SuccessModal";
import { useEffect, useState } from "react";
import { ParticipantData } from "../../../../../types/participants";
import { recordResponse } from "../../../../../types/records";
import {
  useAddBulkRecordScoresMutation,
  useDeleteRecordScoreMutation,
} from "../../../../../store/api/records.api";
import DeleteConfirmationModal from "../../../../../components/DeleteConfirmationModal";
import ImportFromQuiz from "./ImportFromQuizModal";

// Optionally, define a type for clarity:
interface ScoreRow {
  participantId: number | null;
  participantName?: string;
  obtainedScore: number | null;
  updatedAt?: string;
}

interface AddScoresModalProps {
  open: boolean;
  handleClose: () => void;
  recordItem: recordResponse | null;
  recordId: number | null;
  courseParticipants: ParticipantData[];
  refetch: () => void;
  courseId: number | null;
}

const AddScoresModal = ({
  open,
  handleClose,
  recordItem,
  recordId,
  courseParticipants,
  refetch,
  courseId,
}: AddScoresModalProps) => {
  const [rows, setRows] = useState<ScoreRow[]>([]);

  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    participantId: null as number | null,
    rowIndex: -1,
    participantName: "",
  });

  const [addScores, { isLoading }] = useAddBulkRecordScoresMutation();
  const [deleteScore, { isLoading: isDeleting }] =
    useDeleteRecordScoreMutation();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openDeletedSuccessModal, setOpenDeletedSuccessModal] = useState(false);
  const [openImportFromQuizModal, setOpenImportFromQuizModal] = useState(false);

  useEffect(() => {
    if (!open) {
      setRows([]);
      return;
    }

    if (recordItem?.scores && recordItem.scores.length > 0) {
      const initialRows = recordItem.scores.map((score) => ({
        participantId: score.participant.id,
        participantName: score.participant.first_name + " " + score.participant.last_name,
        obtainedScore: score.obtained_score,
        updatedAt: score.updated_at,
      }));
      setRows(initialRows);
    } else {
      const initialRows = courseParticipants.slice(0, 1).map(() => ({
        participantId: null,
        obtainedScore: null,
      }));
      setRows(initialRows);
    }
  }, [recordItem, open, courseParticipants]);

  const addRow = () => {
    setRows([...rows, { participantId: null, obtainedScore: null }]);
  };

  const removeRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const handleConfirmDelete = async () => {
    const { participantId, rowIndex } = deleteModalState;
    const scoreId = recordItem?.scores.find(
      (score) => score.participant.id === participantId
    )?.id;

    if (scoreId) {
      try {
        await deleteScore({ score_id: scoreId }).unwrap();
        removeRow(rowIndex);
        refetch();
        setDeleteModalState({
          open: false,
          participantId: null,
          rowIndex: -1,
          participantName: "",
        });
        setOpenDeletedSuccessModal(true);
      } catch (error) {
        console.error("Error deleting score:", error);
      }
    }
  };

  const handleDeleteClick = (participantId: number | null, index: number) => {
    if (participantId) {
      const participant = courseParticipants.find(
        (p) => p.id === participantId
      );
      const participantName = participant
        ? `${participant.first_name} ${participant.last_name}`
        : "Unknown Student";

      setDeleteModalState({
        open: true,
        participantId,
        rowIndex: index,
        participantName,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      scores: rows,
    },
    validationSchema: yup.object({
      scores: yup.array().of(
        yup.object({
          participantId: yup.number().required("Participant is required"),
          obtainedScore: yup.number().required("Score is required"),
        })
      ),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const validScores = values.scores.filter(
        (row): row is { participantId: number; obtainedScore: number } =>
          row.participantId !== null && row.obtainedScore !== null
      );

      const payloads = validScores.map((row) => ({
        obtained_score: row.obtainedScore,
        participant_id: row.participantId,
      }));

      try {
        await addScores({ scores: payloads, record_id: recordId! });
        refetch();
        setOpenSuccessModal(true);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "2.5em",
          borderRadius: "24px",
          width: { xs: "90%", sm: "80%", md: "85vw" },
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <Box sx={{ p: 0, mb: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="500">
              Update Scores
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F1F1F1" }}>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Obtained Score</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <InputLabel>Select Student</InputLabel>
                        <Select
                          value={row.participantId || ""}
                          label="Select Student"
                          onChange={(e) => {
                            const newRows = [...rows];
                            newRows[index].participantId = Number(
                              e.target.value
                            );
                            // Update participantName when a student is selected:
                            const participant = courseParticipants.find(
                              (p) => p.id === Number(e.target.value)
                            );
                            if (participant) {
                              newRows[index].participantName =
                                participant.first_name + " " + participant.last_name;
                              // Optionally, update updatedAt if needed:
                              newRows[index].updatedAt = participant.updated_at;
                            }
                            setRows(newRows);
                          }}
                        >
                          <MenuItem value={""}></MenuItem>
                          {courseParticipants.map((participant) => (
                            <MenuItem
                              key={participant.id}
                              value={participant.id}
                              disabled={rows.some(
                                (r) =>
                                  r.participantId === participant.id && r !== row
                              )}
                            >
                              {participant.matric_number}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {row.participantName || "-"}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={row.obtainedScore || ""}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[index].obtainedScore = Number(e.target.value);
                          setRows(newRows);
                        }}
                        sx={{ width: "120px" }}
                      />
                    </TableCell>
                    <TableCell>
                      {row.updatedAt ? formatDate(row.updatedAt) : "-"}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          handleDeleteClick(row.participantId, index)
                        }
                        disabled={isDeleting}
                        size="small"
                      >
                        <Remove />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                startIcon={<Add />}
                onClick={addRow}
                variant="outlined"
                size="small"
              >
                Add Row
              </Button>
              <Button
                onClick={() => setOpenImportFromQuizModal(true)}
                variant="contained"
                size="small"
              >
                Import from quiz
              </Button>
            </Box>
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={isLoading}
            >
              {isLoading ? "Updating" : "Update Scores"}
            </Button>
          </Box>
        </form>

        <DeleteConfirmationModal
          actions={{
            proceed: handleConfirmDelete,
          }}
          close={() =>
            setDeleteModalState((prev) => ({ ...prev, open: false }))
          }
          infoText="You can’t undo this action."
          open={deleteModalState.open}
          subTitle={`Are you sure you want to delete the score for student "${deleteModalState.participantName}" ?`}
          title="Delete Score?"
        />

        <SuccessModal
          close={() => {
            setOpenSuccessModal(false);
            handleClose();
          }}
          infoText=""
          open={openSuccessModal}
          subTitle="Scores are being updated! Please check back in the next 2 minutes"
          title="Successful"
        />

        <SuccessModal
          close={() => setOpenDeletedSuccessModal(false)}
          infoText=""
          open={openDeletedSuccessModal}
          subTitle="Score has been successfully deleted!"
          title="Successful"
        />
        <ImportFromQuiz
          open={openImportFromQuizModal}
          handleClose={() => setOpenImportFromQuizModal(false)}
          recordId={recordId}
          courseId={courseId}
          refetch={refetch}
        />
      </Box>
    </Modal>
  );
};

export default AddScoresModal;
