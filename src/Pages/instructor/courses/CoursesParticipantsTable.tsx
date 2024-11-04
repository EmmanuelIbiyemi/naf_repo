import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import { VisibilityOutlined } from "@mui/icons-material";
import { Box, LinearProgress } from "@mui/material";
import { useGetCourseParticipantsQuery } from "../../../store/api/participants.api";

const CoursesParticipantsTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 2];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const { data: participants, isLoading: isFetchingParticipants } =
    useGetCourseParticipantsQuery({ course_id: parseInt(courseId) });

  // Calculate the slice of data to display based on current page and rowsPerPage
  const PaginatedRows = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return participants?.data?.slice(startIndex, startIndex + rowsPerPage);
  }, [page, participants?.data, rowsPerPage]);

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {isFetchingParticipants && <LinearProgress />}
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
            {PaginatedRows?.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ border: "none" }}>
                  {row.matric_number === null ? "N/A" : row.matric_number}
                </TableCell>
                <TableCell
                  sx={{ border: "none" }}
                >{`${row.first_name} ${row.last_name}`}</TableCell>
                <TableCell sx={{ border: "none" }}>{row.email}</TableCell>
                <TableCell sx={{ border: "none" }}>{row.phone}</TableCell>
                {/* <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#2C62EE",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={() => console.log(row.id)}
                >
                  <VisibilityOutlined /> View Details{" "}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30, 50]}
        component="div"
        count={participants?.data.length || 0}
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
  { id: 3, label: "Email Address", minWidth: 170 },
  { id: 4, label: "Phone Number", minWidth: 170 },
  // { id: 5, label: "Actions", minWidth: 170 },
];

export default CoursesParticipantsTable;
