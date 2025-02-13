import {
  Box,
  Button,
  FormControl,
  SxProps,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { ChangeEvent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUpdateFormMutation } from "../../../../store/api/form.api";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageLoading } from "../../../../store/app.slice";

interface FormProps {
  formData: {
    name: string;
    fee: number;
    sections: any[];
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    fee: number;
    sections: any[];
  }>>;
}

const PropertiesSideBar = ({ formData, setFormData }: FormProps) => {
  const { form_id } = useParams();
  const [updateForm] = useUpdateFormMutation();
  const dispatch = useAppDispatch();
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveForm = async () => {
    dispatch(setPageLoading(true));
    try {
      // Prepare the request body in the desired format
      const requestBody = {
        id: form_id, // Assuming form_id is the ID
        name: formData.name,
        fee: formData.fee,
        sections: formData.sections.map((section: any) => ({
          name: section.name,
          rows: section.rows.map((row: any) => ({
            row: row.fields.map((field: any) => ({
              key: field.id, // Use field.id as the key
              name: field.name,
              placeholder: field.placeholder,
              type: field.type,
            })),
          })),
        })),
      };

      await updateForm(requestBody).unwrap();
      setSaveStatus("success");
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
    }
    dispatch(setPageLoading(false));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // Prevent browser save
        handleSaveForm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSaveForm]);

  return (
    <Box sx={propertiesSidebarStyles}>
      <Box>
        <Typography variant="h5">Form Properties</Typography>
        <Box>
          <Typography sx={{ marginBlock: "1.5rem .5rem" }}>Title</Typography>
          <Box sx={{ ...groupStyles, gap: "1rem" }}>
            <FormControl fullWidth>
              <TextField
                placeholder={"enter name..."}
                value={formData?.name}
                name="name"
                onChange={handleChange}
              />
            </FormControl>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ marginBlock: "1.5rem .5rem" }}>Fee</Typography>
          <Box sx={{ ...groupStyles, gap: "1rem" }}>
            <FormControl fullWidth>
              <TextField
                type="number"
                value={formData?.fee}
                name="fee"
                onChange={handleChange}
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "1rem",
          }}
        >
          <Button variant="contained" onClick={() => handleSaveForm()}>
            Save
          </Button>
        </Box>
        {saveStatus === "success" && (
          <Alert severity="success">Form saved successfully!</Alert>
        )}
        {saveStatus === "error" && (
          <Alert severity="error">Failed to save form.</Alert>
        )}
      </Box>
    </Box>
  );
};

export default PropertiesSideBar;

const propertiesSidebarStyles: SxProps = {
  alignContent: "space-between",
  borderLeft: "1px solid rgba(229, 229, 229, 1)",
  bgcolor: "rgba(249, 250, 251, 1)",
  display: "grid",
  height: "100vh",
  overflow: "auto",
  padding: "1rem var(--padding)",
  position: "sticky",
  top: 0,
  "&::-webkit-scrollbar": {
    display: "none",
  },
};

const groupStyles: SxProps = {
  button: {
    bgcolor: "#fff",
    color: "inherit",
    height: "35px",
    minWidth: 0,
    padding: 0,
    width: "45px",
  },
  ".MuiOutlinedInput-root input": {
    bgcolor: "#fff",
    paddingBlock: "8px",
  },
};
