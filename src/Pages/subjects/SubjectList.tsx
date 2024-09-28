import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Checkbox, IconButton, TableHead } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { SubjectType } from "../../types/subjects";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useState } from "react";

type Props = {
  subjects: SubjectType[];
  editSubject: (subject: SubjectType) => void;
  deleteSubject: (id: number) => void;
  selectedSubject: SubjectType | undefined;
  setSelectedSubject: (subject: SubjectType) => void;
};

const SubjectList = ({
  subjects,
  editSubject,
  deleteSubject,
  selectedSubject,
  setSelectedSubject,
}: Props) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = (subject: SubjectType) => {
    setSelectedSubject(subject);
    setOpenModal(true);
  };

  const handleDelete = (subject: SubjectType) => {
    deleteSubject(subject.id);
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedSubject) handleDelete(selectedSubject);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText="The students enrolled in this subject will get notified."
        open={openModal}
        subTitle={`Are you sure you want to delete subject <strong>“${selectedSubject?.name}}”</strong>? You can’t undo this action.`}
        title="Delete Course?"
      />
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
            >
              <Checkbox /> Subject Name
            </TableCell>
            <TableCell>Instructors</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Rank Requirements</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow
              key={subject.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Link to="" style={{ textTransform: "capitalize" }}>
                  {subject.name}
                </Link>
              </TableCell>
              <TableCell scope="row">
                <Link to="" style={{ textTransform: "capitalize" }}>
                  Intructor 1
                </Link>
              </TableCell>
              <TableCell scope="row">
                <Link to="" style={{ textTransform: "capitalize" }}>
                  {subject.duration}
                </Link>
              </TableCell>
              <TableCell scope="row">
                <Link to="" style={{ textTransform: "capitalize" }}>
                  {subject.rank}
                </Link>
              </TableCell>
              <TableCell align="center">
                <IconButton onClick={() => editSubject(subject)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(subject)}>
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

export default SubjectList;
