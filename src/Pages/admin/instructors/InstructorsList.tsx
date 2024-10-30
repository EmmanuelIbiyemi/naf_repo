import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  InstructorEditFuncType,
  InstructorType,
} from "../../../types/instructors";
import { Box, Button, Checkbox, IconButton, TableHead } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useState } from "react";
import InstructorSidebar from "./InstructorsSidebar";
import {
  useDeleteInstructorMutation,
  useGetInstructorsQuery,
  useUpdateInstructorMutation,
} from "../../../store/api/instructors.api";
import LoadingScreen from "../../../components/LoadingScreen";
import SuccessModal from "../../../components/SuccessModal";
import FormModal from "../../../components/FormModal";
import InstructorForm from "./InstructorsForm";

type Props = {
  selectedInstructor: InstructorType | undefined;
  setSelectedInstructor: (instructor: InstructorType | undefined) => void;
};

const InstructorList = ({
  selectedInstructor,
  setSelectedInstructor,
}: Props) => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data: instructors, isLoading } = useGetInstructorsQuery(null);
  const [deleteInstructor, deleteState] = useDeleteInstructorMutation();
  const [updateInstructor, updateState] = useUpdateInstructorMutation();

  const handleOpenModal = (instructor: InstructorType, type: string) => {
    setSelectedInstructor(instructor);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedInstructor(undefined);
  };

  const handleViewInstructor = (instructor: InstructorType) => {
    setSelectedInstructor(instructor);
    setOpenSidebar(true);
  };

  const toggleDrawer = (state: boolean) => {
    setOpenSidebar(state);
  };

  const handleDeleteInstructor = async (id: number) => {
    try {
      await deleteInstructor(id).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("delete");
  };

  const handleEditInstructor = async (instructor: InstructorType) => {
    try {
      await updateInstructor(instructor).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(instructor, "success");
  };

  return (
    <TableContainer>
      {[isLoading, deleteState.isLoading, updateState.isLoading].some(
        (item) => item
      ) ? (
        <Box sx={{ position: "relative", zIndex: 2000 }}>
          <LoadingScreen />
        </Box>
      ) : null}

      <InstructorSidebar
        open={openSidebar}
        instructor={selectedInstructor as InstructorType}
        toggleDrawer={toggleDrawer}
        openEditModal={() =>
          handleOpenModal(selectedInstructor as InstructorType, "edit")
        }
      />
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedInstructor)
              handleDeleteInstructor(selectedInstructor.id as number);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText=""
        open={openModal.delete}
        subTitle={`Are you sure you want to delete <strong>“${selectedInstructor?.first_name} ${selectedInstructor?.last_name}”</strong>? You can’t undo this action.`}
        title="Delete Instructor?"
      />

      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => handleCloseModal("success")}
        infoText=""
        open={openModal.success}
        subTitle={`You have successfully updated student.`}
        title="Updates Successful"
      />

      <FormModal open={openModal.edit} close={() => handleCloseModal("edit")}>
        <InstructorForm
          actions={{
            submit: handleEditInstructor as InstructorEditFuncType,
            cancel: () => handleCloseModal("edit"),
          }}
          instructor={selectedInstructor as InstructorType}
        />
      </FormModal>

      <Table
        sx={{
          minWidth: 650,
          ".MuiTableCell-root": {
            maxWidth: 200,
            a: {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email Address</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instructors?.data.map((instructor) => (
            <TableRow
              key={instructor.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box
                  sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                >
                  <Checkbox />
                  <Button
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
                    onClick={() => handleViewInstructor(instructor)}
                  >
                    {instructor.first_name} {instructor.last_name}
                  </Button>
                </Box>
              </TableCell>
              <TableCell component="th" scope="row">
                {instructor.email}
              </TableCell>
              <TableCell component="th" scope="row">
                {instructor.phone}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(instructor, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal(instructor, "delete")}
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

export default InstructorList;
