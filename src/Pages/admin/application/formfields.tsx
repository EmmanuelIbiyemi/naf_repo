import React from "react";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  SelectChangeEvent,
  TextField,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteIcon from "@mui/icons-material/Delete";

export type FieldProps = {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  position: number;
  key?: string;
  is_required?: boolean;
};

type ActionButtonsProps = {
  element: FieldProps;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
};

export const ActionButtons = ({
  element,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ActionButtonsProps) => {
  return (
    <Box sx={{ display: "flex", gap: ".3rem", alignItems: "center" }}>
      <IconButton className="move_up_btn" onClick={() => onMoveUp(element.id)}>
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton
        className="move_down_btn"
        onClick={() => onMoveDown(element.id)}
      >
        <ArrowDownwardIcon />
      </IconButton>
      <IconButton className="delete_btn" onClick={() => onDelete(element.id)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

const capitalizeText = (text: string) => {
  return text
    .split(" ")
    .map((t) => t[0].toUpperCase() + t.substring(1))
    .join(" ");
};

const fieldTypes = [
  "text",
  "textarea",
  "select",
  "radio",
  "date",
  "file",
  "photo",
].map((type) => (
  <MenuItem key={type} value={type}>
    {capitalizeText(type)}
  </MenuItem>
));

type FieldComponentProps = {
  element: FieldProps;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onFieldChange: (updatedField: FieldProps) => void;
};

const Field = ({
  element,
  onDelete,
  onMoveUp,
  onMoveDown,
  onFieldChange,
}: FieldComponentProps) => {
  // Ensure key is set (avoid mutation if possible)
  const field = { ...element, key: element.key || element.id };

  const handleFieldTypeChange = (e: SelectChangeEvent) => {
    onFieldChange({ ...field, type: e.target.value, key: field.key });
  };

  const handleFieldNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange({ ...field, name: e.target.value, key: field.key });
  };

  const handleFieldPlaceholderChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFieldChange({ ...field, placeholder: e.target.value, key: field.key });
  };

  // The position change logic uses the provided callbacks onMoveUp / onMoveDown.
  // This component delegates that functionality to the parent via these callbacks.

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <ActionButtons
          element={field}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
        />
      </Box>
      <FormControl
        fullWidth
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: ".8rem", // Increased gap for better spacing
        }}
      >
        <FormControl fullWidth>
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={field.type ? field.type : "text"}
            label="Type"
            onChange={handleFieldTypeChange}
          >
            {fieldTypes}
          </Select>
        </FormControl>
        <TextField
          label="Name"
          value={field.name}
          onChange={handleFieldNameChange}
          variant="outlined" // Added variant for a cleaner look
        />
        <TextField
          label="Placeholder"
          value={field.placeholder}
          onChange={handleFieldPlaceholderChange}
          variant="outlined" // Added variant for a cleaner look
        />
        {/* Add Is required checkbox */}
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={field.is_required}
                onChange={(e) =>
                  onFieldChange({
                    ...field,
                    is_required: e.target.checked,
                    key: field.key,
                  })
                }
              />
            }
            label="Is required"
          />
      </FormControl>
      </FormControl>
    </Box>
  );
};

export default Field;