import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { LevelType } from "../../../../types/levels";
import { Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteLevelMutation,
  useGetLevelsQuery,
  useUpdateLevelMutation,
} from "../../../../store/api/levels.api";
import FormModal from "../../../../components/FormModal";
import LevelForm from "./LevelForm";
import SuccessModal from "../../../../components/SuccessModal";
import { FormAction } from "../../../../types/forms";

const LevelList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedLevel, setSelectedLevel] = useState<LevelType>();
  const { data: levels } = useGetLevelsQuery(location.state.programme_id);

  const [deleteLevel] = useDeleteLevelMutation();
  const [updateLevel] = useUpdateLevelMutation();

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
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The instructors enrolled in this Level will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Level <strong>“${selectedLevel?.name}”</strong>? You can’t undo this action.`}
        title="Delete Level?"
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
          setSelectedLevel(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Level <strong>“${selectedLevel?.name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {levels?.data.map((level: LevelType) => (
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
                    navigate(`/academics/courses`, {
                      state: { ...location.state, level_id: level.id },
                    })
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
    </TableContainer>
  );
};

export default LevelList;
