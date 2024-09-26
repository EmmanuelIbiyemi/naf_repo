import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { CBTSubjectType } from "../../types/subjects";
import { Button, SxProps, Typography } from "@mui/material";
import { useState } from "react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";

const CBTtList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [subjects, setSubjects] = useState<CBTSubjectType[]>([
    {
      id: 1,
      name: "Subject 1",
      questions: [
        {
          id: 1,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
        {
          id: 2,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
        {
          id: 3,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
      ],
    },
    {
      id: 2,
      name: "Subject 1",
      questions: [
        {
          id: 1,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
        {
          id: 2,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
        {
          id: 3,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
      ],
    },
    {
      id: 3,
      name: "Subject 1",
      questions: [
        {
          id: 1,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
        {
          id: 2,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
        {
          id: 3,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
        },
      ],
    },
  ]);
  const [selectedCBT, setSelectedCBT] = useState<CBTSubjectType>(subjects[0]);

  const handleOpenModal = (subject: CBTSubjectType) => {
    setSelectedCBT(subject);
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    setSubjects((prev) => prev.filter((sb) => sb.id != id));
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedCBT.id) handleDelete(selectedCBT.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText="The students enrolled in this subject will get notified."
        open={openModal}
        subTitle={`Are you sure you want to delete subject`}
        title="Delete Course?"
      />

      <Table sx={tableStyles}>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject.id} sx={{ "td,th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Button
                  style={{
                    border: "none",
                    color: "inherit",
                    fontSize: "20px",
                    padding: 0,
                    textTransform: "capitalize",
                  }}
                >
                  {subject.name}
                </Button>
                <Typography sx={{ color: "secondary.light" }}>
                  {subject.questions.length} Questions
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ display: "grid", gap: ".6rem" }}>
                <Button onClick={() => handleOpenModal(subject)}>Edit</Button>
                <Button onClick={() => handleOpenModal(subject)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CBTtList;

const tableStyles: SxProps = {
  minWidth: 650,
  ".MuiTableRow-root": {
    bgcolor: "#fff",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: ".6rem",

    button: {
      paddingBlock: ".3rem",
    },
  },
};
