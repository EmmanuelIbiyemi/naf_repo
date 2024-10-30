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
  Modal,
  Button,
  Grid,
} from "@mui/material";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { useState, useEffect } from "react";

interface CourseData {
  sn: number;
  code: string;
  title: string;
  units: number;
  score: number;
  grade: string;
}

interface StudentInfo {
  matricNo: string;
  fullName: string;
  gpa: string;
  courses: CourseData[];
}

interface ReportData {
  level: string;
  semester: string;
  session: string;
  resultId: string;
  studentInfo: StudentInfo;
}

const Reports = () => {
  const dispatch = useAppDispatch();
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setPageName("Reports"));
    // Fetch report data from an API or database and update the state
    setReportData([
      {
        level: "100",
        semester: "Second",
        session: "2023 / 2024",
        resultId: "U24 RU 103",
        studentInfo: {
          matricNo: "U24 RU 103",
          fullName: "Amina Rabiu Mustapha",
          gpa: "5.00",
          courses: [
            { sn: 1, code: "PHY 404", title: "Nuclear and Particle Physics", units: 2, score: 70, grade: "A" },
            { sn: 2, code: "PHY 404", title: "Nuclear and Particle Physics", units: 2, score: 70, grade: "A" },
            { sn: 3, code: "PHY 404", title: "Nuclear and Particle Physics", units: 2, score: 70, grade: "A" },
          ]
        }
      },
      // Add more report data as needed
    ]);
  }, []);

  const handleLevelChange = (event: SelectChangeEvent) => {
    setSelectedLevel(event.target.value as string);
  };

  const handleSemesterChange = (event: SelectChangeEvent) => {
    setSelectedSemester(event.target.value as string);
  };

  const handleReportClick = (report: ReportData) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading report...");
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Box sx={filterContainerStyle}>
        <Box sx={filterItemStyle}>
          <Select
            value={selectedLevel}
            onChange={handleLevelChange}
            sx={{ minWidth: "200px" }}
          >
            <MenuItem value="all">All Levels</MenuItem>
            <MenuItem value="100">100 Level</MenuItem>
            <MenuItem value="200">200 Level</MenuItem>
            <MenuItem value="300">300 Level</MenuItem>
          </Select>
        </Box>
        <Box sx={filterItemStyle}>
          <Select
            value={selectedSemester}
            onChange={handleSemesterChange}
            sx={{ minWidth: "200px" }}
          >
            <MenuItem value="all">All Semesters</MenuItem>
            <MenuItem value="First">First Semester</MenuItem>
            <MenuItem value="Second">Second Semester</MenuItem>
          </Select>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={tableContainerStyle}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Session</TableCell>
              <TableCell>Result ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData
              .filter(
                (report) =>
                  (selectedLevel === "all" || report.level === selectedLevel) &&
                  (selectedSemester === "all" || report.semester === selectedSemester)
              )
              .map((report) => (
                <TableRow
                  key={report.resultId}
                  onClick={() => handleReportClick(report)}
                  sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <TableCell>{report.level}</TableCell>
                  <TableCell>{report.semester}</TableCell>
                  <TableCell>{report.session}</TableCell>
                  <TableCell>{report.resultId}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="result-modal"
      >
        <Box sx={modalStyle}>
          {selectedReport && (
            <Box sx={modalContentStyle}>
              <Grid container spacing={3}>
                {/* Student Information Section */}
                <Grid item xs={6}>
                  <Box sx={infoSectionStyle}>
                    <Box sx={infoItemStyle}>
                      <Typography variant="caption" color="textSecondary">
                        MATRIC NO.:
                      </Typography>
                      <Typography variant="body1">
                        {selectedReport.studentInfo.matricNo}
                      </Typography>
                    </Box>
                    <Box sx={infoItemStyle}>
                      <Typography variant="caption" color="textSecondary">
                        FULL NAME:
                      </Typography>
                      <Typography variant="body1">
                        {selectedReport.studentInfo.fullName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Academic Information Section */}
                <Grid item xs={6}>
                  <Box sx={infoSectionStyle}>
                    <Box sx={infoItemStyle}>
                      <Typography variant="caption" color="textSecondary">
                        SEMESTER:
                      </Typography>
                      <Typography variant="body1">
                        {selectedReport.semester}
                      </Typography>
                    </Box>
                    <Box sx={infoItemStyle}>
                      <Typography variant="caption" color="textSecondary">
                        LEVEL:
                      </Typography>
                      <Typography variant="body1">
                        {selectedReport.level}
                      </Typography>
                    </Box>
                    <Box sx={infoItemStyle}>
                      <Typography variant="caption" color="textSecondary">
                        SESSION:
                      </Typography>
                      <Typography variant="body1">
                        {selectedReport.session}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* GPA Section */}
              <Box sx={gpaSectionStyle}>
                <Typography variant="caption" color="textSecondary">
                  GPA:
                </Typography>
                <Typography variant="h6">
                  {selectedReport.studentInfo.gpa}
                </Typography>
              </Box>

              {/* Courses Table */}
              <TableContainer component={Paper} sx={{ mt: 3 }}>
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
                    {selectedReport.studentInfo.courses.map((course) => (
                      <TableRow key={course.sn}>
                        <TableCell>{course.sn}</TableCell>
                        <TableCell>{course.code}</TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.units}</TableCell>
                        <TableCell>{course.score}</TableCell>
                        <TableCell>{course.grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Footer Section */}
              <Box sx={footerStyle}>
                <Box>
                  <Typography variant="body2" color="textSecondary">TNU: 21</Typography>
                  <Typography variant="body2" color="textSecondary">Cumulative TNU: 133</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">TCP: 105</Typography>
                  <Typography variant="body2" color="textSecondary">Cumulative TCP: 601</Typography>
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
      </Modal>
    </Box>
  );
};

export default Reports;

// Styles
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

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "1000px",
  maxHeight: "90vh",
  overflow: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const modalContentStyle = {
  width: "100%",
};

const infoSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const infoItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
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