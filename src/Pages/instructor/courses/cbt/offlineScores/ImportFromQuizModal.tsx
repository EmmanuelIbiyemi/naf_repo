import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState } from "react";
import { useImportScoresFromRecordMutation } from "../../../../../store/api/records.api";
import { useGetInstructorCourseQuizzesQuery } from "../../../../../store/api/quizzes.api";

interface ImportFromQuizProps {
  open: boolean;
  handleClose: () => void;
  recordId: number | null;
  courseId: number | null;
  refetch: () => void;
}

const ImportFromQuiz = ({
  open,
  handleClose,
  recordId,
  courseId,
  refetch,
}: // coursesList,
ImportFromQuizProps) => {
  const [importScores, { isLoading }] = useImportScoresFromRecordMutation();

  const formik = useFormik({
    initialValues: {
      quiz_id: 0,
    },
    validationSchema: yup.object({
      quiz_id: yup.number().required(),
    }),
    onSubmit: async (values) => {
      try {
        if (recordId) {
          await importScores({
            quiz_id: values.quiz_id,
            record_id: recordId,
          }).unwrap();
          refetch();
          handleOpenSuccessModal();
        }
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

  const { data: quizzes, isLoading: isGettingQuizzes } =
    useGetInstructorCourseQuizzesQuery(
      { course_id: courseId as number, page: 1 },
      { skip: !courseId }
    );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle sx={{ p: 0, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="500">
            Import scores from a quiz
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "100%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Select Quiz
                </Typography>
                <Select
                  id="quiz_id"
                  name="quiz_id"
                  value={formik.values.quiz_id}
                  onChange={formik.handleChange}
                  displayEmpty
                  fullWidth
                  disabled={isGettingQuizzes}
                >
                  <MenuItem value="" disabled>
                    <em>Select Quiz</em>
                  </MenuItem>
                  {quizzes?.data?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ textTransform: "none" }}
                disabled={isLoading}
              >
                Import Score
              </Button>
            </Box>
          </Stack>
        </form>
      </DialogContent>
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
        subTitle={`Score has been successfully imported!`}
        title="Successful"
      />
    </Dialog>
  );
};

export default ImportFromQuiz;
