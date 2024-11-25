import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  // Select,
  // MenuItem,
  // FormControl,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
// import { CoursesResponse } from "../../../../../types/courses";
import SuccessModal from "../../../../../components/SuccessModal";
import { useEffect, useState } from "react";
import { useGetCurrentSessionQuery } from "../../../../../store/api/sessions.api";
import { useGetCurrentSemesterQuery } from "../../../../../store/api/semesters.api";
import { useAddRecordMutation } from "../../../../../store/api/records.api";

interface AddRecordModalProps {
  open: boolean;
  handleClose: () => void;
  // coursesList: CoursesResponse | undefined;
  courseId: number;
}

// const validationSchema = yup.object({
//   course: yup.string().required("Course is required"),
//   studentId: yup.string().required("Student ID is required"),
//   studentName: yup.string().required("Student name is required"),
//   score: yup
//     .number()
//     .required("Score is required")
//     .min(0, "Score must be at least 0")
//     .max(100, "Score cannot exceed 100"),
//   date: yup.string().required("Date is required"),
// });

const AddRecordModal = ({
  open,
  handleClose,
  courseId,
}: // coursesList,
AddRecordModalProps) => {
  const { data: currentSession, isLoading: isGettingSession } =
    useGetCurrentSessionQuery(null);
  const { data: currentSemester, isLoading: isGettingSemester } =
    useGetCurrentSemesterQuery(null);

  const [createRecord, { isLoading }] = useAddRecordMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      session: "",
      semester: "",
      obtainable_score: 0,
      course_id: courseId,
    },
    validationSchema: yup.object({
      name: yup.string().required(),
      session: yup.string().required(),
      semester: yup.string().required(),
      obtainable_score: yup.number().required(),
      course_id: yup.number().required(),
    }),
    onSubmit: async (values) => {
      await createRecord(values).unwrap();
      handleOpenSuccessModal();
    },
  });

  useEffect(() => {
    if (currentSession?.data?.name && currentSemester?.data?.name) {
      if (formik.values.session !== currentSession.data.name) {
        formik.setFieldValue("session", currentSession.data.name);
      }
      if (formik.values.semester !== currentSemester.data.name) {
        formik.setFieldValue("semester", currentSemester.data.name);
      }
      if (formik.values.course_id !== courseId) {
        formik.setFieldValue("course_id", courseId);
      }
    }
  }, [currentSession, currentSemester, courseId]);

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
            Add New Record
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            {/* <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Name
              </Typography>
              <FormControl fullWidth>
                {/* <Select
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
                </Select> */}
            {/* <TextField
                  fullWidth
                  label="Session"
                  id="score"
                  name="score"
                  value={formik.values.score}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Box> */}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ width: "48%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Name
                </Typography>
                <TextField
                  fullWidth
                  label="Name"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Box>
              <Box sx={{ width: "48%" }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Obtainable score
                </Typography>
                <TextField
                  fullWidth
                  label="Obtainable score"
                  id="obtainable_score"
                  name="obtainable_score"
                  value={formik.values.obtainable_score}
                  onChange={formik.handleChange}
                  type="number"
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
                disabled={isLoading || isGettingSemester || isGettingSession}
              >
                Add Record
              </Button>
            </Box>
          </Stack>
        </form>
      </DialogContent>
      <SuccessModal
        close={handleCloseSuccessModal}
        infoText=""
        open={openSuccessModal}
        subTitle={`Record has been successfully created!`}
        title="Successful"
      />
    </Dialog>
  );
};

export default AddRecordModal;
