import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { CourseCombinedType, CourseType } from "../../../../types/courses";
import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useAddLevelCourseMutation,
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
import { Pagination } from "../../../../types/pagination";
import CustomPagination from "../../../../components/CustomPagination";

const CourseList = () => {
  const { level_id } = useParams();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
    bulkDelete: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<CourseType>();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const {
    data: crs,
    isError,
    isFetching,
  } = useGetCoursesByLevelQuery({
    level_id: +(level_id || 0),
    search_term: keyword,
    ...pagination,
  });
  const [courses, setCourses] = useState<CourseType[] | undefined>(crs?.data);
  const [deleteCourse, deleteState] = useDeleteCourseMutation();
  const [updateCourse, updateState] = useUpdateCourseMutation();
  const [addCourseToLevel] = useAddLevelCourseMutation();
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    if (crs?.data) setCourses(crs?.data);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!crs?.data.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [keyword, crs]);

  useEffect(() => {
    if (
      (isFetching && !isError) ||
      deleteState.isLoading ||
      updateState.isLoading
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, crs, deleteState, updateState]);

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

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (courses?.length && event.target.checked)
      setDeleteIds(courses.map((crs) => crs.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    courseId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != courseId);
    setDeleteIds(event.target.checked ? [...newIds, courseId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteCourse(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        console.log(error);
      }
  };

  const handleEditCourse = async (course: CourseType) => {
    try {
      await updateCourse(course).unwrap();
      await addCourseToLevel({
        course_ids: [course.id as number],
        level_id: +(level_id || 0) as number,
        type: course.type,
      }).unwrap();
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
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Course ${selectedCourse?.name}” ?`}
        title="Delete Course?"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Courses ?`}
        title="Delete Courses?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedCourse(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Course “${selectedCourse?.name}”.`}
        title="Updates Successful"
      />

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

      {/* Bulk delete */}
      <Box sx={{ paddingLeft: "1rem", display: "flex", gap: "1rem" }}>
        <Checkbox
          onChange={handleSelectAll}
          checked={courses?.length == deleteIds.length}
        />
        {deleteIds.length ? (
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              setOpenModal((prev) => ({ ...prev, bulkDelete: true }))
            }
          >
            <Delete sx={{ marginRight: ".3rem" }} />
            Delete selected
          </Button>
        ) : null}
      </Box>
      {crs?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
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
                    <Checkbox
                      onChange={(event) =>
                        handleSelect(event, course.id as number)
                      }
                      checked={deleteIds.includes(course.id as number)}
                    />
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
                    <IconButton
                      onClick={() => handleOpenModal(course, "delete")}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <CustomPagination
            count={Math.ceil(crs?.pagination.total / crs?.pagination.per_page)}
            page={crs?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: crs?.pagination.per_page, page });
            }}
            startIndex={
              crs?.pagination.per_page * (crs?.pagination.page - 1) + 1
            }
            endIndex={crs?.pagination.per_page * crs?.pagination.page}
            totalNumber={crs?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default CourseList;
