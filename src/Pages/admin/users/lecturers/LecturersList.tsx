import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { LecturerFormAction, Lecturer } from "../../../../types/lecturers";
import { Checkbox, IconButton, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteLecturerMutation,
  useGetLecturersQuery,
  useUpdateLecturerMutation,
} from "../../../../store/api/lecturers.api";
import FormModal from "../../../../components/FormModal";
import LecturerForm from "./LecturersForm";
import SuccessModal from "../../../../components/SuccessModal";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import EmptyState from "../../../../components/EmptyState";
import { Pagination } from "../../../../types/pagination";
import CustomPagination from "../../../../components/CustomPagination";
import LecturerSidebar from "./LecturerSidebar";

const LecturersList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
    sidebar: false,
  });
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer>();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const dispatch = useAppDispatch();
  const keyword = useAppSelector(selectKeyword);
  const {
    data: ltcs,
    isFetching,
    isError,
  } = useGetLecturersQuery({ ...pagination, search_term: keyword });
  const [lecturers, setLecturers] = useState(ltcs?.data);
  const [deleteLecturer] = useDeleteLecturerMutation();
  const [updateLecturer] = useUpdateLecturerMutation();

  useEffect(() => {
    if (ltcs?.data) setLecturers(ltcs?.data);
  }, [keyword, ltcs]);

  const handleOpenModal = (lecturer: Lecturer, type: string) => {
    setSelectedLecturer(lecturer);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedLecturer(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (lecturer_id: number) => {
    try {
      await deleteLecturer(lecturer_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditLecturer = async (lecturer: Lecturer) => {
    try {
      await updateLecturer(lecturer).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(lecturer, "success");
  };

  useEffect(() => {
    if (isFetching && isError) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, lecturers]);

  return (
    <TableContainer>
      <LecturerSidebar
        lecturer={selectedLecturer}
        toggleDrawer={() => handleCloseModal("sidebar")}
      />
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <LecturerForm
          actions={{
            submit: handleEditLecturer as LecturerFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          lecturer={selectedLecturer}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedLecturer) handleDelete(selectedLecturer.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Lecturer "${selectedLecturer?.first_name} ${selectedLecturer?.last_name}"?.`}
        title="Delete Lecturer?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedLecturer(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Lecturer ${selectedLecturer?.first_name}”</strong>.`}
        title="Updates Successful"
      />

      {ltcs?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {isError ? (
                <EmptyState
                  title="Could not fetch Lecturers"
                  subTitle="Check your internet connection"
                />
              ) : null}
              {!lecturers?.length ? (
                <EmptyState
                  title="No Lecturers found"
                  subTitle="Lecturers will appear here after you add them in your school."
                />
              ) : null}
              {lecturers?.map((lecturer: Lecturer) => (
                <TableRow
                  key={lecturer.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Checkbox />
                    <Typography
                      style={{ textTransform: "capitalize", fontWeight: 500 }}
                    >
                      {lecturer.first_name} {lecturer.last_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenModal(lecturer, "edit")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenModal(lecturer, "delete")}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <CustomPagination
            count={Math.ceil(
              ltcs?.pagination.total / ltcs?.pagination.per_page
            )}
            page={ltcs?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: ltcs?.pagination.per_page, page });
            }}
            startIndex={
              ltcs?.pagination.per_page * (ltcs?.pagination.page - 1) + 1
            }
            endIndex={ltcs?.pagination.per_page * ltcs?.pagination.page}
            totalNumber={ltcs?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default LecturersList;
