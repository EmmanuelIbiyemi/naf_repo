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
import { selectKeyword, setPageName, setPageLoading } from "../../../store/app.slice";
import { useStudentResultQuery } from "../../../store/api/result.api";
import { useGetSessionsQuery } from "../../../store/api/sessions.api";
import { selectCurrentUser } from "../../../store/auth.slice";
import { SessionType } from "../../../types/sessions";
import SessionDropdown from "../../../components/SessionDropdown";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Results() {
  const dispatch = useAppDispatch();
  const keyword = useAppSelector(selectKeyword);
  const [selectedSessionObj, setSelectedSessionObj] = useState<SessionType | null>(null);
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
      setSelectedSessionObj(currentSession);
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

  const resultFetchError = resultError as any;
  const isVisibilityBlocked = resultFetchError?.status === 403;
  const visibleAfterCopy = resultFetchError?.data?.visible_after;
  const errorMessage =
    resultFetchError?.data?.message ||
    resultFetchError?.error ||
    "Failed to load results. Please try again later.";

  useEffect(() => {
    dispatch(setPageName("Results"));
  }, [dispatch]);

  useEffect(() => {
    if (isLoadingSessions || isLoadingResults) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isLoadingSessions, isLoadingResults, dispatch]);

  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value as string);
  };

  const resultContentRef = useRef<HTMLDivElement>(null);

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

  if (sessionsError) {
    return (
      <Alert severity="error">
        Failed to load sessions. Please try again later.
      </Alert>
    );
  }

  const summary = resultData?.data?.summary;
  const totalCreditUnits = summary?.total_credit_units ?? "N/A";
  const cumulativeCreditUnits =
    summary?.cumulative_total_credit_units ??
    summary?.total_credit_units ??
    "N/A";
  const totalGradePoints = summary?.total_grade_points ?? "N/A";
  const cumulativeGradePoints =
    summary?.cumulative_total_grade_points ??
    summary?.total_grade_points ??
    "N/A";
  const gpa = summary?.grade_point_average ?? "N/A";
  const cgpa = summary?.cumulative_grade_point_average ?? "N/A";

  return (
    <Box sx={{ padding: "2rem" }}>
      <Box sx={filterContainerStyle}>
        <Box sx={{ ...filterItemStyle, minWidth: "200px" }}>
          <SessionDropdown
            value={selectedSessionObj}
            onChange={(session) => {
              setSelectedSessionObj(session);
              if (session) {
                setSelectedSession(session.name);
                updateAvailableSemesters(session.name);
              }
            }}
            label=""
            placeholder="Select session"
          />
        </Box>
        <Box sx={{ ...filterItemStyle, minWidth: "200px" }}>
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            fullWidth
            size="small"
            displayEmpty
          >
            {availableSemesters.map((semester) => (
              <MenuItem key={semester.id} value={semester.name}>
                {semester.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {resultError ? (
        <Alert severity={isVisibilityBlocked ? "info" : "error"}>
          {isVisibilityBlocked ? (
            <>
              {errorMessage}
              {visibleAfterCopy
                ? ` (Available after ${new Date(
                    visibleAfterCopy
                  ).toLocaleString()})`
                : ""}
            </>
          ) : (
            errorMessage
          )}
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
                <img src={import.meta.env.VITE_LOGO} alt="school logo" style={{ width: 80 }} />
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
                {user?.photo ? (
                  <Avatar
                    src={user?.photo}
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
                    {user?.first_name?.[0]}
                    {user?.last_name?.[0]}
                  </Avatar>
                )}
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
                  {totalCreditUnits}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Cumulative TCU:{" "}
                  {cumulativeCreditUnits}
                </Typography>
              </Box>
              <Box sx={gpaSectionStyle}>
                <Typography variant="body1" color="textSecondary">
                  Total Credit Points (TCP):{" "}
                  {totalGradePoints}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Cumulative TCP:{" "}
                  {cumulativeGradePoints}
                </Typography>
              </Box>
              <Box sx={gpaSectionStyle}>
                <Typography variant="body1" color="textSecondary">
                  Grade Point Average (GPA):{" "}
                  {gpa}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  CGPA:{" "}
                  {cgpa}
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
