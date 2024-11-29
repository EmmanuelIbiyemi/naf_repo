import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Programme, ProgrammeFormAction } from "../../../../types/programmes";
import { Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
import {
  useDeleteProgrammeMutation,
  useGetProgrammesQuery,
  useUpdateProgrammeMutation,
} from "../../../../store/api/programmes.api";
import FormModal from "../../../../components/FormModal";
import ProgrammeForm from "./ProgrammeForm";
import SuccessModal from "../../../../components/SuccessModal";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { Pagination } from "../../../../types/pagination";
import CustomPagination from "../../../../components/CustomPagination";

const ProgrammeList = () => {
  const { department_id, faculty_id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedProgramme, setSelectedProgramme] = useState<Programme>();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const {
    data: prgms,
    isFetching,
    isError,
  } = useGetProgrammesQuery({
    department_id: +(department_id || 0),
    search_term: keyword,
    ...pagination,
  });
  const [programmes, setProgrammes] = useState(prgms?.data);
  const [deleteProgramme] = useDeleteProgrammeMutation();
  const [updateProgramme] = useUpdateProgrammeMutation();

  useEffect(() => {
    if (prgms?.data) setProgrammes(prgms?.data);
  }, [keyword, prgms]);

  useEffect(() => {
    if (isFetching && !isError) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, prgms]);

  const handleOpenModal = (programme: Programme, type: string) => {
    setSelectedProgramme(programme);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedProgramme(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (programme_id: number) => {
    try {
      await deleteProgramme(programme_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProgramme = async (programme: Programme) => {
    try {
      await updateProgramme(programme).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(programme, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <ProgrammeForm
          actions={{
            submit: handleEditProgramme as ProgrammeFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          programme={selectedProgramme}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedProgramme) handleDelete(selectedProgramme.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Programme ${selectedProgramme?.name}” ?`}
        title="Delete Programme?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedProgramme(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Programme "${selectedProgramme?.name}".`}
        title="Updates Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Programs"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!programmes?.length ? (
        <EmptyState
          title="No Programs found"
          subTitle="Programs will appear here after you add them in your school."
        />
      ) : null}

      {prgms?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {programmes?.map((programme: Programme) => (
                <TableRow
                  key={programme.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Checkbox />
                    <Button
                      onClick={() =>
                        navigate(
                          `/academics/${faculty_id}/${department_id}/${programme.id}`
                        )
                      }
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
                      {programme.name}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenModal(programme, "edit")}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenModal(programme, "delete")}
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
              prgms?.pagination.total / prgms?.pagination.per_page
            )}
            page={prgms?.pagination.page}
            handleChangePage={(_, page) => {
              setPagination({ per_page: prgms?.pagination.per_page, page });
            }}
            startIndex={
              prgms?.pagination.per_page * (prgms?.pagination.page - 1) + 1
            }
            endIndex={prgms?.pagination.per_page * prgms?.pagination.page}
            totalNumber={prgms?.pagination.total}
          />
        </>
      ) : null}
    </TableContainer>
  );
};

export default ProgrammeList;
