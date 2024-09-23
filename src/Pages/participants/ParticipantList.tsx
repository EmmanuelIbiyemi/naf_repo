import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { ParticipantType } from "../../types/participants";
import { Box, Button, Checkbox, IconButton, TableHead } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useState } from "react";
import { blurBg, unBlurBg } from "../../functions/modal";
import ParticipantSidebar from "./ParticipantSidebar";

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
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleOpenModal = (participant: ParticipantType) => {
    blurBg();
    setSelectedParticipant(participant);
    setOpenModal(true);
  };

  const handleDelete = (course: ParticipantType) => {
    deleteParticipant(course.id);
    unBlurBg();
  };

  const handleViewParticipant = (participant: ParticipantType) => {
    setSelectedParticipant(participant);
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
      <ParticipantSidebar
        open={openSidebar}
        participant={selectedParticipant as ParticipantType}
        toggleDrawer={toggleDrawer}
        openEditModal={() =>
          editParticipant(selectedParticipant as ParticipantType)
        }
      />
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
          {participants.map((participant) => (
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
                    onClick={() => handleViewParticipant(participant)}
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
                <IconButton onClick={() => editParticipant(participant)}>
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
