import {
  AccessTime,
  CalendarToday,
  Close,
  CloudUploadOutlined,
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

type createClassModal = {
  open: boolean;
  handleClose: () => void;
};

const CreateClassModal = ({ open, handleClose }: createClassModal) => {
  const formik = useFormik({
    initialValues: {
      topic: "",
      subject: "",
      batch: "",
      course: "",
      participants: "",
      link: "",
      resource: [],
      fileName: "",
      day: "",
      time: "",
    },
    validationSchema: yup.object({
      topic: yup.string().required("Required"),
      subject: yup.string().required("Required"),
      recipients: yup.array().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      //   handleClose();
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    console.log(file);
    try {
      const formData = new FormData();
      formData.append("resource", file);
      console.log(file);

      // const response = await uploadResource(formData).unwrap();
      // formik.setFieldValue("resources", [
      //   ...formik.values.resources,
      //   ...response.resources.map((resource) => resource.id),
      // ]);
      formik.setFieldValue("fileName", file?.name);
      //   setOpenFileSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
    // setOpenModal(false);
    // setOpenFileSuccessModal(true);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
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
              <Box
                sx={{
                  border: "1px solid #CCCCCC",
                  borderRadius: 2,
                  textAlign: "center",
                  cursor: "pointer",
                  width: "100%",
                  padding: "1em",
                  marginBottom: ".6em",
                }}
              >
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileInput"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <CloudUploadOutlined />
                  <Typography
                    sx={{ fontSize: "1rem", fontWeight: 300, color: "#0B0B0B" }}
                  >
                    {formik.values.fileName
                      ? formik.values.fileName
                      : "Upload Class Material"}
                  </Typography>
                </label>
              </Box>
              <FormControl fullWidth>
                <InputLabel id="subject">Select Subject</InputLabel>
                <Select
                  fullWidth
                  labelId="subject"
                  id="subject"
                  name="subject"
                  value={formik.values.subject}
                  label="Subject"
                  onChange={formik.handleChange}
                  sx={{ marginBottom: ".6em" }}
                >
                  <MenuItem value={10}>Mathematics</MenuItem>
                  <MenuItem value={20}>General Studies</MenuItem>
                  <MenuItem value={30}>Calculus</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="batch">Select Batch</InputLabel>
                <Select
                  fullWidth
                  labelId="batch"
                  id="batch"
                  name="batch"
                  value={formik.values.batch}
                  label="batch"
                  onChange={formik.handleChange}
                  sx={{ marginBottom: ".6em" }}
                >
                  <MenuItem value={10}>3CO - JVY</MenuItem>
                  <MenuItem value={20}>3CO - JVY</MenuItem>
                  <MenuItem value={30}>3CO - JVY</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="course">Select Course</InputLabel>
                <Select
                  fullWidth
                  labelId="course"
                  id="course"
                  name="course"
                  value={formik.values.course}
                  label="course"
                  onChange={formik.handleChange}
                  sx={{ marginBottom: ".6em" }}
                >
                  <MenuItem value={10}>
                    B.Tech Specialization in Health Informatics
                  </MenuItem>
                  <MenuItem value={20}>
                    B.Tech Specialization in Health Informatics
                  </MenuItem>
                  <MenuItem value={30}>
                    B.Tech Specialization in Health Informatics
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="participants">Add Paricipants</InputLabel>
                <Select
                  fullWidth
                  labelId="participants"
                  id="participants"
                  name="participants"
                  value={formik.values.participants}
                  label="participants"
                  onChange={formik.handleChange}
                  sx={{ marginBottom: ".6em" }}
                >
                  <MenuItem value={10}>John Doe</MenuItem>
                  <MenuItem value={20}>John Doe</MenuItem>
                  <MenuItem value={30}>John Doe</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="outlined"
                id="link"
                name="link"
                placeholder="Add Link"
                value={formik.values.link}
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
                    id="day"
                    name="day"
                    value={formik.values.day}
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
                    id="time"
                    name="time"
                    value={formik.values.time}
                    onChange={formik.handleChange}
                    type="time"
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: "2em", width: "100%" }}
              >
                Create Class
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
                  The participants you select will have access view and join the
                  class
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CreateClassModal;
