import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Checkbox,
  IconButton,
  TableHead,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import {
  useDeleteQuestionMutation,
  useGetSingleAssessmentQuery,
} from "../../../../../store/api/quizzes.api";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../../store/app.slice";
import DeleteConfirmationModal from "../../../../../components/DeleteConfirmationModal";
import SuccessModal from "../../../../../components/SuccessModal";
import EmptyState from "../../../../../components/EmptyState";
import { Question, Questions } from "../../../../../types/questions";

const QuestionList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const { assessment_id } = useParams();
  const {
    data: quiz,
    isFetching,
    isError,
  } = useGetSingleAssessmentQuery(+(assessment_id || 0));
  const [questions, setQuestions] = useState<Questions>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [deleteQuestion, deleteState] = useDeleteQuestionMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  // Handle keyword search and initialize questions
  useEffect(() => {
    if (quiz?.data?.questions?.length) {
      const filteredQuestions = keyword
        ? quiz.data.questions.filter((q) =>
            q.body.toLowerCase().includes(keyword.toLowerCase())
          )
        : quiz.data.questions;
      setQuestions(filteredQuestions);
    } else {
      setQuestions([]);
    }
  }, [keyword, quiz]);

  // Handle loading state
  useEffect(() => {
    const isLoading = isFetching || deleteState.isLoading;
    dispatch(setPageLoading(isLoading));
  }, [isFetching, deleteState.isLoading, dispatch]);

  const handleOpenModal = (question: Question, type: string) => {
    setSelectedQuestion(question);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type === "success") setSelectedQuestion(null);
  };

  const handleDeleteQuiz = async (id: number) => {
    try {
      await deleteQuestion(id).unwrap();
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      handleCloseModal("delete");
    }
  };

  return (
    <TableContainer>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedQuestion) handleDeleteQuiz(selectedQuestion.id);
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete "${selectedQuestion?.body}" ?`}
        title="Delete Quiz?"
      />

      {/* Success Modal */}
      <SuccessModal
        close={() => handleCloseModal("success")}
        infoText=""
        open={openModal.success}
        subTitle=""
        title="Updates Successful"
      />

      {/* Display Empty State or Table */}
      {isError ? (
        <EmptyState
          title="Could not fetch Questions"
          subTitle="Check your internet connection"
        />
      ) : !questions.length ? (
        <EmptyState title="No Questions found" subTitle="" />
      ) : (
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
              <TableCell>Questions</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => {
              const answer = question.options.find(
                (opt) => opt.is_answer
              )?.body;
              return (
                <TableRow
                  key={question.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ alignItems: "center", display: "flex" }}>
                      <Checkbox />
                      <Typography style={{ textTransform: "capitalize" }}>
                        {question.body}
                      </Typography>
                    </Box>
                    <Box sx={{ paddingLeft: "2.7rem" }}>
                      Options:{" "}
                      {question.options.map((opt) => opt.body).join(" * ")}
                    </Box>
                    <Box sx={{ paddingLeft: "2.7rem" }}>Answer: {answer}</Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenModal(question, "delete")}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default QuestionList;
