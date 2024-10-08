import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { InstructorType } from "../../../types/instructors";
import { Box, Button, Checkbox, IconButton, TableHead } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useState } from "react";
import InstructorSidebar from "./InstructorsSidebar";

type Props = {
  instructors: InstructorType[];
  editInstructor: (instructor: InstructorType) => void;
  deleteInstructor: (id: number) => void;
  selectedInstructor: InstructorType | undefined;
  setSelectedInstructor: (instructor: InstructorType) => void;
};

const CourseList = ({
  instructors,
  editInstructor,
  deleteInstructor,
  selectedInstructor,
  setSelectedInstructor,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleOpenModal = (instructor: InstructorType) => {
    setSelectedInstructor(instructor);
    setOpenModal(true);
  };

  const handleDelete = (instructor: InstructorType) => {
    if (instructor.id) deleteInstructor(instructor.id);
  };

  const handleViewInstructor = (instructor: InstructorType) => {
    setSelectedInstructor(instructor);
    setOpenSidebar(true);
  };

  const toggleDrawer = (state: boolean) => {
    setOpenSidebar(state);
  };

  return (
    <TableContainer>
      <InstructorSidebar
        open={openSidebar}
        instructor={selectedInstructor as InstructorType}
        toggleDrawer={toggleDrawer}
        openEditModal={() =>
          editInstructor(selectedInstructor as InstructorType)
        }
      />
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedInstructor) handleDelete(selectedInstructor);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText=""
        open={openModal}
        subTitle={`Are you sure you want to delete <strong>“${selectedInstructor?.first_name} ${selectedInstructor?.last_name}”</strong>? You can’t undo this action.`}
        title="Delete Instructor?"
      />

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
            {/* <TableCell>Courses</TableCell> */}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instructors.map((instructor) => (
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
                    style={{
                      border: "none",
                      color: "inherit",
                      padding: 0,
                      textTransform: "capitalize",
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
                <IconButton onClick={() => editInstructor(instructor)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(instructor)}>
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

export default CourseList;
