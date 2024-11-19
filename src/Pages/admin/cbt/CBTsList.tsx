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

const QuizList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const { data: qzs, isFetching, isError } = useGetQuizzesQuery(null);
  const [quizzes, setQuizzes] = useState(qzs?.data);
  const [deleteQuiz, deleteState] = useDeleteQuizMutation();
  const [selectedQuiz, setSelectedQuiz] = useState<InstructorQuizzesResponse>();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

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
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText=""
        open={openModal.delete}
        subTitle={`Are you sure you want to delete “${selectedQuiz?.name}” ? You can’t undo this action.`}
        title="Delete Quiz?"
      />

      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
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

      {quizzes?.length ? (
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
      ) : null}
    </TableContainer>
  );
};

export default QuizList;
