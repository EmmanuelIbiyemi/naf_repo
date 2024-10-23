import { Box, Button } from "@mui/material";
import csvIcon from "../../../../../assets/csvIcon.svg";
import notesQuestionIcon from "../../../../../assets/notesQuestionIcon.svg";

type ModalProps = {
  onImportCSV: () => void;
  onInputManually: () => void;
};

const Step3Content = ({ onImportCSV, onInputManually }: ModalProps) => {
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
            padding: "2em 1.3em",
          }}
        >
          <Box sx={{ width: "9em", margin: "2.2em 1em" }}>
            <img src={csvIcon} style={{ width: "100%" }} />
          </Box>
          <Button
            sx={{
              border: "1px solid #FCC21B",
              fontSize: ".8rem",
              padding: ".8em",
              fontWeight: 500,
              backgroundColor: "#F0F9FF",
            }}
            onClick={onImportCSV}
          >
            Import CSV
          </Button>
        </Box>
        <Box
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
            padding: "2em 1.3em",
          }}
        >
          <Box sx={{ width: "9em", margin: "2.2em 1em" }}>
            <img src={notesQuestionIcon} style={{ width: "100%" }} />
          </Box>
          <Button
            sx={{
              border: "1px solid #FCC21B",
              fontSize: ".8rem",
              padding: ".8em",
              fontWeight: 500,
              backgroundColor: "#F0F9FF",
            }}
            onClick={onInputManually}
          >
            Input Manually
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Step3Content;
