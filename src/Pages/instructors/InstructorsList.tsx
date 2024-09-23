import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { InstructorType } from "../../types/instructors";
import { Box, Button, Checkbox, IconButton, TableHead } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useState } from "react";
import { blurBg, unBlurBg } from "../../functions/modal";
import InstructorSidebar from "./InstructorsSidebar";

type Props = {
  instructors: InstructorType[];
  editInstructor: (course: InstructorType) => void;
  deleteInstructor: (id: number) => void;
  selectedInstructor: InstructorType | undefined;
  setSelectedInstructor: (participant: InstructorType) => void;
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

  const handleOpenModal = (participant: InstructorType) => {
    blurBg();
    setSelectedInstructor(participant);
    setOpenModal(true);
  };

  const handleDelete = (course: InstructorType) => {
    deleteInstructor(course.id);
    unBlurBg();
  };

  const handleViewInstructor = (participant: InstructorType) => {
    setSelectedInstructor(participant);
    setOpenSidebar(true);
    blurBg();
  };

  const toggleDrawer = (state: boolean) => {
    if (state) blurBg();
    else unBlurBg();
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
        infoText="The students enrolled in this subject will get notified."
        open={openModal}
        subTitle={`Are you sure you want to delete subject <strong>“${selectedInstructor?.first_name} ${selectedInstructor?.last_name}”</strong>? You can’t undo this action.`}
        title="Delete Course?"
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
            <TableCell>Courses</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {instructors.map((participant) => (
            <TableRow
              key={participant.id}
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
                    onClick={() => handleViewInstructor(participant)}
                  >
                    {participant.first_name} {participant.last_name}
                  </Button>
                </Box>
              </TableCell>
              <TableCell component="th" scope="row">
                {participant.email}
              </TableCell>
              <TableCell component="th" scope="row">
                {participant.phone_number}
              </TableCell>
              <TableCell component="th" scope="row">
                {participant.courses.map((c) => c.name).join(", ")}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => editInstructor(participant)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(participant)}>
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
