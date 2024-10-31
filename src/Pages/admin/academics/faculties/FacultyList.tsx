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
import { useState } from "react";
import {
  useDeleteFacultyMutation,
  useGetFacultiesQuery,
  useUpdateFacultyMutation,
} from "../../../../store/api/faculties.api";
import FormModal from "../../../../components/FormModal";
import FacultyForm from "./FacultyForm";
import SuccessModal from "../../../../components/SuccessModal";

const FacultyList = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    edit: false,
    success: false,
    delete: false,
  });
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty>();
  const { data: faculty } = useGetFacultiesQuery(null);
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [updateFaculty] = useUpdateFacultyMutation();

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
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText="The instructors enrolled in this Faculty will get notified."
        open={openModal.delete}
        subTitle={`Are you sure you want to delete Faculty <strong>“${selectedFaculty?.name}”</strong>? You can’t undo this action.`}
        title="Delete Faculty?"
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
          setSelectedFaculty(undefined);
        }}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully added a new Faculty <strong>“${selectedFaculty?.name}”</strong>.`}
        title="Updates Successful"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {faculty?.data.map((faculty: Faculty) => (
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
                <IconButton onClick={() => handleOpenModal(faculty, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(faculty, "delete")}>
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

export default FacultyList;
