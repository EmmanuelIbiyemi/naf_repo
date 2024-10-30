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
  Button,
  Modal,
} from "@mui/material";
import { useState } from "react";

interface ReportData {
  matricNo: string;
  fullName: string;
  semester: string;
  level: string;
  session: string;
  gpa: number;
  courses: {
    sn: number;
    code: string;
    title: string;
    units: number;
    score: number;
    grade: string;
  }[];
  tnu: number;
  tcp: number;
  cumulativeTnu: number;
  cumulativeTcp: number;
}

const ReportsModal = ({ report }: { report: ReportData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => setIsModalOpen(false);

  return (
    <>

      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box sx={headerStyle}>
            <Typography variant="h6">MATRIC NO: {report.matricNo}</Typography>
            <Typography variant="h6">FULL NAME: {report.fullName}</Typography>
            <Typography variant="body1">SEMESTER: {report.semester}</Typography>
            <Typography variant="body1">LEVEL: {report.level}</Typography>
            <Typography variant="body1">SESSION: {report.session}</Typography>
            <Typography variant="body1">GPA: {report.gpa.toFixed(2)}</Typography>
          </Box>

          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
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
                {report.courses.map((course) => (
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

          <Box sx={footerStyle}>
            <Typography variant="body2">TNU: {report.tnu}</Typography>
            <Typography variant="body2">TCP: {report.tcp}</Typography>
            <Typography variant="body2">Cumulative TNU: {report.cumulativeTnu}</Typography>
            <Typography variant="body2">Cumulative TCP: {report.cumulativeTcp}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
            <Button variant="contained" disabled>
              Download
            </Button>
            <Button variant="contained" color="primary">
              Print Result
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

// Styles
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  padding: 4,
  borderRadius: 2,
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd",
  paddingBottom: 1,
};

const footerStyle = {
  display: "flex",
  justifyContent: "space-between",
  paddingTop: 2,
  borderTop: "1px solid #ddd",
  marginTop: 2,
};

export default ReportsModal;
