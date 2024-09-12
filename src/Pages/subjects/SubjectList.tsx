import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Checkbox, IconButton, TableHead } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { SubjectType } from "../../types/subjects";

type Props = {
  subjects: SubjectType[];
};

const SubjectList = ({ subjects }: Props) => {
  const handleDelete = (id: number) => {
    console.log(id);
  };

  const handleEdit = (id: number) => {
    console.log(id);
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
            >
              <Checkbox /> Instructor
            </TableCell>
            <TableCell>Subject Name</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Rank Requirements</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow
              key={subject.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link to="" style={{ textTransform: "capitalize" }}>
                  {subject.name}
                </Link>
              </TableCell>
              <TableCell scope="row">
                <Link to="" style={{ textTransform: "capitalize" }}>
                  Intructor 1
                </Link>
              </TableCell>
              <TableCell scope="row">
                <Link to="" style={{ textTransform: "capitalize" }}>
                  {subject.duration}
                </Link>
              </TableCell>
              <TableCell scope="row">
                <Link to="" style={{ textTransform: "capitalize" }}>
                  {subject.rank}
                </Link>
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => handleEdit(subject.id)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(subject.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubjectList;
