import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Select,
  SxProps,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import { ChangeEvent, FocusEvent, MouseEvent, useState } from "react";
import "./elements.scss";
import { FormField } from "../../../../types/forms";
import DeleteIcon from "../../../../assets/deleteIcon";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  useDeleteFormRowMutation,
  useGetFormFieldByKeyMMutation,
  useGetFormQuery,
  useUpdateFormFieldMutation,
} from "../../../../store/api/form.api";
import { useLocation } from "react-router-dom";

const getElementId = (id: string) => {
  const [, sectionId, rowId, elId] = id.split("-");
  return [sectionId, rowId, elId];
};
const getElementKey = (id: string) => {
  return id.substring(0, id.lastIndexOf("-"));
};

type Props = {
  allowDelete?: boolean;
  allowEdit?: boolean;
};

const FormBuilder = ({ allowDelete = true, allowEdit = true }: Props) => {
  const [deleteRow] = useDeleteFormRowMutation();
  const location = useLocation();
  const { data: form } = useGetFormQuery(location.state);
  const [updateField] = useUpdateFormFieldMutation();
  const [getFormFieldByKey] = useGetFormFieldByKeyMMutation();

  const handleInput = async (e: FocusEvent) => {
    const target = e.currentTarget;
    const elKey = getElementKey(target.id);

    try {
      const response = await getFormFieldByKey(elKey).unwrap();
      console.log(response);
      await updateField({
        ...response.data,
        placeholder: target.textContent as string,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLabelInput = async (e: FocusEvent) => {
    const target = e.currentTarget;
    const elKey = getElementKey(target.id);
    try {
      const response = await getFormFieldByKey(elKey).unwrap();
      console.log(response);
      await updateField({
        ...response.data,
        name: target.textContent as string,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenFileSelect = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    target.querySelector("input")?.click();
  };

  const handleSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    console.log(target.files);
  };

  const handleDelete = async (id: string) => {
    console.log(id);
    const [, rowId] = getElementId(id);
    try {
      await deleteRow(+rowId).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const [alignment, setAlignment] = useState<string | null>("left");
  const handleAlignment = (
    _: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };

  const displayEl = (elId: string, element: FormField) => {
    let el;

    switch (element.type) {
      case "heading":
        el = (
          <Typography
            variant="h5"
            id={elId}
            contentEditable={allowEdit}
            onBlur={handleInput}
            dangerouslySetInnerHTML={{
              __html: element.placeholder as string,
            }}
          />
        );
        break;
      case "paragraph":
        el = (
          <Typography
            id={elId}
            contentEditable={allowEdit}
            onBlur={handleInput}
            dangerouslySetInnerHTML={{
              __html: element.placeholder as string,
            }}
          />
        );
        break;
      case "images":
        el = (
          <Box>
            <label
              id={elId}
              contentEditable={allowEdit}
              onBlur={handleLabelInput}
              dangerouslySetInnerHTML={{
                __html: element.name as string,
              }}
            />
            <Box
              id={elId}
              className="image_el dashed_border"
              onClick={handleOpenFileSelect}
            >
              <CloudUploadOutlined /> Drag and drop your images here or browse
              <input type="file" hidden onChange={handleSelectImage} />
            </Box>
          </Box>
        );
        break;
      case "documents":
        el = (
          <Box>
            <label
              id={elId}
              contentEditable={allowEdit}
              onBlur={handleLabelInput}
              dangerouslySetInnerHTML={{
                __html: element.name as string,
              }}
            />
            <Box
              id={elId}
              className="image_el dashed_border"
              onClick={handleOpenFileSelect}
            >
              <CloudUploadOutlined /> Drag and drop your files here or browse
              <input type="file" hidden onChange={handleSelectImage} />
            </Box>
          </Box>
        );
        break;
      case "text-field":
        el = (
          <Box>
            <label
              id={elId}
              contentEditable={allowEdit}
              onBlur={handleLabelInput}
              dangerouslySetInnerHTML={{
                __html: element.name as string,
              }}
            />
            <input />
          </Box>
        );
        break;
      case "textarea":
        el = (
          <Box>
            <label
              id={elId}
              contentEditable={allowEdit}
              onBlur={handleLabelInput}
              dangerouslySetInnerHTML={{
                __html: element.name as string,
              }}
            />
            <textarea />
          </Box>
        );
        break;
      case "full-name":
        el = (
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="name">First Name</label>
              <input id="name" name="first_name" />
            </Box>
            <Box>
              <label htmlFor="last-name">Last Name</label>
              <input id="last-name" name="last_name" />
            </Box>
          </Box>
        );
        break;
      case "date-picker":
        el = (
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <label
                id={elId}
                contentEditable={allowEdit}
                onBlur={handleLabelInput}
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
              <DatePicker />
            </LocalizationProvider>
          </Box>
        );
        break;
      case "dropdown":
        el = (
          <FormControl fullWidth>
            <label
              id={elId}
              contentEditable={allowEdit}
              onBlur={handleLabelInput}
              dangerouslySetInnerHTML={{
                __html: element.name as string,
              }}
            />
            <Select
              sx={{
                padding: 0,
                ".MuiSelect-select": { p: "5px", minHeight: "25px" },
              }}
            >
              <MenuItem value={0}>select option</MenuItem>
            </Select>
          </FormControl>
        );
        break;
      case "multi-choice":
        el = (
          <FormControl>
            <label
              id={elId}
              contentEditable={allowEdit}
              onBlur={handleLabelInput}
              dangerouslySetInnerHTML={{
                __html: element.name as string,
              }}
            />
            <FormGroup
              sx={{ ".MuiFormControlLabel-root": { display: "flex" } }}
            >
              <FormControlLabel control={<Checkbox />} label="Option 1" />
              <FormControlLabel control={<Checkbox />} label="Option 2" />
              <FormControlLabel control={<Checkbox />} label="Option 3" />
            </FormGroup>
          </FormControl>
        );
        break;
      case "single-choice":
        el = (
          <Box>
            <label
              id={elId}
              contentEditable={allowEdit}
              onBlur={handleLabelInput}
              dangerouslySetInnerHTML={{
                __html: element.name as string,
              }}
            />
            <ToggleButtonGroup
              value={alignment}
              exclusive
              onChange={handleAlignment}
              aria-label="text alignment"
            >
              <ToggleButton value="left">Option 1</ToggleButton>
              <ToggleButton value="center">Option 2</ToggleButton>
              <ToggleButton value="right">Option 3</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        );
        break;
    }
    return (
      <Box key={`element-${element.id}`} className="element">
        {el}
        {allowDelete ? (
          <IconButton
            onClick={() => handleDelete(elId)}
            className="delete_btn"
            id={`element-${element.id}-delete`}
          >
            <DeleteIcon />
          </IconButton>
        ) : null}
      </Box>
    );
  };

  return (
    <Box sx={formBuilderStyles}>
      {form?.data.sections?.map((section) => {
        return section.rows?.map((row) => {
          return row?.fields?.map((el) => {
            const elId = `element-${section.id}-${row.id}-${el.id}`;
            return displayEl(elId, el);
          });
        });
      })}
    </Box>
  );
};

export default FormBuilder;

const formBuilderStyles: SxProps = {
  ".element": {
    border: "1px solid transparent",
    position: "relative",
    transition: ".3s",
    marginBottom: "1rem",
    "&:hover": {
      borderColor: "rgba(43, 135, 251, 1)",
      borderRadius: "var(--border-radius)",
    },
    "&:hover .delete_btn": {
      opacity: 1,
    },
    ">*": {
      padding: ".7rem 1rem",
    },
  },

  ".delete_btn": {
    bgcolor: "rgba(229, 72, 77, 1)",
    color: "#fff",
    opacity: 0,
    position: "absolute",
    right: "-75px",
    top: "50%",
    transform: "translateY(-50%)",
    transition: ".3s",
    padding: "8px",
  },
};
