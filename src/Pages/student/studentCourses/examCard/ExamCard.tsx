import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Download, Print } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useGetParticipantQuery } from "../../../../store/api/participants.api";
import Breadcrumb from "../components/BreadCrumb";
import { useAppSelector } from "../../../../store/hooks";
import { selectCurrentUser } from "../../../../store/auth.slice";
import logo from "../../../../assets/logo.png";
import { useGetCurrentSemesterQuery } from "../../../../store/api/semesters.api";
import { useGetCurrentSessionQuery } from "../../../../store/api/sessions.api";
const ExamCard = () => {
  // Assuming we get the participant ID from URL params or props
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0; // Replace with actual ID source
  const {
    data: response,
    isLoading,
    error,
  } = useGetParticipantQuery(participantId);
      const { data: currentSemester } = useGetCurrentSemesterQuery(null);
      const { data: currentSession } = useGetCurrentSessionQuery(null);



  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 4 }}>
        Failed to load exam card. Please try again later.
      </Alert>
    );
  }

  const participant = response?.data;


  // Sample exam data - you would typically get this from another endpoint
  const examRows = participant?.courses;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Breadcrumb />

      <Paper sx={{ p: 4, my: 3, bgcolor: "#ffffff" }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
          }}
        >
          {/* Left Logo */}
          <Box sx={{ width: 80, height: 80 }}>
            <img
              src={logo}
              alt="College Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>

          {/* Center Text */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#002B5B" }}>
              Nigerian Air Force
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#002B5B" }}>
              College of Nursing Sciences
            </Typography>
          </Box>

          {/* Right Image - Participant Photo */}
          <Box sx={{ width: 80, height: 80 }}>
            <img
              src={participant?.photo || "/api/placeholder/80/80"}
              alt="Student Photo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Box>

        {/* Student Info Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
            <Typography variant="body2">
              <strong>MATRIC NO:</strong> {participant?.matric_number}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Typography variant="body2">
              <strong>FULL NAME:</strong>{" "}
              {`${participant?.first_name} ${participant?.last_name}`}
            </Typography>
            <Typography variant="body2">
              <strong>SEMESTER:</strong> {currentSemester?.data.name || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>LEVEL:</strong> {participant?.level.name || "100"}
            </Typography>
            <Typography variant="body2">
              <strong>SESSION:</strong> {currentSession?.data.name || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* Table Section */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#002B5B" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  S/N
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  COURSE CODE
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  COURSE TITLE
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  CREDIT UNIT
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  INVIGILATOR SIGN
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examRows?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:nth-of-type(odd)": { bgcolor: "#f5f5f5" } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.credit_units}</TableCell>
                  <TableCell>{row.invigilatorSign}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Download and Print Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 3,
          mb: 3,
          "@media print": { display: "none" },
        }}
      >
        {/* Download Card */}
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500 }}>
            Download Your Exam Card
          </Typography>
          <Button
            startIcon={<Download />}
            sx={{
              color: "primary.main",
              "&:hover": { bgcolor: "primary.50" },
            }}
            onClick={() => console.log("Download PDF")}
          >
            Click here to Download (PDF)
          </Button>
        </Paper>

        {/* Print Card */}
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500 }}>
            Print Your Exam Card
          </Typography>
          <Button
            startIcon={<Print />}
            sx={{
              color: "primary.main",
              "&:hover": { bgcolor: "primary.50" },
            }}
            onClick={() => window.print()}
          >
            Print Exam Card
          </Button>
        </Paper>
      </Box>

      {/* Help Text */}
      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "text.secondary",
          mb: 4,
          "@media print": { display: "none" },
        }}
      >
        If you are experiencing difficulties generating or printing your exam
        card, please{" "}
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            console.log("Help clicked");
          }}
          style={{ color: "primary.main", textDecoration: "underline" }}
        >
          click here
        </Link>{" "}
        for assistance
      </Typography>
    </Box>
  );
};

export default ExamCard;
