import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import { CoursesResponse } from "../../../../../types/courses";
import SuccessModal from "../../../../../components/SuccessModal";
import { useState } from "react";

interface AddScoresModalProps {
  open: boolean;
  handleClose: () => void;
  coursesList: CoursesResponse | undefined;
}

const validationSchema = yup.object({
  course: yup.string().required("Course is required"),
  studentId: yup.string().required("Student ID is required"),
  studentName: yup.string().required("Student name is required"),
  score: yup
    .number()
    .required("Score is required")
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
  date: yup.string().required("Date is required"),
});

const AddScoresModal = ({
  open,
  handleClose,
  coursesList,
}: AddScoresModalProps) => {
  const formik = useFormik({
    initialValues: {
      course: "",
      studentId: "",
      studentName: "",
      score: "",
      date: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleOpenSuccessModal();
    },
  });

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

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
            Add New Scores
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Course
              </Typography>
              <FormControl fullWidth>
                <Select
                  id="course"
                  name="course"
                  value={formik.values.course}
                  onChange={formik.handleChange}
                  error={formik.touched.course && Boolean(formik.errors.course)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    <em>Select Course</em>
                  </MenuItem>
                  {coursesList?.data.map((item) => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "48%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Student ID
                </Typography>
                <TextField
                  fullWidth
                  label="Student ID"
                  id="studentId"
                  name="studentId"
                  value={formik.values.studentId}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ width: "48%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Student Name
                </Typography>
                <TextField
                  fullWidth
                  label="Student Name"
                  id="studentName"
                  name="studentName"
                  value={formik.values.studentName}
                  onChange={formik.handleChange}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "48%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Score
                </Typography>
                <TextField
                  fullWidth
                  label="Input Student Score"
                  id="score"
                  name="score"
                  type="number"
                  value={formik.values.score}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ width: "48%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Date
                </Typography>
                <TextField
                  fullWidth
                  id="date"
                  name="date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                />
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
              >
                Add Score
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
        subTitle={`Offline score has been successfully updated!`}
        title="Successful"
      />
    </Dialog>
  );
};

export default AddScoresModal;
