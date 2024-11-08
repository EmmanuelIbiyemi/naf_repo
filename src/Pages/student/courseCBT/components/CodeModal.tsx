import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface CBTCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const CBTCodeModal: React.FC<CBTCodeModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    onSubmit(code);
    setCode("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Enter CBT Code</DialogTitle>
      <DialogContent>
        <TextField
          label="CBT Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CBTCodeModal;
