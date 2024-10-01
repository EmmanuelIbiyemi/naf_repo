import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { CourseType } from "../../../types/courses";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useState } from "react";

type Props = {
  courses: CourseType[];
  editCourse: (course: CourseType) => void;
  deleteCourse: (id: number) => void;
};

const CourseList = ({ courses, editCourse, deleteCourse }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();

  const handleOpenModal = (course: CourseType) => {
    setSelectedCourse(course);
    setOpenModal(true);
  };

  const handleDelete = (course: CourseType) => {
    deleteCourse(course.id);
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedCourse) handleDelete(selectedCourse);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText="The students enrolled in this subject will get notified."
        open={openModal}
        subTitle={`Are you sure you want to delete subject <strong>“${selectedCourse?.name}”</strong>? You can’t undo this action.`}
        title="Delete Course?"
      />

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
                <IconButton onClick={() => handleOpenModal(course)}>
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
