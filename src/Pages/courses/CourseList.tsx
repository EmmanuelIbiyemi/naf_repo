import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { CourseType } from "../../types/courses";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";

type Props = {
  courses: CourseType[];
  editCourse: (course: CourseType) => void;
  deleteCourse: (id: number) => void;
};

const CourseList = ({ courses, editCourse, deleteCourse }: Props) => {
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {courses.map((course) => (
            <TableRow
              key={course.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/courses/${course.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {course.name}
                </Link>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => editCourse(course)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => deleteCourse(course.id)}>
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

export default CourseList;
