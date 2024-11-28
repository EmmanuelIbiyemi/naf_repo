import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Faculty, FacultyFormAction } from "../../../../types/faculties";
import { Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteFacultyMutation,
  useGetFacultiesQuery,
  useUpdateFacultyMutation,
} from "../../../../store/api/faculties.api";
import FormModal from "../../../../components/FormModal";
import FacultyForm from "./FacultyForm";
import SuccessModal from "../../../../components/SuccessModal";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import CustomPagination from "../../../../components/CustomPagination";
import { Pagination } from "../../../../types/pagination";

const FacultyList = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty>();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const {
    data: facs,
    isFetching,
    isError,
  } = useGetFacultiesQuery({ ...pagination, search_term: keyword });
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [updateFaculty] = useUpdateFacultyMutation();
  const [faculties, setFaculties] = useState<Faculty[] | undefined>(facs?.data);

  useEffect(() => {
    if (facs?.data) setFaculties(facs?.data);
  }, [keyword, facs]);

  useEffect(() => {
    if (isFetching && !isError) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, facs]);

  const handleOpenModal = (faculty: Faculty, type: string) => {
    setSelectedFaculty(faculty);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedFaculty(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (faculty_id: number) => {
    try {
      await deleteFaculty(faculty_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditFaculty = async (faculty: Faculty) => {
    try {
      await updateFaculty(faculty).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(faculty, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <FacultyForm
          actions={{
            submit: handleEditFaculty as FacultyFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          faculty={selectedFaculty}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedFaculty) handleDelete(selectedFaculty.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Faculty "${selectedFaculty?.name}" ?`}
        title="Delete Faculty?"
      />

      {/* Success */}
      <SuccessModal
        open={openModal.success}
        close={() => {
          handleCloseModal("success");
          setSelectedFaculty(undefined);
        }}
        infoText=""
        subTitle={`You have successfully added a new Faculty "${selectedFaculty?.name}".`}
        title="Updates Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Faculties"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!faculties?.length && !isError ? (
        <EmptyState
          title="No Faculties found"
          subTitle="Faculties will appear here after you add them in your school."
        />
      ) : null}

      {facs?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {faculties?.map((faculty: Faculty) => (
                <TableRow
                  key={faculty.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Checkbox />
                    <Button
                      onClick={() => navigate(`/academics/${faculty.id}`)}
                      sx={{
                        "&.MuiButton-root": {
                          border: "none",
                          color: "inherit",
                          padding: 0,
                          textTransform: "capitalize",
                          justifyContent: "start",
                          textAlign: "left",
                        },
                      }}
                    >
                      {faculty.name}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenModal(faculty, "edit")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenModal(faculty, "delete")}
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
              facs?.pagination.total / facs?.pagination.per_page
            )}
            page={facs?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: 10, page });
            }}
            startIndex={
              facs?.pagination.per_page * (facs?.pagination.page - 1) + 1
            }
            endIndex={facs?.pagination.per_page * facs?.pagination.page}
            totalNumber={facs?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default FacultyList;
