import React, { useState } from "react";
import {
  Box,
  Fab,
  SxProps,
  TextField,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Add, Delete, KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Field, { FieldProps } from "../formfields";
import { formElements } from "../elements";
import { FormElement } from "../../../../types/form";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Row {
  id: number;
  fields: FieldProps[];
}

interface Section {
  id: number;
  name: string;
  rows: Row[];
}

// Define the structure of the form data to match the backend
interface FormData {
  name: string;
  instructions: string;
  fee: number;
  sections: Section[];
}

interface FormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const FormContentArea = ({ formData, setFormData }: FormProps) => {
  const [sectionCounter, setSectionCounter] = useState(1);
  const [rowCounter, setRowCounter] = useState(1);
  const [availableFields] = useState<FormElement[]>(formElements);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleAddSection = () => {
    const newSection: Section = {
      id: sectionCounter,
      name: "",
      rows: [],
    };

    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));

    setSectionCounter(prev => prev + 1);
  };

  const handleSectionNameChange = (id: number, name: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, name } : section
      ),
    }));
  };

  const handleAddRow = (sectionId: number) => {
    const newRow: Row = { id: rowCounter, fields: [] };

    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, rows: [...section.rows, newRow] }
          : section
      ),
    }));

    setRowCounter(prev => prev + 1);
  };

  const handleAddField = (sectionId: number, rowId: number) => {
    setSelectedSectionId(sectionId);
    setSelectedRowId(rowId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFieldSelection = (field: FormElement) => {
    if (selectedSectionId !== null && selectedRowId !== null) {
      const newFieldKey = field.key || `field-${Math.random().toString(36).substring(2, 9)}`;

      // Check for duplicate keys within the entire form
      const isDuplicateKey = formData.sections.some(section =>
        section.rows.some(row =>
          row.fields.some(existingField => existingField.key === newFieldKey)
        )
      );

      if (isDuplicateKey) {
        toast.warn("A similar field already exists. Please use a different type or use a custom instead.", {
          position: "top-right"
        });
        setDialogOpen(false);
        return; // Prevent adding the field
      }

      const newField: FieldProps = {
        id: Math.random().toString(36).substring(2, 9),
        key: newFieldKey,
        name: field.name,
        type: field.type,
        placeholder: field.placeholder,
        is_required: true,
        position: 0,
      };

      setFormData(prev => ({
        ...prev,
        sections: prev.sections.map(section => {
          if (section.id === selectedSectionId) {
            return {
              ...section,
              rows: section.rows.map(row => {
                if (row.id === selectedRowId) {
                  return { ...row, fields: [...row.fields, newField] };
                }
                return row;
              }),
            };
          }
          return section;
        }),
      }));
      setDialogOpen(false);
    }
  };

  const handleDeleteSection = (sectionId: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
  };

  const handleDeleteRow = (sectionId: number, rowId: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            rows: section.rows.filter(row => row.id !== rowId),
          };
        }
        return section;
      }),
    }));
  };

  const handleFieldChange = (
    sectionId: number,
    rowId: number,
    updatedField: FieldProps
  ) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id === rowId) {
                return {
                  ...row,
                  fields: row.fields.map(field =>
                    field.id === updatedField.id ? updatedField : field
                  ),
                };
              }
              return row;
            }),
          };
        }
        return section;
      }),
    }));
  };

  const handleDeleteField = (sectionId: number, rowId: number, fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            rows: section.rows.map(row => {
              if (row.id === rowId) {
                return {
                  ...row,
                  fields: row.fields.filter(field => field.id !== fieldId),
                };
              }
              return row;
            }),
          };
        }
        return section;
      }),
    }));
  };

  // Update the handleMoveFieldUp function to handle moving between rows
  const handleMoveFieldUp = (sectionId: number, rowId: number, fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          const sectionRows = [...section.rows];
          const currentRowIndex = sectionRows.findIndex(row => row.id === rowId);
          const currentRow = {...sectionRows[currentRowIndex]};
          const fieldIndex = currentRow.fields.findIndex(field => field.id === fieldId);
          
          // If field is at the top of current row and there's a row above
          if (fieldIndex === 0 && currentRowIndex > 0) {
            const fieldToMove = currentRow.fields[0];
            // Create new arrays instead of modifying existing ones
            sectionRows[currentRowIndex] = {
              ...currentRow,
              fields: [...currentRow.fields.slice(1)]
            };
            sectionRows[currentRowIndex - 1] = {
              ...sectionRows[currentRowIndex - 1],
              fields: [...sectionRows[currentRowIndex - 1].fields, fieldToMove]
            };
          } else if (fieldIndex > 0) {
            // Move within the same row
            const newFields = [...currentRow.fields];
            const temp = newFields[fieldIndex];
            newFields[fieldIndex] = newFields[fieldIndex - 1];
            newFields[fieldIndex - 1] = temp;
            sectionRows[currentRowIndex] = {
              ...currentRow,
              fields: newFields
            };
          }
          return { ...section, rows: sectionRows };
        }
        return section;
      }),
    }));
  };

  // Update the handleMoveFieldDown function to handle moving between rows
  const handleMoveFieldDown = (sectionId: number, rowId: number, fieldId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          const sectionRows = [...section.rows];
          const currentRowIndex = sectionRows.findIndex(row => row.id === rowId);
          const currentRow = {...sectionRows[currentRowIndex]};
          const fieldIndex = currentRow.fields.findIndex(field => field.id === fieldId);
          
          // If field is at the bottom of current row and there's a row below
          if (fieldIndex === currentRow.fields.length - 1 && currentRowIndex < sectionRows.length - 1) {
            const fieldToMove = currentRow.fields[fieldIndex];
            // Create new arrays instead of modifying existing ones
            sectionRows[currentRowIndex] = {
              ...currentRow,
              fields: [...currentRow.fields.slice(0, -1)]
            };
            sectionRows[currentRowIndex + 1] = {
              ...sectionRows[currentRowIndex + 1],
              fields: [fieldToMove, ...sectionRows[currentRowIndex + 1].fields]
            };
          } else if (fieldIndex < currentRow.fields.length - 1) {
            // Move within the same row
            const newFields = [...currentRow.fields];
            const temp = newFields[fieldIndex];
            newFields[fieldIndex] = newFields[fieldIndex + 1];
            newFields[fieldIndex + 1] = temp;
            sectionRows[currentRowIndex] = {
              ...currentRow,
              fields: newFields
            };
          }
          return { ...section, rows: sectionRows };
        }
        return section;
      }),
    }));
  };

  const handleMoveRowUp = (sectionId: number, rowId: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          const rows = [...section.rows];
          const index = rows.findIndex(row => row.id === rowId);
          if (index > 0) {
            const temp = rows[index];
            rows[index] = rows[index - 1];
            rows[index - 1] = temp;
            return { ...section, rows };
          }
        }
        return section;
      }),
    }));
  };

  const handleMoveRowDown = (sectionId: number, rowId: number) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          const rows = [...section.rows];
          const index = rows.findIndex(row => row.id === rowId);
          if (index < rows.length - 1) {
            const temp = rows[index];
            rows[index] = rows[index + 1];
            rows[index + 1] = temp;
            return { ...section, rows };
          }
        }
        return section;
      }),
    }));
  };

  return (
    <Box>
      {/* Floating Add Section Button */}
      <Tooltip title="Add Section" placement="left">
        <Fab
          color="primary"
          onClick={handleAddSection}
          sx={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            borderRadius: "50%",
          }}
        >
          <Add />
        </Fab>
      </Tooltip>

      <Box sx={formContentContainerStyles}>
        <Box sx={{ padding: "1.5rem", width: "100%" }}>
          <Typography variant="h5" sx={{ fontWeight: 300, marginBottom: "1rem" }}>
            {formData.name}
          </Typography>
          {/* Render sections */}
          {formData.sections.map(section => (
            <Box key={section.id} sx={{ ...sectionContainerStyles, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                  label="Section Name"
                  value={section.name}
                  onChange={e => handleSectionNameChange(section.id, e.target.value)}
                  sx={{ marginBottom: "0.5rem", width: 'calc(100% - 40px)' }} // Reduced width
                  fullWidth
                />
                <Tooltip title="Delete Section" placement="bottom">
                  <IconButton
                    className="delete_btn"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
              {/* Render rows as selectable rectangles */}
              {section.rows.map((row, rowIndex) => (
                <Box
                  key={row.id}
                  sx={{
                    ...rowContainerStyles,
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Render Fields */}
                  <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    {row.fields &&
                      row.fields.map(field => (
                        <Box key={field.id} sx={fieldContainerStyles} className="element">
                          <Field
                            key={field.id}
                            element={field}
                            onDelete={fieldId =>
                              handleDeleteField(section.id, row.id, fieldId)
                            }
                            onMoveUp={fieldId =>
                              handleMoveFieldUp(section.id, row.id, fieldId)
                            }
                            onMoveDown={fieldId =>
                              handleMoveFieldDown(section.id, row.id, fieldId)
                            }
                            onFieldChange={updatedField =>
                              handleFieldChange(section.id, row.id, updatedField)
                            }
                          />
                        </Box>
                      ))}
                    <Tooltip title="Add Field" placement="bottom">
                      <IconButton
                        onClick={() => handleAddField(section.id, row.id)}
                        sx={{ alignSelf: "flex-start" }} // Position at the bottom
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {rowIndex > 0 && (
                      <Tooltip title="Move Row Up" placement="left">
                        <IconButton
                          onClick={() => handleMoveRowUp(section.id, row.id)}
                          size="small"
                        >
                          <KeyboardArrowUp />
                        </IconButton>
                      </Tooltip>
                    )}
                    {rowIndex < section.rows.length - 1 && (
                      <Tooltip title="Move Row Down" placement="left">
                        <IconButton
                          onClick={() => handleMoveRowDown(section.id, row.id)}
                          size="small"
                        >
                          <KeyboardArrowDown />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete Row" placement="left">
                      <IconButton
                        className="delete_btn"
                        onClick={() => handleDeleteRow(section.id, row.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
              <Tooltip title="Add Row" placement="bottom">
                <IconButton
                  onClick={() => handleAddRow(section.id)}
                  sx={{ marginTop: "0.5rem" }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Select a Field</DialogTitle>
        <DialogContent>
          <Box sx={{ width: 400, maxWidth: "100%" }}>
            {availableFields.map(field => (
              <ListItem key={field.key} disablePadding>
                <ListItemButton onClick={() => handleFieldSelection(field)}>
                  <ListItemIcon>
                    <field.icon />
                  </ListItemIcon>
                  <ListItemText primary={field.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FormContentArea;

const formContentContainerStyles: SxProps = {
  display: "flex",
  justifyContent: "center",
  width: "80%",
  height: "100vh",
  bgcolor: "#fff",
  margin: "0 auto",
};

const sectionContainerStyles: SxProps = {
  border: "1px solid #ccc",
  padding: "1rem",
  borderRadius: "4px",
  marginBottom: "1rem",
};

const rowContainerStyles: SxProps = {
  padding: "1rem",
  border: "2px solid #bbb",
  borderRadius: "4px",
  marginTop: "0.5rem",
};

const fieldContainerStyles: SxProps = {
  border: "1px solid transparent",
  borderRadius: "var(--border-radius)",
  position: "relative",
  transition: ".3s",
  padding: ".7rem 1rem",
  "&:hover": {
    borderColor: "rgba(43, 135, 251, 1)",
  },
  ".MuiIconButton-root": {
    bgcolor: "rgba(170, 170, 170, 1)",
    color: "#fff",
    height: "35px",
    padding: "8px",
    width: "35px",
  },
  ".MuiIconButton-root.delete_btn": {
    bgcolor: "rgba(229, 72, 77, 1)",
  },
};