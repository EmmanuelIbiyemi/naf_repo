import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, Checkbox, IconButton, TableHead } from "@mui/material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteAssessmentMutation,
  useGetSingleQuizQuery,
} from "../../../../store/api/quizzes.api";
import SuccessModal from "../../../../components/SuccessModal";
import { Delete } from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { AssessmentResponse } from "../../../../types/assessments";

const AssessmentList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const { quiz_id } = useParams();
  const {
    data: quiz,
    isFetching,
    isError,
  } = useGetSingleQuizQuery(+(quiz_id || 0));
  const [assessments, setAssessments] = useState(quiz?.data.assessments);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentResponse>();
  const [deleteAssessment, deleteState] = useDeleteAssessmentMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && quiz?.data)
      setAssessments(
        quiz?.data.assessments?.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setAssessments(quiz?.data.assessments);
  }, [keyword, quiz]);

  useEffect(() => {
    if (isFetching || deleteState.isLoading) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, quiz, deleteState]);

  const handleOpenModal = (question: AssessmentResponse, type: string) => {
    setSelectedAssessment(question);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedAssessment(undefined);
  };

  const handleDeleteQuiz = async (id: number) => {
    try {
      await deleteAssessment(id).unwrap();
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
            if (selectedAssessment)
              handleDeleteQuiz(selectedAssessment.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete “${selectedAssessment?.name}” ?`}
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
          title="Could not fetch Assessments"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!assessments?.length ? (
        <EmptyState title="No Assessments found" subTitle="" />
      ) : null}

      {assessments?.length ? (
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
            {assessments?.map((assessment) => {
              return (
                <TableRow
                  key={assessment.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ alignItems: "center", display: "flex" }}>
                      <Checkbox />
                      <Link
                        to={`/cbt/${quiz_id}/${assessment.id}`}
                        style={{ textTransform: "capitalize" }}
                      >
                        {assessment.name}
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenModal(assessment, "delete")}
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

export default AssessmentList;
