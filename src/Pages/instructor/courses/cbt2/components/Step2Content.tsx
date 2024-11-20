import React, { ChangeEvent } from "react";
import { Box, Button } from "@mui/material";
import csvIcon from "../../../../../assets/csvIcon.svg";
import notesQuestionIcon from "../../../../../assets/notesQuestionIcon.svg";

type ModalProps = {
  onImportCSV: (e: ChangeEvent<HTMLInputElement>) => void;
  onInputManually: () => void;
};

const Step3Content: React.FC<ModalProps> = ({
  onImportCSV,
  onInputManually,
}) => {
  const handleOpenSelect = () => {
    document.getElementById("file")?.click();
  };

  return (
    <Box>
      <Box
        sx={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr 1fr" }}
      >
        <Box
          sx={{
            display: "grid",
            alignItems: "center",
            padding: "2em 1.3em",
          }}
        >
          <img
            src={csvIcon}
            alt="CSV Icon"
            style={{ width: "9em", marginBottom: "1em" }}
          />
          <Button onClick={handleOpenSelect}>Import CSV</Button>
          <input id="file" type="file" hidden onChange={onImportCSV} />
        </Box>

        <Box
          sx={{
            display: "grid",
            alignContent: "space-between",
            padding: "2em 1.3em",
          }}
        >
          <img
            src={notesQuestionIcon}
            alt="Notes Icon"
            style={{ width: "9em", marginBottom: "1em" }}
          />
          <Button onClick={onInputManually}>Input Manually</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Step3Content;
