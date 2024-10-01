import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { CBTQuestion } from "../../../types/subjects";
import { Button, SxProps, Typography } from "@mui/material";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";

type Props = {
  questions: CBTQuestion[];
  setQuestions: (questions: CBTQuestion[]) => void;
  selectedQuestion: CBTQuestion | undefined;
  modals: {
    openModals: {
      add: boolean;
      edit: boolean;
      success: boolean;
      delete: boolean;
    };
    handleOpenModal: (type: string) => void;
    handleCloseModal: (type: string) => void;
    handleOpenEditModal: (question: CBTQuestion) => void;
    handleOpenDeleteModal: (question: CBTQuestion) => void;
  };
};

const CBTQuestiontList = ({
  questions,
  setQuestions,
  selectedQuestion,
  modals,
}: Props) => {
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    setQuestions(questions.filter((qs) => qs.id != id));
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedQuestion?.id) handleDelete(selectedQuestion.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => modals.handleCloseModal("delete")}
        infoText=""
        open={modals.openModals.delete}
        subTitle={`Are you sure you want to delete question`}
        title="Delete Question?"
      />

      <Table sx={tableStyles}>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id} sx={{ "td,th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                <Button
                  style={{
                    border: "none",
                    color: "inherit",
                    fontSize: "20px",
                    padding: 0,
                    textTransform: "capitalize",
                  }}
                  onClick={() => navigate("/")}
                >
                  {question.question}
                </Button>
                <Typography
                  sx={{ color: "secondary.light" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      "<strong>Options:</strong> " +
                      question.options.join(" &#8226; "),
                  }}
                />
              </TableCell>
              <TableCell align="right" sx={{ display: "grid", gap: ".6rem" }}>
                <Button onClick={() => modals.handleOpenEditModal(question)}>
                  Edit
                </Button>
                <Button onClick={() => modals.handleOpenDeleteModal(question)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CBTQuestiontList;

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
