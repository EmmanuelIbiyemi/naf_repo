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
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteQuestionMutation,
  useGetSingleAssessmentQuery,
} from "../../../../store/api/quizzes.api";
import SuccessModal from "../../../../components/SuccessModal";
import { Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { Questions } from "../../../../types/questions";

const QuestionList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const { assessment_id } = useParams();
  const {
    data: assessment,
    isFetching,
    isError,
  } = useGetSingleAssessmentQuery(+(assessment_id || 0));
  const [questions, setQuestions] = useState(assessment?.data.questions);

  const [selectedQuestion, setSelectedQuestion] = useState<Questions[0]>();
  const [deleteQuestion, deleteState] = useDeleteQuestionMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && assessment?.data)
      setQuestions(
        assessment?.data?.questions.filter((f) =>
          f.body.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setQuestions(assessment?.data?.questions);
  }, [keyword, assessment]);

  useEffect(() => {
    if (isFetching || deleteState.isLoading) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, assessment, deleteState]);

  const handleOpenModal = (question: Questions[0], type: string) => {
    setSelectedQuestion(question);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedQuestion(undefined);
  };

  const handleDeleteQuiz = async (id: number) => {
    try {
      await deleteQuestion(id).unwrap();
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
            if (selectedQuestion)
              handleDeleteQuiz(selectedQuestion.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete “${selectedQuestion?.body}” ?`}
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
          title="Could not fetch Questions"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!questions?.length ? (
        <EmptyState title="No Questions found" subTitle="" />
      ) : null}

      {questions?.length ? (
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
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions?.map((question) => {
              let answer = "";
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
                      {question.options
                        .map((opt) => {
                          if (opt.is_answer) answer = opt.body;
                          return opt.body;
                        })
                        .join(" * ")}
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
      ) : null}
    </TableContainer>
  );
};

export default QuestionList;
