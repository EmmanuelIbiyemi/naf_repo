import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Programme, ProgrammeFormAction } from "../../../../types/programmes";
import { Box, Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { ChangeEvent, useEffect, useState } from "react";
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
    bulkDelete: false,
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
  const [deleteProgramme, deleteState] = useDeleteProgrammeMutation();
  const [updateProgramme, updateState] = useUpdateProgrammeMutation();
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    if (prgms?.data) setProgrammes(prgms?.data);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!prgms?.data.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [keyword, prgms]);

  useEffect(() => {
    if (
      (isFetching && !isError) ||
      deleteState.isLoading ||
      updateState.isLoading
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, prgms, deleteState, updateState]);

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

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (programmes?.length && event.target.checked)
      setDeleteIds(programmes.map((dep) => dep.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    programId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != programId);
    setDeleteIds(event.target.checked ? [...newIds, programId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteProgramme(id).unwrap();
        setDeleteIds([]);
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

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Programs ?`}
        title="Delete Programs?"
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

      {/* Bulk delete */}
      <Box sx={{ paddingLeft: "1rem", display: "flex", gap: "1rem" }}>
        <Checkbox
          onChange={handleSelectAll}
          checked={programmes?.length == deleteIds.length}
        />
        {deleteIds.length ? (
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              setOpenModal((prev) => ({ ...prev, bulkDelete: true }))
            }
          >
            <Delete sx={{ marginRight: ".3rem" }} />
            Delete selected
          </Button>
        ) : null}
      </Box>
      {prgms?.data.length ? (
        <>
          <Table sx={{ minWidth: 650 }}>
            <TableBody>
              {programmes?.map((programme) => (
                <TableRow
                  key={programme.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                  >
                    <Checkbox
                      onChange={(event) =>
                        handleSelect(event, programme.id as number)
                      }
                      checked={deleteIds.includes(programme.id as number)}
                    />
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
