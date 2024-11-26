import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { LevelType } from "../../../../types/levels";
import { Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useEffect, useState } from "react";
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
  });
  const [selectedLevel, setSelectedLevel] = useState<LevelType>();
  const {
    data: lvls,
    isFetching,
    isError,
  } = useGetLevelsQuery({ program_id: +(program_id || 0) });
  const [levels, setLevels] = useState(lvls?.data);
  const [deleteLevel] = useDeleteLevelMutation();
  const [updateLevel] = useUpdateLevelMutation();
  const keyword = useAppSelector(selectKeyword);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (keyword && lvls?.data)
      setLevels(
        lvls.data.filter((f) =>
          f.name.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    else setLevels(lvls?.data);
  }, [keyword, lvls]);

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else if (isError) dispatch(setPageLoading(false));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, lvls]);

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
                  <Checkbox />
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
