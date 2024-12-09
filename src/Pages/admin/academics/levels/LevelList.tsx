import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { LevelType } from "../../../../types/levels";
import { Box, Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { ChangeEvent, useEffect, useState } from "react";
import {
  useDeleteLevelMutation,
  useGetLevelsQuery,
  useUpdateLevelMutation,
} from "../../../../store/api/levels.api";
import FormModal from "../../../../components/FormModal";
import LevelForm from "./LevelForm";
import SuccessModal from "../../../../components/SuccessModal";
import { FormAction } from "../../../../types/forms";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectKeyword, setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";

const LevelList = () => {
  const { faculty_id, department_id, program_id } = useParams();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
    bulkDelete: false,
  });
  const [selectedLevel, setSelectedLevel] = useState<LevelType>();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();
  const {
    data: lvls,
    isFetching,
    isError,
  } = useGetLevelsQuery({
    program_id: +(program_id || 0),
    search_term: keyword,
  });
  const [levels, setLevels] = useState(lvls?.data);
  const [deleteLevel, deleteState] = useDeleteLevelMutation();
  const [updateLevel, updateState] = useUpdateLevelMutation();
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  useEffect(() => {
    if (lvls?.data) setLevels(lvls?.data);
  }, [keyword, lvls]);

  useEffect(() => {
    if (
      (isFetching && !isError) ||
      deleteState.isLoading ||
      updateState.isLoading
    )
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, lvls, deleteState, updateState]);

  const handleOpenModal = (level: LevelType, type: string) => {
    setSelectedLevel(level);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedLevel(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (level_id: number) => {
    try {
      await deleteLevel(level_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (levels?.length && event.target.checked)
      setDeleteIds(levels.map((lvl) => lvl.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    levelId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != levelId);
    setDeleteIds(event.target.checked ? [...newIds, levelId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteLevel(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        console.log(error);
      }
  };

  const handleEditLevel = async (level: LevelType) => {
    try {
      await updateLevel(level).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(level, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <LevelForm
          actions={{
            submit: handleEditLevel as FormAction<LevelType>,
            cancel: () => handleCloseModal("edit"),
          }}
          level={selectedLevel}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedLevel) handleDelete(selectedLevel.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="You can’t undo this action."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Level "${selectedLevel?.name}" ?`}
        title="Delete Level?"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Levels ?`}
        title="Delete Levels?"
      />

      {/* Success */}
      <SuccessModal
        close={() => {
          handleCloseModal("success");
          setSelectedLevel(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Level "${selectedLevel?.name}".`}
        title="Updates Successful"
      />

      {isError ? (
        <EmptyState
          title="Could not fetch Levels"
          subTitle="Check your internet connection"
        />
      ) : null}
      {!levels?.length ? (
        <EmptyState
          title="No Levels found"
          subTitle="Levels will appear here after you add them in your school."
        />
      ) : null}

      {/* Bulk delete */}
      <Box sx={{ paddingLeft: "1rem", display: "flex", gap: "1rem" }}>
        <Checkbox
          onChange={handleSelectAll}
          checked={levels?.length == deleteIds.length}
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
      {lvls?.data.length ? (
        <Table sx={{ minWidth: 650 }}>
          <TableBody>
            {levels?.map((level: LevelType) => (
              <TableRow
                key={level.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                >
                  <Checkbox
                    onChange={(event) =>
                      handleSelect(event, level.id as number)
                    }
                    checked={deleteIds.includes(level.id as number)}
                  />
                  <Button
                    onClick={() =>
                      navigate(
                        `/academics/${faculty_id}/${department_id}/${program_id}/${level.id}`
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
                    {level.name}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenModal(level, "edit")}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenModal(level, "delete")}>
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

export default LevelList;
