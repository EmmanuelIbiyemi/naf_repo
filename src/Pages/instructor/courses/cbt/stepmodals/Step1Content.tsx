import React, { useState } from "react";
import {
  Box,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { TestFormData } from "./testformtypes";
import { CourseType } from "../../../../../types/courses";

interface ModalProps {
  formData: TestFormData;
  onChange: (newData: Partial<TestFormData>) => void;
  onImportCSV: () => void;
  onInputManually: () => void;
  subjects?: CourseType[];
}

const Step1Content: React.FC<ModalProps> = ({
  formData,
  onChange,
  subjects,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedSubject = event.target.value;
    onChange({ subject: selectedSubject });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredSubjects = subjects?.filter((subj) =>
    subj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Select Subject
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Select Course"
          value={searchTerm}
          onChange={handleSearch}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
          sx={{ marginBottom: "1em" }}
        />
        <Box sx={{ maxHeight: "35vh", overflowY: "scroll" }}>
          <RadioGroup value={formData.subject} onChange={handleChange}>
            {filteredSubjects?.map((subject) => (
              <FormControlLabel
                value={subject.name}
                control={<Radio />}
                label={subject.name}
                key={subject.id}
                sx={{
                  color: "#6A6A6A",
                  fontSize: ".9rem",
                  margin: ".2em 0",
                }}
              />
            ))}
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default Step1Content;
