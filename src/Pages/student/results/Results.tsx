import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid2,
  Button,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectKeyword, setPageName } from "../../../store/app.slice";
import { useStudentResultQuery } from "../../../store/api/result.api";
import { useGetSessionsQuery } from "../../../store/api/sessions.api";
import { selectCurrentUser } from "../../../store/auth.slice";
import { SessionType } from "../../../types/sessions";
import logo from "../../../assets/logo.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Results() {
  const dispatch = useAppDispatch();
  const keyword = useAppSelector(selectKeyword);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [availableSemesters, setAvailableSemesters] = useState<
    Array<{
      id: number;
      name: string;
    }>
  >([]);

  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0;

  // Fetch sessions data
  const {
    data: sessionsData,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useGetSessionsQuery({ search_term: keyword });

  // Set initial session and semester when data is loaded
  useEffect(() => {
    if (sessionsData?.data && sessionsData.data.length > 0) {
      const currentSession = sessionsData.data[0] as SessionType;
      setSelectedSession(currentSession.name);

      if (currentSession.semesters?.length > 0) {
        setAvailableSemesters(currentSession.semesters);
        setSelectedSemester(currentSession.semesters[0].name);
      }
    }
  }, [sessionsData]);

  // Update available semesters when session changes
  const updateAvailableSemesters = (sessionName: string) => {
    const session = sessionsData?.data.find((s) => s.name === sessionName);
    if (session?.semesters) {
      setAvailableSemesters(session.semesters);
      setSelectedSemester(session.semesters[0].name);
    }
  };

  // Fetch student result
  const {
    data: resultData,
    isLoading: isLoadingResults,
    error: resultError,
  } = useStudentResultQuery(
    {
      participant_id: participantId,
      session: selectedSession,
      semester: selectedSemester,
    },
    {
      skip: !selectedSession || !selectedSemester,
    }
  );

  useEffect(() => {
    dispatch(setPageName("Results"));
  }, [dispatch]);

  const handleSessionChange = (event: SelectChangeEvent) => {
    const newSession = event.target.value as string;
    setSelectedSession(newSession);
    updateAvailableSemesters(newSession);
  };

  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value as string);
  };

  const resultContentRef = useRef<HTMLDivElement>(null);

  // const handlePrint = () => {
  //   const printContent = resultContentRef.current;
  //   if (!printContent) return;

  //   // Create a new window for printing
  //   const printWindow = window.open("", "", "height=500, width=800");
  //   if (!printWindow) return;

  //   // Clone the content to print
  //   const clonedContent = printContent.cloneNode(true) as HTMLElement;

  //   // Add print-specific styles
  //   const printStyles = `
  //     <style>
  //       @media print {
  //         body * {
  //           visibility: hidden;
  //         }
  //         #printable-result, #printable-result * {
  //           visibility: visible;
  //         }
  //         #printable-result {
  //           position: absolute;
  //           left: 0;
  //           top: 0;
  //           width: 100%;
  //         }
  //         table {
  //           width: 100%;
  //           border-collapse: collapse;
  //         }
  //         th, td {
  //           border: 1px solid #ddd;
  //           padding: 8px;
  //         }
  //       }
  //     </style>
  //   `;

  //   // Write the content to the print window
  //   printWindow.document.write("<html><head><title>Student Result</title>");
  //   printWindow.document.write(printStyles);
  //   printWindow.document.write("</head><body>");
  //   printWindow.document.write('<div id="printable-result">');
  //   printWindow.document.write(clonedContent.innerHTML);
  //   printWindow.document.write("</div></body></html>");

  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.close();
  // };

  const handleDownload = async () => {
    const resultContent = resultContentRef.current;
    if (!resultContent) return;

    try {
      // Use html2canvas to capture the result content
      const canvas = await html2canvas(resultContent, {
        useCORS: true,
        logging: false,
      });

      // Convert canvas to PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Save the PDF
      pdf.save(
        `Result_${
          resultData?.data?.participant?.matric_number || "Unknown"
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoadingSessions) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (sessionsError) {
    return (
      <Alert severity="error">
        Failed to load sessions. Please try again later.
      </Alert>
    );
  }

  return (
    <Box sx={{ padding: "2rem" }}>
      <Box sx={filterContainerStyle}>
        <Box sx={filterItemStyle}>
          <Select
            value={selectedSession}
            onChange={handleSessionChange}
            sx={{ minWidth: "200px" }}
          >
            {sessionsData?.data.map((session) => (
              <MenuItem key={session.id} value={session.name}>
                {session.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box sx={filterItemStyle}>
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            sx={{ minWidth: "200px" }}
          >
            {availableSemesters.map((semester) => (
              <MenuItem key={semester.id} value={semester.name}>
                {semester.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {isLoadingResults ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : resultError ? (
        <Alert severity="error">
          Failed to load results. Please try again later.
        </Alert>
      ) : !resultData?.data ? (
        <Alert severity="info">
          No results found for the selected criteria.
        </Alert>
      ) : (
        <Box>
          <Box ref={resultContentRef} sx={{ py: 8, px: 16 }}>
            {/* Student Information Section */}

            <Grid2 container spacing={3} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "white",
                  px: 8,
                  py: 2,
                }}
              >
                <img src={logo} alt="school logo" style={{ width: 80 }} />
                <h1>{import.meta.env.VITE_SCHOOL_NAME.split(" ").map(
            (word: string) => word[0].toUpperCase()
          )}{" "}</h1>
                <h2>Student Result</h2>
              </Box>
            </Grid2>

            <Grid2 container spacing={3} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  backgroundColor: "white",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  <Typography variant="caption" color="textSecondary">
                    MATRIC NUMBER:{" "}
                    {resultData?.data?.participant?.matric_number ||
                      "Unassigned"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    FULL NAME:{" "}
                    {`${resultData?.data?.participant?.first_name || ""} ${
                      resultData?.data?.participant?.last_name || ""
                    }`}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    SEMESTER: {resultData?.data?.semester || "N/A" + " "}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    LEVEL: {resultData?.data?.level?.name || "N/A" + " "}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    SESSION: {resultData?.data?.session || "N/A"}
                  </Typography>
                </Box>
                <Avatar
                  src={user?.photo || ""}
                  sx={{
                    width: 128,
                    height: 128,
                    marginBottom: "1rem",
                  }}
                />
              </Box>
            </Grid2>

            {/* Courses Table */}
            <TableContainer component={Paper} sx={tableContainerStyle}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S/N</TableCell>
                    <TableCell>COURSE CODE</TableCell>
                    <TableCell>COURSE TITLE</TableCell>
                    <TableCell>UNITS</TableCell>
                    <TableCell>SCORE</TableCell>
                    <TableCell>GRADE</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultData?.data?.details?.length ? (
                    resultData.data.details.map((course, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{course.course_code}</TableCell>
                        <TableCell>{course.course_name}</TableCell>
                        <TableCell>{course.course_credit_unit}</TableCell>
                        <TableCell>{course.total_obtained_score}</TableCell>
                        <TableCell>{course.score_name}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No courses found for the selected criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Footer with GPA */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                backgroundColor: "white",
                p: 2,
              }}
            >
              <Box sx={gpaSectionStyle}>
                <Typography variant="body1" color="textSecondary">
                  Total Credit Units (TCU):{" "}
                  {resultData?.data?.summary?.total_credit_units || "N/A"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Cumulative TCU:{" "}
                  {resultData?.data?.summary?.total_credit_units || "N/A"}
                </Typography>
              </Box>
              <Box sx={gpaSectionStyle}>
                <Typography variant="body1" color="textSecondary">
                  Total Credit Points (TCP):{" "}
                  {resultData?.data?.summary?.total_grade_points || "N/A"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Cumulative TCP:{" "}
                  {resultData?.data?.summary?.total_grade_points || "N/A"}
                </Typography>
              </Box>
              <Box sx={gpaSectionStyle}>
                <Typography variant="body1" color="textSecondary">
                  Grade Point Average (GPA):{" "}
                  {resultData?.data?.summary?.grade_point_average || "N/A"}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  CGPA:{" "}
                  {resultData?.data?.summary?.cumulative_grade_point_average ||
                    "N/A"}
                </Typography>
              </Box>
            </Box>

            {/* Footer Section */}
          </Box>
          <Box sx={footerStyle}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Button variant="outlined" onClick={handleDownload}>
                Download
              </Button>
              {/* <Button variant="contained" onClick={handlePrint}>
                Print Result
              </Button> */}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// Styles remain the same as in the original component
const filterContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1.5rem",
};

const filterItemStyle = {
  display: "flex",
  alignItems: "center",
};

const tableContainerStyle = {
  borderRadius: "var(--border-radius)",
  boxShadow: 1,
};

const gpaSectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

const footerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 3,
  paddingTop: 2,
  borderTop: "1px solid",
  borderColor: "divider",
};
