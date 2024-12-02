import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, Checkbox, IconButton, TableHead } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import {
  useDeleteQuizMutation,
  useGetInstructorCourseQuizzesQuery,
} from "../../../../store/api/quizzes.api";
import { InstructorQuizzesResponse } from "../../../../types/quizzes";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import SuccessModal from "../../../../components/SuccessModal";
import EmptyState from "../../../../components/EmptyState";
import CustomPagination from "../../../../components/CustomPagination";

interface QuizListProps {
  courseId?: string;
}

const QuizList: React.FC<QuizListProps> = ({ courseId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  const {
    data: qzs,
    isFetching,
    isError,
  } = useGetInstructorCourseQuizzesQuery(
    {
      course_id: courseId ? parseInt(courseId) : null,
      page: currentPage,
    },
    { skip: !courseId }
  );

  const [quizzes, setQuizzes] = useState(qzs?.data);
  const [deleteQuiz, deleteState] = useDeleteQuizMutation();
  const [selectedQuiz, setSelectedQuiz] = useState<InstructorQuizzesResponse>();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });

  useEffect(() => {
    if (keyword && qzs?.data)
      setQuizzes(
        qzs.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setQuizzes(qzs?.data);
  }, [keyword, qzs]);

  useEffect(() => {
    if (isFetching || deleteState.isLoading) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, qzs, deleteState]);

  const handleOpenModal = (quiz: InstructorQuizzesResponse, type: string) => {
    setSelectedQuiz(quiz);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedQuiz(undefined);
  };

  const handleDeleteQuiz = async (id: number) => {
    try {
      await deleteQuiz(id).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("delete");
  };

  const totalItems = qzs?.pagination?.total || 0;
  const itemsPerPage = qzs?.pagination.per_page || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <>
      <TableContainer>
        <DeleteConfirmationModal
          actions={{
            proceed: () => {
              if (selectedQuiz) handleDeleteQuiz(selectedQuiz.id as number);
              console.log("proceed");
            },
          }}
          close={() => handleCloseModal("delete")}
          infoText="You can't undo this action."
          open={openModal.delete}
          subTitle={`Are you sure you want to delete '${selectedQuiz?.name}" ?`}
          title="Delete Quiz?"
        />

        <SuccessModal
          close={() => handleCloseModal("success")}
          infoText=""
          open={openModal.success}
          subTitle={``}
          title="Updates Successful"
        />

        {!courseId ? (
          <EmptyState
            title="Select a Course"
            subTitle="Please select a course to view quizzes"
          />
        ) : isError ? (
          <EmptyState
            title="Could not fetch Quizzes"
            subTitle="Check your internet connection"
          />
        ) : null}

        {quizzes?.length === 0 && courseId && (
          <EmptyState title="No Quizzes found" subTitle="" />
        )}

        {quizzes?.length && courseId ? (
          <Table
            sx={{
              minWidth: 650,
              ".MuiTableCell-root": {
                maxWidth: 200,
                a: {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes?.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ alignItems: "center", display: "flex" }}>
                      <Checkbox />
                      <Link
                        to={`${courseId}/${quiz.id}`}
                        style={{ textTransform: "capitalize" }}
                      >
                        {quiz.name}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {quiz.code}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {dayjs(quiz.start_date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {dayjs(quiz.expiry_date).format("DD-MM-YYYY")}
                  </TableCell>

                  <TableCell>
                    <IconButton onClick={() => handleOpenModal(quiz, "delete")}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </TableContainer>

      {quizzes?.length && courseId ? (
        <CustomPagination
          startIndex={startIndex + 1}
          endIndex={endIndex}
          totalNumber={totalItems}
          count={Math.ceil(totalItems / itemsPerPage)}
          page={currentPage}
          handleChangePage={handleChangePage}
        />
      ) : null}
    </>
  );
};

export default QuizList;
