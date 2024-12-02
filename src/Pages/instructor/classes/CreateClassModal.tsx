import {
  AccessTime,
  // AccessTime,
  CalendarToday,
  Close,
  // CloudUploadOutlined,
  Info,
} from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useGetCurrentSemesterQuery } from "../../../store/api/semesters.api";
import { useGetCurrentSessionQuery } from "../../../store/api/sessions.api";
import { useGetInstructorCoursesQuery } from "../../../store/api/courses.api";
import { useAddLiveClassMutation } from "../../../store/api/classes.api";
// import { CreateLiveClass } from "../../../types/classes";
import SuccessModal from "../../../components/SuccessModal";
import { useEffect, useState } from "react";

type createClassModal = {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
};

const CreateClassModal = ({ open, handleClose, refetch }: createClassModal) => {
  const { data: currentSession, isLoading: isGettingSession } =
    useGetCurrentSessionQuery(null);
  const { data: currentSemester, isLoading: isGettingSemester } =
    useGetCurrentSemesterQuery(null);
  const { data: courses, isLoading: isFetchingCourses } =
    useGetInstructorCoursesQuery({ page: 1, per_page: 1000 });
  const currentSemesterString = currentSemester?.data.name;
  const currentSessionString = currentSession?.data.name;
  const [createClass, { isLoading }] = useAddLiveClassMutation();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      course_id: "",
      session: currentSessionString,
      semester: currentSemesterString,
      start_time: "",
      duration: "",
      topic: "",
      start_date: "",
    },
    validationSchema: yup.object({
      topic: yup.string().required("Required"),
      session: yup.string().required("Required"),
      semester: yup.string().required("Required"),
      start_date: yup.string().required("Date is required"),
      start_time: yup.string().required("Time is required"),
      duration: yup.number().required("Required"),
      course_id: yup.number().required("Required"),
    }),
    onSubmit: async (values) => {
      const dateTime = `${values.start_date}T${values.start_time}`;
      if (values.session && values.semester) {
        try {
          await createClass({
            course_id: parseInt(values.course_id),
            duration: parseInt(values.duration),
            semester: values.semester,
            session: values.session,
            start_time: dateTime,
            topic: values.topic,
          }).unwrap();
          refetch();
          handleOpenSuccessModal();
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  // Update session and semester in formik when data is fetched
  useEffect(() => {
    if (currentSession?.data?.name && currentSemester?.data?.name) {
      if (formik.values.session !== currentSession.data.name) {
        formik.setFieldValue("session", currentSession.data.name);
      }
      if (formik.values.semester !== currentSemester.data.name) {
        formik.setFieldValue("semester", currentSemester.data.name);
      }
    }
  }, [currentSession, currentSemester]);

  return (
    <Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "1em 2em",
            borderRadius: "6px",
            width: { xs: "90%", sm: "70%", md: "30%" },
          }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
            }}
          >
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "1em",
              width: "100%",
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "#434343", marginBottom: ".6em" }}
            >
              Add New Class
            </Typography>
            <Box sx={{ width: "100%" }}>
              <TextField
                fullWidth
                variant="outlined"
                id="topic"
                name="topic"
                placeholder="Enter topic of Class..."
                value={formik.values.topic}
                onChange={formik.handleChange}
                sx={{ margin: "1em 0" }}
              />

              <FormControl fullWidth>
                <InputLabel id="course_id">Select Course</InputLabel>
                <Select
                  fullWidth
                  labelId="course_id"
                  id="course_id"
                  name="course_id"
                  value={formik.values.course_id}
                  label="course_id"
                  onChange={formik.handleChange}
                  sx={{ marginBottom: ".6em" }}
                >
                  {courses?.data.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                variant="outlined"
                id="duration"
                name="duration"
                placeholder="Add duration (minutes)"
                value={formik.values.duration}
                type="number"
                onChange={formik.handleChange}
                sx={{ marginBottom: ".6em" }}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="body2"
                sx={{ fontSize: "1rem", color: "#434343" }}
              >
                Class Schedule
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#EDEDF5",
                    borderRadius: "5px",
                    padding: ".4em",
                  }}
                >
                  <CalendarToday />
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="start_date"
                    name="start_date"
                    value={formik.values.start_date}
                    onChange={formik.handleChange}
                    type="date"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#EDEDF5",
                    borderRadius: "5px",
                    padding: ".4em",
                  }}
                >
                  <AccessTime />
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="start_time"
                    name="start_time"
                    value={formik.values.start_time}
                    onChange={formik.handleChange}
                    type="time"
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: "2em", width: "100%" }}
                disabled={
                  isGettingSemester ||
                  isGettingSession ||
                  isFetchingCourses ||
                  isLoading
                }
              >
                {isLoading ? "Creating..." : "Create Class"}
              </Button>
              <Box
                sx={{
                  backgroundColor: "#F0F9FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                  gap: 2,
                  marginTop: ".5em",
                  padding: "1em",
                }}
              >
                <Info sx={{ color: "#0284C7" }} />
                <Typography
                  variant="body2"
                  sx={{ fontSize: ".8rem", color: "#0369A1" }}
                >
                  The participants you select will have access to view and join
                  the class
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
      <SuccessModal
        close={handleCloseSuccessModal}
        infoText=""
        open={openSuccessModal}
        subTitle={`You have successfully created a live class`}
        title="Successful"
      />
    </Box>
  );
};

export default CreateClassModal;
