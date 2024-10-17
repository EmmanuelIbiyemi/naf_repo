import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { LevelCoordinator, LevelCoordinatorFormAction, LevelCoordinatorResponse } from "../../../../types/levelCoordinators";
import { Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import {
  useDeleteLevelCoordinatorMutation,
  useGetLevelCoordinatorsQuery,
  useUpdateLevelCoordinatorMutation,
} from "../../../../store/api/levelCoordinators.api";
import FormModal from "../../../../components/FormModal";
import LevelCoordinatorForm from "./LevelCoordinatorsForm";
import SuccessModal from "../../../../components/SuccessModal";

const LevelCoordinatorList = () => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedLevelCoordinator, setSelectedLevelCoordinator] = useState<LevelCoordinator>();
  const { data: levelCoordinators } = useGetLevelCoordinatorsQuery(null);
  const [deleteLevelCoordinator] = useDeleteLevelCoordinatorMutation();
  const [updateLevelCoordinator] = useUpdateLevelCoordinatorMutation();

  const handleOpenModal = (levelCoordinator: LevelCoordinator, type: string) => {
    setSelectedLevelCoordinator(levelCoordinator);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setSelectedLevelCoordinator(undefined);
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDelete = async (levelCoordinator_id: number) => {
    try {
      await deleteLevelCoordinator(levelCoordinator_id).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditLevelCoordinator = async (levelCoordinator: LevelCoordinator) => {
    try {
      await updateLevelCoordinator(levelCoordinator).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(levelCoordinator, "success");
  };

  return (
    <TableContainer>
      {/* ADD */}
      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <LevelCoordinatorForm
          actions={{
            submit: handleEditLevelCoordinator as LevelCoordinatorFormAction,
            cancel: () => handleCloseModal("edit"),
          }}
          levelCoordinator={selectedLevelCoordinator}
        />
      </FormModal>

      {/* DELETE */}
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedLevelCoordinator) handleDelete(selectedLevelCoordinator.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The instructors enrolled in this Level Coordinator will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Level Coordinator <strong>"${selectedLevelCoordinator?.first_name} ${selectedLevelCoordinator?.last_name}"</strong>? You can't undo this action.`}
        title="Delete Level Coordinator?"
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
          setSelectedLevelCoordinator(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Level Coordinator <strong>"${selectedLevelCoordinator?.first_name} ${selectedLevelCoordinator?.last_name}"</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {(levelCoordinators as LevelCoordinatorResponse)?.data.map((levelCoordinator: LevelCoordinator) => (
            <TableRow
              key={levelCoordinator.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link
                  to={`/levelCoordinator/${levelCoordinator.id}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {`${levelCoordinator.first_name} ${levelCoordinator.last_name}`}
                </Link>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(levelCoordinator, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(levelCoordinator, "delete")}>
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

export default LevelCoordinatorList;