import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { TestFormData } from "./testformtypes";

interface ModalProps {
  formData: TestFormData;
  onChange: (newData: Partial<TestFormData>) => void;
  onImportCSV: () => void;
  onInputManually: () => void;
}

const Step1Content: React.FC<ModalProps> = ({ formData, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ subject: event.target.value });
  };

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          fontSize: "1.2rem",
          color: "#434343",
          marginBottom: ".7em",
        }}
      >
        Optional
      </Typography>
      <Box
        sx={{
          border: "1px solid #E1E1E1",
          padding: "1em",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontSize: "1.2rem",
            color: "#434343",
            marginBottom: ".7em",
          }}
        >
          Input CBT name
        </Typography>
        <Box sx={{ maxHeight: "35vh", overflowY: "scroll" }}>
          <TextField
            id="subject"
            placeholder="Input subject name"
            value={formData.subject}
            onChange={handleChange}
            sx={{
              marginBottom: "1em",
              width: "100%",
              backgroundColor: "#F1F1F1",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Step1Content;
