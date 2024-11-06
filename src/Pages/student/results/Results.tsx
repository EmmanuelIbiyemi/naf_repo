import { useState, useEffect } from "react";
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
  Grid,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { useStudentResultQuery } from "../../../store/api/result.api";
import { useGetSessionsQuery } from "../../../store/api/sessions.api";
import { selectCurrentUser } from "../../../store/auth.slice";

export default function Results() {
  const dispatch = useAppDispatch();
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [availableSemesters, setAvailableSemesters] = useState<
    Array<{
      id: number;
      name: string;
    }>
  >([]);

  const user = useAppSelector(selectCurrentUser);
  const participantId = (user?.id || 0 );

  // Fetch sessions data
  const {
    data: sessionsData,
    isLoading: isLoadingSessions,
    error: sessionsError,
  } = useGetSessionsQuery(null);

  // Set initial session and semester when data is loaded
  useEffect(() => {
    if (sessionsData?.data?.length > 0) {
      const currentSession = sessionsData.data[0];
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log("Downloading result...");
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
      ) : !resultData?.data.length ? (
        <Alert severity="info">
          No results found for the selected criteria.
        </Alert>
      ) : (
        <Box>
          {/* Student Information Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Box sx={infoSectionStyle}>
                <Typography variant="caption" color="textSecondary">
                  MATRIC NO.:{" "}
                  {resultData?.data?.participant?.matric_number || "Unassigned"}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  FULL NAME:{" "}
                  {`${resultData?.data?.participant?.first_name || ""} ${
                    resultData?.data?.participant?.last_name || ""
                  }`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="textSecondary">
                SEMESTER: {resultData?.data?.semester || "N/A" + " "}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                | LEVEL: {resultData?.data?.level?.name || "N/A" + " "}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                | SESSION: {resultData?.data?.session || "N/A"}
              </Typography>
            </Grid>
          </Grid>

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
          <Box sx={gpaSectionStyle}>
            <Typography variant="caption" color="textSecondary">
              GPA: {resultData?.data?.summary?.grade_point_average || "N/A"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              CGPA:{" "}
              {resultData?.data?.summary?.cumulative_grade_point_average ||
                "N/A"}
            </Typography>
          </Box>

          {/* Footer Section */}
          <Box sx={footerStyle}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                TNU: {resultData?.data?.summary?.total_credit_units || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Cumulative TNU:{" "}
                {resultData?.data?.summary?.total_credit_units || "N/A"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">
                TCP: {resultData?.data?.summary?.total_grade_points || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Cumulative TCP:{" "}
                {resultData?.data?.summary?.total_grade_points || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" onClick={handleDownload}>
                Download
              </Button>
              <Button variant="contained" onClick={handlePrint}>
                Print Result
              </Button>
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

const infoSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const gpaSectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  marginTop: 2,
};

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 3,
  paddingTop: 2,
  borderTop: "1px solid",
  borderColor: "divider",
};
