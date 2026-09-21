import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { LockOpen, Close } from "@mui/icons-material";

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
    if (code.trim()) {
      onSubmit(code);
      setCode("");
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && code.trim()) {
      handleSubmit();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              borderRadius: "50%",
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LockOpen />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Enter CBT Access Code
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enter the code provided by your instructor
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <TextField
          label="CBT Access Code"
          placeholder="e.g., CBT-2024-ABC123"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          fullWidth
          autoFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "1.1rem",
              letterSpacing: "0.5px",
            }
          }}
          helperText="The code is case-sensitive"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          size="large"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          size="large"
          disabled={!code.trim()}
          sx={{
            px: 4,
            fontWeight: 600,
          }}
        >
          Start Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CBTCodeModal;
