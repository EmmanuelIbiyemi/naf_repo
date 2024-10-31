import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { VisibilityOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TestParticipantsList = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const PaginatedRows = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return tableBody.slice(startIndex, startIndex + rowsPerPage);
  }, [page, rowsPerPage]);

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ border: "1px solid #D9D9D9" }}>
              {tableHead.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "#F1F1F1",
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {PaginatedRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ border: "none" }}>{row.studentId}</TableCell>
                <TableCell sx={{ border: "none" }}>{row.name}</TableCell>
                <TableCell sx={{ border: "none" }}>
                  {row.dateSubmitted}
                </TableCell>
                <TableCell sx={{ border: "none" }}>{row.performance}</TableCell>
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#2C62EE",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={() => navigate(`detail/${row.id}`)}
                >
                  <VisibilityOutlined /> View Details{" "}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30, 50]}
        component="div"
        count={tableBody.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

const tableHead = [
  { id: 1, label: "Student ID", minWidth: 170 },
  { id: 2, label: "Name", minWidth: 100 },
  { id: 3, label: "Date Submitted", minWidth: 170 },
  { id: 4, label: "Performance", minWidth: 170 },
  { id: 5, label: "Actions", minWidth: 170 },
];

const tableBody = [
  {
    id: 1,
    studentId: "TIPSGHM 2022336",
    name: "Harsh Kadyan",
    dateSubmitted: "23 - 09 - 2024",
    performance: "23%",
  },
  {
    id: 2,
    studentId: "TIPSGHM 2022336",
    name: "Harsh Kadyan",
    dateSubmitted: "23 - 09 - 2024",
    performance: "79%",
  },
  {
    id: 3,
    studentId: "TIPSGHM 2022336",
    name: "Harsh Kadyan",
    dateSubmitted: "23 - 09 - 2024",
    performance: "48%",
  },
  // {
  //   id: 4,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 5,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 6,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 7,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 8,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 9,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 10,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 11,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 12,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 13,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 14,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
  // {
  //   id: 15,
  //   studentId: "TIPSGHM 2022336",
  //   name: "Harsh Kadyan",
  //   dateSubmitted: "23 - 09 - 2024",
  //   performance: "79%",
  // },
];

export default TestParticipantsList;
