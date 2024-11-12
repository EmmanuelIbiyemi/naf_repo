import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { CourseCombinedType, CourseType } from "../../../../types/courses";
import { Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteCourseMutation,
  useGetCoursesByLevelQuery,
  useUpdateCourseMutation,
} from "../../../../store/api/courses.api";
import FormModal from "../../../../components/FormModal";
import CourseForm from "./CourseForm";
import SuccessModal from "../../../../components/SuccessModal";
import { FormAction } from "../../../../types/forms";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";

const CourseList = () => {
  const { level_id } = useParams();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const {
    data: crs,
    isError,
    isFetching,
  } = useGetCoursesByLevelQuery({
    level_id: +(level_id || 0),
    per_page: 1000,
  });
  const [courses, setCourses] = useState<CourseType[] | undefined>(crs?.data);
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && crs?.data)
      setCourses(
        crs.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setCourses(crs?.data);
  }, [keyword, crs]);

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, crs]);

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
            submit: handleEditCourse as FormAction<CourseCombinedType>,
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
        subTitle={`Are you sure you want to delete Course ${selectedCourse?.name}” ? You can’t undo this action.`}
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
        subTitle={`You have successfully added a new Course “${selectedCourse?.name}”.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {isError ? (
            <EmptyState
              title="Could not fetch Courses"
              subTitle="Check your internet connection"
            />
          ) : null}
          {!courses?.length ? (
            <EmptyState
              title="No Courses found"
              subTitle="Courses will appear here after you add them in your school."
            />
          ) : null}
          {courses?.map((course) => (
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
                <Typography
                  sx={{ fontWeight: 500, textTransform: "capitalize" }}
                >
                  {course.name}
                </Typography>
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
