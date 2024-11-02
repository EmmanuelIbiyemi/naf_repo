import { useState, useEffect } from 'react';
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
import { selectCurrentUser } from '../../../store/auth.slice';

export default function Results() {
  const dispatch = useAppDispatch();
  const [selectedSession, setSelectedSession] = useState("2023/2024");
  const [selectedSemester, setSelectedSemester] = useState("First Semester");

  // Hardcoded participant_id - replace with actual dynamic source
  const user = useAppSelector(selectCurrentUser);
  const participantId = user.id; // Replace with actual ID source

  // Fetch student result
  const {
    data: resultData,
    isLoading,
    error
  } = useStudentResultQuery({
    participant_id: participantId,
    session: selectedSession,
    semester: selectedSemester
  });

  useEffect(() => {
    dispatch(setPageName("Results"));
  }, [dispatch]);

  const handleSessionChange = (event: SelectChangeEvent) => {
    setSelectedSession(event.target.value as string);
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Failed to load results. Please try again later.
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
            <MenuItem value="2023/2024">2023/2024</MenuItem>
            <MenuItem value="2022/2023">2022/2023</MenuItem>
          </Select>
        </Box>
        <Box sx={filterItemStyle}>
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            sx={{ minWidth: "200px" }}
          >
            <MenuItem value="First Semester">First Semester</MenuItem>
            <MenuItem value="Second Semester">Second Semester</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Results Table */}
      {!resultData?.data.length ? (
        <Alert severity="info">No results found for the selected criteria.</Alert>
      ) : (
        <Box>
          {/* Student Information Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
  <Grid item xs={6}>
    <Box sx={infoSectionStyle}>
      <Typography variant="caption" color="textSecondary">
        MATRIC NO.: {resultData?.data?.participant?.matric_number || "Unassigned"}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        FULL NAME: {`${resultData?.data?.participant?.first_name || ''} ${resultData?.data?.participant?.last_name || ''}`}
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
    resultData.data.details.map((course, index) => (
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
              CGPA: {resultData?.data?.summary?.cumulative_grade_point_average || "N/A"}
            </Typography>
          </Box>

          {/* Footer Section */}
          <Box sx={footerStyle}>
            <Box>
              <Typography variant="body2" color="textSecondary">TNU: {resultData?.data?.summary?.total_credit_units || "N/A"}</Typography>
              <Typography variant="body2" color="textSecondary">Cumulative TNU: {resultData?.data?.summary?.total_credit_units || "N/A"}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">TCP: {resultData?.data?.summary?.total_grade_points || "N/A"}</Typography>
              <Typography variant="body2" color="textSecondary">Cumulative TCP: {resultData?.data?.summary?.total_grade_points || "N/A"}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
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