import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { CBTSubjectType } from "../../../types/subjects";
import { Button, IconButton, SxProps, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

type Props = {
  subjects: CBTSubjectType[];
  setSubjects: Dispatch<SetStateAction<CBTSubjectType[]>>;
  selectedSubject: CBTSubjectType | undefined;
  modals: {
    openModals: {
      add: boolean;
      edit: boolean;
      success: boolean;
      delete: boolean;
    };
    handleOpenModal: (type: string) => void;
    handleCloseModal: (type: string) => void;
    handleOpenEditModal: (subject: CBTSubjectType) => void;
    handleOpenDeleteModal: (subject: CBTSubjectType) => void;
  };
};

const CBTtList = ({
  subjects,
  setSubjects,
  selectedSubject,
  modals,
}: Props) => {
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setSubjects((prev) => prev.filter((sb) => sb.id != id));
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedSubject?.id) handleDelete(selectedSubject.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => modals.handleCloseModal("delete")}
        infoText="The students enrolled in this subject will get notified."
        open={modals.openModals.delete}
        subTitle={`Are you sure you want to delete subject`}
        title="Delete Course?"
      />

      <Table sx={tableStyles}>
        <TableBody>
          <Button
            onClick={() => modals.handleOpenModal("add")}
            variant="contained"
            sx={{
              display: "block",
              marginBottom: "1rem",
              marginLeft: "auto",
              textTransform: "capitalize",
            }}
          >
            Add Subject
          </Button>
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
                  onClick={() => navigate("/applications/cbt/questions")}
                >
                  {subject.name}
                </Button>
                <Typography sx={{ color: "secondary.light" }}>
                  {subject.questions.length} Questions
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ display: "flex" }}>
                <IconButton
                  onClick={() => modals.handleOpenDeleteModal(subject)}
                >
                  <Delete />
                </IconButton>
                <IconButton onClick={() => modals.handleOpenEditModal(subject)}>
                  <Edit />
                </IconButton>
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
    // bgcolor: "#fff",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: ".6rem",

    button: {
      paddingBlock: ".3rem",
    },
  },
};
