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

const ProgrammeList = () => {
  const { department_id, faculty_id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedProgramme, setSelectedProgramme] = useState<Programme>();
  const {
    data: prgms,
    isFetching,
    isError,
  } = useGetProgrammesQuery(+(department_id || 0));
  const [programmes, setProgrammes] = useState(prgms?.data);
  const [deleteProgramme] = useDeleteProgrammeMutation();
  const [updateProgramme] = useUpdateProgrammeMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && prgms?.data)
      setProgrammes(
        prgms.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setProgrammes(prgms?.data);
  }, [keyword, prgms]);

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
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
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The instructors enrolled in this Programme will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Programme ${selectedProgramme?.name}”</strong>? You can’t undo this action.`}
        title="Delete Programme?"
      />

      {/* Success */}
      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => {
          handleCloseModal("success");
          setSelectedProgramme(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Programme ${selectedProgramme?.name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
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
                <IconButton onClick={() => handleOpenModal(programme, "edit")}>
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
    </TableContainer>
  );
};

export default ProgrammeList;
