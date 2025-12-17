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
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Print } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useGetParticipantQuery } from "../../../../store/api/participants.api";
import Breadcrumb from "../components/BreadCrumb";
import { useAppSelector } from "../../../../store/hooks";
import { selectCurrentUser } from "../../../../store/auth.slice";
import { useGetCurrentSessionQuery } from "../../../../store/api/sessions.api";

const CourseCard = () => {
  // Assuming we get the participant ID from URL params or props
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0; // Replace with actual ID source
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  
  const {
    data: response,
    isLoading,
    error,
  } = useGetParticipantQuery(participantId);
  const { data: currentSession } = useGetCurrentSessionQuery(null);

  // Get unique semesters from courses
  const availableSemesters = useMemo(() => {
    if (!response?.data?.courses) return [];
    const semesters = new Set(response.data.courses.map((course: { semester: string }) => course.semester));
    return Array.from(semesters) as string[];
  }, [response?.data?.courses]);

  // Filter courses based on selected semester
  const filteredCourses = useMemo(() => {
    if (!response?.data?.courses) return [];
    if (semesterFilter === "all") return response.data.courses;
    return response.data.courses.filter((course: { semester: string }) => course.semester === semesterFilter);
  }, [response?.data?.courses, semesterFilter]);

  // Calculate total credit units for filtered courses
  const totalCreditUnits = useMemo(() => {
    return filteredCourses.reduce((sum: number, course: { credit_units?: number }) => sum + (course.credit_units || 0), 0);
  }, [filteredCourses]);

  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSemesterFilter(event.target.value);
  };

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
        Failed to load course card. Please try again later.
      </Alert>
    );
  }

  const participant = response?.data;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Box
        sx={{
          "@media print": { display: "none" },
        }}
      >
        <Breadcrumb />
      </Box>

      {/* Semester Filter - hidden when printing */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
          "@media print": { display: "none" },
        }}
      >
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Filter by Semester</InputLabel>
          <Select
            value={semesterFilter}
            label="Filter by Semester"
            onChange={handleSemesterChange}
          >
            <MenuItem value="all">All Semesters (Full Session)</MenuItem>
            {availableSemesters.map((semester) => (
              <MenuItem key={semester} value={semester}>
                {semester}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

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
              src={import.meta.env.VITE_LOGO}
              alt="College Logo"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Box>

          {/* Center Text */}
          <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#002B5B" }}>
          {(() => {
            const nameParts = import.meta.env.VITE_SCHOOL_NAME.split(" ");
            const meaningfulWords = nameParts.filter((word: string) => !["of", "a", "the", "and"].includes(word.toLowerCase()));
            const midIndex = Math.ceil(meaningfulWords.length / 2);
            
            return meaningfulWords.slice(0, midIndex).join(" ");
          })()}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#002B5B" }}>
          {(() => {
            const nameParts = import.meta.env.VITE_SCHOOL_NAME.split(" ");
            const meaningfulWords = nameParts.filter((word: string) => !["of", "a", "the", "and"].includes(word.toLowerCase()));
            const midIndex = Math.ceil(meaningfulWords.length / 2);

            // Use original words but start from where the second half of meaningful words begin
            const startIndex = nameParts.indexOf(meaningfulWords[midIndex]);

            return nameParts.slice(startIndex).join(" ");
          })()}
        </Typography>
          </Box>

          {/* Right Image - Participant Photo */}
          {participant?.photo ? (
            <Avatar
              src={participant?.photo}
              sx={{
                width: 128,
                height: 128,
                marginBottom: "1rem",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 128,
                height: 128,
                marginBottom: "1rem",
                bgcolor: "primary.main",
                fontSize: "3rem",
              }}
            >
              {participant?.first_name?.[0]}
              {participant?.last_name?.[0]}
            </Avatar>
          )}
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
              <strong>LEVEL:</strong> {participant?.level?.name || "100"}
            </Typography>
            <Typography variant="body2">
              <strong>SESSION:</strong> {currentSession?.data.name || "N/A"}
            </Typography>
            {semesterFilter !== "all" && (
              <Typography variant="body2">
                <strong>SEMESTER:</strong> {semesterFilter}
              </Typography>
            )}
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
                  COURSE SEMESTER
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  CREDIT UNIT
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses?.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:nth-of-type(odd)": { bgcolor: "#f5f5f5" } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.semester}</TableCell>
                  <TableCell>{row.credit_units}</TableCell>
                </TableRow>
              ))}
              {/* Total Credit Units Row */}
              <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                <TableCell colSpan={4} align="right" sx={{ fontWeight: 600 }}>
                  Total Credit Units:
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{totalCreditUnits}</TableCell>
              </TableRow>
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
        {/* <Paper
          sx={{
            p: 4,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "#ffffff",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 500 }}>
            Download Your Course Card
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
        </Paper> */}

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
            Print Your Course Card
          </Typography>
          <Button
            startIcon={<Print />}
            sx={{
              color: "primary.main",
              "&:hover": { bgcolor: "primary.50" },
            }}
            onClick={() => window.print()}
          >
            {semesterFilter === "all" 
              ? "Print Full Session Course Card" 
              : `Print ${semesterFilter} Course Card`}
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
        If you are experiencing difficulties generating or printing your course
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

export default CourseCard;
