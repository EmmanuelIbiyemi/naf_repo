import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { StudentEditFuncType, StudentType } from "../../../types/students";
import { Box, Button, Checkbox, IconButton, TableHead } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useState } from "react";
import StudentSidebar from "./StudentsSidebar";
import {
  useDeleteStudentMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation,
} from "../../../store/api/students.api";
import FormModal from "../../../components/FormModal";
import StudentsForm from "./StudentsForm";
import SuccessModal from "../../../components/SuccessModal";
import LoadingScreen from "../../../components/LoadingScreen";

type Props = {
  selectedStudent: StudentType | undefined;
  setSelectedStudent: (student: StudentType | undefined) => void;
};

const StudentList = ({ selectedStudent, setSelectedStudent }: Props) => {
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    success: false,
  });
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data: students, isLoading } = useGetStudentsQuery(null);
  const [deleteStudent, deleteState] = useDeleteStudentMutation();
  const [updateStudent, updateState] = useUpdateStudentMutation();

  const handleOpenModal = (student: StudentType, type: string) => {
    setSelectedStudent(student);
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    if (type == "success") setSelectedStudent(undefined);
  };

  const handleViewStudent = (student: StudentType) => {
    setSelectedStudent(student);
    setOpenSidebar(true);
  };

  const toggleDrawer = (state: boolean) => {
    setOpenSidebar(state);
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      await deleteStudent(id).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("delete");
  };

  const handleEditStudent = async (student: StudentType) => {
    try {
      await updateStudent(student).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleCloseModal("edit");
    handleOpenModal(student, "success");
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
      <StudentSidebar
        open={openSidebar}
        student={selectedStudent as StudentType}
        toggleDrawer={toggleDrawer}
        openEditModal={() =>
          handleOpenModal(selectedStudent as StudentType, "edit")
        }
      />
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedStudent) handleDeleteStudent(selectedStudent.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText=""
        open={openModal.delete}
        subTitle={`Are you sure you want to delete <strong>“${selectedStudent?.first_name} ${selectedStudent?.last_name}”</strong>? You can’t undo this action.`}
        title="Delete Student?"
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
        <StudentsForm
          actions={{
            submit: handleEditStudent as StudentEditFuncType,
            cancel: () => handleCloseModal("edit"),
          }}
          student={selectedStudent as StudentType}
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
            <TableCell>Courses</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students?.data.map((student) => (
            <TableRow
              key={student.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box
                  sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                >
                  <Checkbox />
                  <Button
                    style={{
                      border: "none",
                      color: "inherit",
                      padding: 0,
                      textTransform: "capitalize",
                    }}
                    onClick={() => handleViewStudent(student)}
                  >
                    {student.first_name} {student.last_name}
                  </Button>
                </Box>
              </TableCell>
              <TableCell component="th" scope="row">
                {student.email}
              </TableCell>
              <TableCell component="th" scope="row">
                {student.phone}
              </TableCell>
              <TableCell component="th" scope="row">
                {student.courses?.map((c) => c.name).join(", ")}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpenModal(student, "edit")}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(student, "delete")}>
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

export default StudentList;
