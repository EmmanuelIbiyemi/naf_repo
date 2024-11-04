import { Close } from "@mui/icons-material";
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
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

type GenerateReportModalProps = {
  open: boolean;
  handleClose: () => void;
};

const GenerateReportModal = ({
  open,
  handleClose,
}: GenerateReportModalProps) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: yup.object({
      title: yup.string().required("Required"),
      startDate: yup.string().required("Required"),
      endDate: yup.array().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      //   handleClose();
    },
  });

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
            padding: "2em",
            borderRadius: "6px",
            width: { xs: "90%", sm: "70%", md: "30%" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" sx={{ color: "#434343" }}>
              Generate Report
            </Typography>
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
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="body2"
                sx={{ color: "#434343", marginBottom: ".5em" }}
              >
                Report Title/Type
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="title">Select</InputLabel>
                <Select
                  labelId="title"
                  id="title"
                  name="title"
                  value={formik.values.title}
                  label="title"
                  onChange={formik.handleChange}
                >
                  <MenuItem value={10}>Mathematics</MenuItem>
                  <MenuItem value={20}>Calculus</MenuItem>
                  <MenuItem value={30}>Computer</MenuItem>
                </Select>
              </FormControl>
              <Box
                sx={{
                  marginTop: "1em",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  id="startDate"
                  name="startDate"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  sx={{ marginBottom: ".6em" }}
                  type="date"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  id="endDate"
                  name="endDate"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  sx={{ marginBottom: ".6em" }}
                  type="date"
                />
              </Box>
            </Box>
            <Box
              sx={{
                marginTop: "1em",
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                width: "100%",
              }}
            >
              <Button sx={{ width: "100%" }} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                sx={{ width: "100%" }}
                onClick={() => navigate("/instructor/reports")}
                variant="contained"
              >
                Generate Report
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default GenerateReportModal;
