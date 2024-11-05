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
import { useAddBulkRecordScoresMutation } from "../../../../../store/api/records.api";

interface AddScoresModalProps {
  open: boolean;
  handleClose: () => void;
  recordItem: recordResponse | null;
  recordId: number | null;
  courseParticipants: ParticipantData[];
  refetch: () => void;
}

const AddScoresModal = ({
  open,
  handleClose,
  recordItem,
  recordId,
  courseParticipants,
  refetch,
}: AddScoresModalProps) => {
  const [rows, setRows] = useState<
    Array<{
      participantId: number | null;
      obtainedScore: number | null;
    }>
  >([]);
  const [addScores, { isLoading }] = useAddBulkRecordScoresMutation();

  useEffect(() => {
    if (!open) {
      setRows([]);
      return;
    }

    if (recordItem?.scores && recordItem.scores.length > 0) {
      const initialRows = recordItem.scores.map((score) => ({
        participantId: score.participant.id,
        obtainedScore: score.obtained_score,
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
        // console.log({ scores: payloads, record_id: recordId! });
        refetch();
        handleOpenSuccessModal();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    handleClose();
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
                            setRows(newRows);
                          }}
                          defaultValue={parseInt("")}
                        >
                          {courseParticipants.map((participant) => (
                            <MenuItem
                              key={participant.id}
                              value={participant.id}
                              disabled={rows.some(
                                (r) =>
                                  r.participantId === participant.id &&
                                  r !== row
                              )}
                            >
                              {participant.matric_number}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      {courseParticipants.find(
                        (p) => p.id === row.participantId
                      )
                        ? `${
                            courseParticipants.find(
                              (p) => p.id === row.participantId
                            )?.first_name
                          } ${
                            courseParticipants.find(
                              (p) => p.id === row.participantId
                            )?.last_name
                          }`
                        : "-"}
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
                      <IconButton
                        onClick={() => removeRow(index)}
                        disabled={rows.length === 1}
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
            <Button
              startIcon={<Add />}
              onClick={addRow}
              variant="outlined"
              size="small"
            >
              Add Row
            </Button>
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

        <SuccessModal
          actions={{
            proceed: () => {
              console.log("proceed");
            },
            undo: () => {
              console.log("undo");
            },
          }}
          close={handleCloseSuccessModal}
          infoText=""
          open={openSuccessModal}
          subTitle="Scores have been successfully updated!"
          title="Successful"
        />
      </Box>
    </Modal>
  );
};

export default AddScoresModal;
