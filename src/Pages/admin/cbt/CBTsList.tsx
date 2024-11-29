import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { InstructorQuizzesResponse } from "../../../types/quizzes";
import { Box, Checkbox, IconButton, TableHead } from "@mui/material";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteQuizMutation,
  useGetQuizzesQuery,
} from "../../../store/api/quizzes.api";
import SuccessModal from "../../../components/SuccessModal";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../store/app.slice";
import EmptyState from "../../../components/EmptyState";
import CustomPagination from "../../../components/CustomPagination";
import { Pagination } from "../../../types/pagination";

const QuizList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const {
    data: qzs,
    isFetching,
    isError,
  } = useGetQuizzesQuery({
    ...pagination,
    search_term: keyword,
  });
  const [quizzes, setQuizzes] = useState(qzs?.data);
  const [deleteQuiz, deleteState] = useDeleteQuizMutation();
  const [selectedQuiz, setSelectedQuiz] = useState<InstructorQuizzesResponse>();

  useEffect(() => {
    if (qzs?.data) setQuizzes(qzs?.data);
  }, [keyword, qzs]);

  useEffect(() => {
    if (isFetching || deleteState.isLoading) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, qzs, deleteState, dispatch]);

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

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedQuiz) handleDeleteQuiz(selectedQuiz.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete "${selectedQuiz?.name}" ?`}
        title="Delete Quiz?"
      />

      <SuccessModal
        close={() => handleCloseModal("success")}
        infoText=""
        open={openModal.success}
        subTitle={``}
        title="Updates Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Quizzes"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!quizzes?.length ? (
        <EmptyState title="No Quizzes found" subTitle="" />
      ) : null}

      {qzs?.data.length ? (
        <>
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
                        to={`/cbt/${quiz.id}`}
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

          <CustomPagination
            count={Math.ceil(qzs?.pagination.total / qzs?.pagination.per_page)}
            page={qzs?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: qzs?.pagination.per_page, page });
            }}
            startIndex={
              qzs?.pagination.per_page * (qzs?.pagination.page - 1) + 1
            }
            endIndex={qzs?.pagination.per_page * qzs?.pagination.page}
            totalNumber={qzs?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default QuizList;
