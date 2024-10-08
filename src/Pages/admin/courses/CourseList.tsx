import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { CourseFormAction, CourseType } from "../../../types/courses";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
} from "../../../store/api/courses.api";
import FormModal from "../../../components/FormModal";
import CourseForm from "./CourseForm";
import SuccessModal from "../../../components/SuccessModal";

const CourseList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const { data: courses } = useGetCoursesQuery(null);
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();

  const handleOpenModal = (course: CourseType, type: string) => {
    setSelectedCourse(course);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedCourse(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (course_id: number) => {
    try {
      await deleteCourse(course_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCourse = async (course: CourseType) => {
    try {
      await updateCourse(course).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(course, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <CourseForm
          actions={{
            submit: handleEditCourse as CourseFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          course={selectedCourse}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedCourse) handleDelete(selectedCourse.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The students enrolled in this Course will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Course <strong>“${selectedCourse?.name}”</strong>? You can’t undo this action.`}
        title="Delete Course?"
      />

      {/* Success */}
      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => {
          handleCloseModal("success");
          setSelectedCourse(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Course <strong>“${selectedCourse?.name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {courses?.data.map((course) => (
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
                <IconButton onClick={() => handleOpenModal(course, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(course, "delete")}>
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
