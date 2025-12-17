import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { InstructorQuizzesResponse } from "../../../types/quizzes";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TableHead,
  Typography,
} from "@mui/material";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { ChangeEvent, useEffect, useState } from "react";
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
    bulkDelete: false,
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
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    if (qzs?.data) setQuizzes(qzs?.data);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!qzs?.data.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [keyword, qzs]);

  useEffect(() => {
    if ((isFetching || deleteState.isLoading) && !isError)
      dispatch(setPageLoading(true));
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
      handleCloseModal("delete");
      setOpenModal((prev) => ({ ...prev, success: true }));
    } catch (error) {
      handleCloseModal("delete");
    }
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (quizzes?.length && event.target.checked)
      setDeleteIds(quizzes.map((qz) => qz.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    facultyId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != facultyId);
    setDeleteIds(event.target.checked ? [...newIds, facultyId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteQuiz(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        console.log(error);
      }
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

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Quizzes ?`}
        title="Delete Quizzes?"
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
                a: {
                  maxWidth: 200,
                  padding: "",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                  align="left"
                >
                  {/* Bulk delete */}
                  <Box
                    sx={{ display: "flex", gap: "1rem", position: "relative" }}
                  >
                    <Checkbox
                      onChange={handleSelectAll}
                      checked={quizzes?.length == deleteIds.length}
                    />
                    {deleteIds.length ? (
                      <Button
                        sx={{
                          position: "absolute",
                          left: "58px",
                          height: "auto",
                          textWrap: "nowrap",
                        }}
                        variant="contained"
                        color="error"
                        onClick={() =>
                          setOpenModal((prev) => ({
                            ...prev,
                            bulkDelete: true,
                          }))
                        }
                      >
                        <Delete sx={{ marginRight: ".3rem" }} />
                        Delete selected
                      </Button>
                    ) : null}
                  </Box>
                  <Typography sx={{ marginLeft: "1rem" }}>Name</Typography>
                </TableCell>
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
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      gap: "1rem",
                      width: "100%",
                    }}
                  >
                    <Checkbox
                      onChange={(event) =>
                        handleSelect(event, quiz.id as number)
                      }
                      checked={deleteIds.includes(quiz.id as number)}
                    />
                    <Link
                      to={`/cbt/${quiz.id}`}
                      style={{ textTransform: "capitalize" }}
                    >
                      {quiz.name}
                    </Link>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {quiz.code}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {dayjs(quiz.start_date).format("DD-MM-YYYY HH:mm")}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {dayjs(quiz.expiry_date).format("DD-MM-YYYY HH:mm")}
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
