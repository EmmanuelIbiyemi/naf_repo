import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ParticipantType } from "../../types/participants";
import { Box, Checkbox, IconButton, TableHead } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useState } from "react";
import { blurBg, unBlurBg } from "../../functions/modal";

type Props = {
  participants: ParticipantType[];
  editParticipant: (course: ParticipantType) => void;
  deleteParticipant: (id: number) => void;
  selectedParticipant: ParticipantType | undefined;
  setSelectedParticipant: (participant: ParticipantType) => void;
};

const CourseList = ({
  participants,
  editParticipant,
  deleteParticipant,
  selectedParticipant,
  setSelectedParticipant,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (participant: ParticipantType) => {
    blurBg();
    setSelectedParticipant(participant);
    setOpenModal(true);
  };

  const handleDelete = (course: ParticipantType) => {
    deleteParticipant(course.id);
    unBlurBg();
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedParticipant) handleDelete(selectedParticipant);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText="The students enrolled in this subject will get notified."
        open={openModal}
        subTitle={`Are you sure you want to delete subject <strong>“${selectedParticipant?.first_name} ${selectedParticipant?.last_name}”</strong>? You can’t undo this action.`}
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
          {participants.map((course) => (
            <TableRow
              key={course.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box
                  sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
                >
                  <Checkbox />
                  <Link
                    to={`/participants/${course.id}`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {course.first_name} {course.last_name}
                  </Link>
                </Box>
              </TableCell>
              <TableCell component="th" scope="row">
                {course.email}
              </TableCell>
              <TableCell component="th" scope="row">
                {course.phone_number}
              </TableCell>
              <TableCell component="th" scope="row">
                {course.courses}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => editParticipant(course)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(course)}>
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
