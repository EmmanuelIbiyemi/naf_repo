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
import { Add, CloudUploadOutlined, Remove } from "@mui/icons-material";
import { FocusEvent } from "react";
import "../../../admin/application/components/elements.scss";
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
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../../../../store/hooks";
import { setBuilderLoading } from "../../../../store/app.slice";

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
  isPreview?: boolean;
};

const PostBuilder = ({
  allowDelete = true,
  allowEdit = true,
  isPreview = false,
}: Props) => {
  const dispatch = useAppDispatch();
  const [deleteRow] = useDeleteFormRowMutation();
  const { post_id } = useParams();
  const { data: form } = useGetFormQuery(+(post_id || 0));
  const [updateField] = useUpdateFormFieldMutation();
  const [getFormFieldByKey] = useGetFormFieldByKeyMMutation();

  const handleInput = async (e: FocusEvent) => {
    const target = e.currentTarget;
    const elKey = getElementKey(target.id);
    dispatch(setBuilderLoading(true));
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
    dispatch(setBuilderLoading(false));
  };

  const handleLabelInput = async (e: FocusEvent) => {
    const target = e.currentTarget;
    const elKey = getElementKey(target.id);
    dispatch(setBuilderLoading(true));
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
    dispatch(setBuilderLoading(false));
  };

  const handleAddRemoveChange = async (id: string, type: string) => {
    const elKey = getElementKey(id);
    dispatch(setBuilderLoading(true));

    try {
      const response = await getFormFieldByKey(elKey).unwrap();
      let newField: typeof response.data;
      if (type == "delete") {
        newField = {
          ...response.data,
          name: `${response.data.name.substring(
            0,
            response.data.name.lastIndexOf("::")
          )}`,
          placeholder: `${response.data.placeholder.substring(
            0,
            response.data.name.lastIndexOf("::")
          )}`,
        };
      } else {
        const optionsLength = response.data.name.split("::").length;
        newField = {
          ...response.data,
          name: `${response.data.name}::Option ${optionsLength}`,
          placeholder: `${response.data.placeholder}::Option ${optionsLength}`,
        };
      }

      await updateField(newField);
    } catch (error) {
      console.log(error);
    }
    dispatch(setBuilderLoading(false));
  };

  const handleOptionChange = async (
    e: FocusEvent,
    id: string,
    optionIndex: number
  ) => {
    const text = e.currentTarget.textContent;
    const elKey = getElementKey(id);
    dispatch(setBuilderLoading(true));

    try {
      const response = await getFormFieldByKey(elKey).unwrap();
      const names = response.data.name.split("::");
      const placeholders = response.data.placeholder.split("::");
      names[optionIndex] = `${text}`;
      placeholders[optionIndex] = `${text?.toLowerCase()}`;

      const newField = {
        ...response.data,
        name: names.join("::"),
        placeholder: placeholders.join("::"),
      };

      await updateField(newField);
    } catch (error) {
      console.log(error);
    }
    dispatch(setBuilderLoading(false));
  };

  const handleDelete = async (id: string) => {
    const [, rowId] = getElementId(id);
    dispatch(setBuilderLoading(true));
    try {
      await deleteRow(+rowId).unwrap();
    } catch (error) {
      console.log(error);
    }
    dispatch(setBuilderLoading(false));
  };

  const displayEl = (elId: string, element: FormField) => {
    let el;
    let name = "";
    let optionNames = [""];
    let optionValues = [""];

    if (["dropdown", "single-choice", "multi-choice"].includes(element.type)) {
      [name, ...optionNames] = element.name.split("::");
      [...optionValues] = element.placeholder.split("::");
    }

    switch (element.type) {
      case "heading":
        el = isPreview ? (
          <Typography
            variant="h5"
            dangerouslySetInnerHTML={{
              __html: element.placeholder as string,
            }}
          />
        ) : (
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
        el = isPreview ? (
          <Typography
            dangerouslySetInnerHTML={{
              __html: element.placeholder as string,
            }}
          />
        ) : (
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
            {isPreview ? (
              <label
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
            ) : (
              <label
                id={elId}
                contentEditable={allowEdit}
                onBlur={handleLabelInput}
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
            )}
            <Box id={elId} className="image_el dashed_border">
              <CloudUploadOutlined /> Drag and drop your images here or browse
            </Box>
          </Box>
        );
        break;
      case "documents":
        el = (
          <Box>
            {isPreview ? (
              <label
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
            ) : (
              <label
                id={elId}
                contentEditable={allowEdit}
                onBlur={handleLabelInput}
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
            )}
            <Box id={elId} className="image_el dashed_border">
              <CloudUploadOutlined /> Drag and drop your files here or browse
            </Box>
          </Box>
        );
        break;
      case "text-field":
        el = (
          <Box>
            {isPreview ? (
              <label
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
            ) : (
              <label
                id={elId}
                contentEditable={allowEdit}
                onBlur={handleLabelInput}
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
            )}
            <input />
          </Box>
        );
        break;
      case "textarea":
        el = (
          <Box>
            {isPreview ? (
              <label
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
            ) : (
              <label
                id={elId}
                contentEditable={allowEdit}
                onBlur={handleLabelInput}
                dangerouslySetInnerHTML={{
                  __html: element.name as string,
                }}
              />
            )}
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
              {isPreview ? (
                <label
                  dangerouslySetInnerHTML={{
                    __html: element.name as string,
                  }}
                />
              ) : (
                <label
                  id={elId}
                  contentEditable={allowEdit}
                  onBlur={handleLabelInput}
                  dangerouslySetInnerHTML={{
                    __html: element.name as string,
                  }}
                />
              )}
              <DatePicker />
            </LocalizationProvider>
          </Box>
        );
        break;
      case "dropdown":
        el = (
          <Box>
            {isPreview ? (
              <label
                dangerouslySetInnerHTML={{
                  __html: name,
                }}
              />
            ) : (
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <label
                  id={elId}
                  contentEditable={allowEdit}
                  onBlur={handleLabelInput}
                  dangerouslySetInnerHTML={{
                    __html: name as string,
                  }}
                />
                <IconButton
                  sx={{ padding: "5px" }}
                  onClick={() => handleAddRemoveChange(elId, "add")}
                >
                  <Add />
                </IconButton>
              </Box>
            )}
            {!isPreview ? (
              <Box>
                {optionNames?.map((opt, i) => (
                  <Typography
                    key={`${name}-${opt}`}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span
                      contentEditable={allowEdit}
                      onBlur={(e) => handleOptionChange(e, elId, i + 1)}
                      dangerouslySetInnerHTML={{
                        __html: opt.toLowerCase(),
                      }}
                      onClick={(e) => e.stopPropagation()}
                    ></span>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddRemoveChange(elId, "delete");
                      }}
                    >
                      <Remove />
                    </IconButton>
                  </Typography>
                ))}
              </Box>
            ) : (
              <FormControl fullWidth>
                <Select
                  value={0}
                  sx={{
                    padding: 0,
                    ".MuiSelect-select": { p: "5px", minHeight: "25px" },
                  }}
                >
                  <MenuItem value={0}>select {name?.toLowerCase()}</MenuItem>
                  {optionNames?.map((opt, i) => (
                    <MenuItem
                      value={optionValues[i]}
                      key={`${name}-${opt}`}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span>{opt.toLowerCase()}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        );
        break;
      case "multi-choice":
        el = (
          <Box>
            {isPreview ? (
              <>
                <label
                  dangerouslySetInnerHTML={{
                    __html: name,
                  }}
                />
                <FormControl>
                  <FormGroup
                    sx={{ ".MuiFormControlLabel-root": { display: "flex" } }}
                  >
                    {optionNames.map((opt, i) => (
                      <FormControlLabel
                        key={opt}
                        control={<Checkbox />}
                        value={optionValues[i]}
                        label={opt}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <label
                    id={elId}
                    contentEditable={allowEdit}
                    onBlur={handleLabelInput}
                    dangerouslySetInnerHTML={{
                      __html: name as string,
                    }}
                  />
                  <IconButton
                    sx={{ padding: "5px" }}
                    onClick={() => handleAddRemoveChange(elId, "add")}
                  >
                    <Add />
                  </IconButton>
                </Box>

                <Box>
                  {optionNames?.map((opt, i) => (
                    <Typography
                      key={`${name}-${opt}`}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span
                        contentEditable={allowEdit}
                        onBlur={(e) => handleOptionChange(e, elId, i + 1)}
                        dangerouslySetInnerHTML={{
                          __html: opt.toLowerCase(),
                        }}
                        onClick={(e) => e.stopPropagation()}
                      ></span>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddRemoveChange(elId, "delete");
                        }}
                      >
                        <Remove />
                      </IconButton>
                    </Typography>
                  ))}
                </Box>
              </>
            )}
          </Box>
        );
        break;
      case "single-choice":
        el = (
          <Box>
            {isPreview ? (
              <>
                <label
                  dangerouslySetInnerHTML={{
                    __html: name,
                  }}
                />
                <FormControl>
                  <ToggleButtonGroup exclusive>
                    {optionNames.map((opt, i) => (
                      <ToggleButton
                        value={optionValues[i]}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {opt}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </FormControl>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <label
                    id={elId}
                    contentEditable={allowEdit}
                    onBlur={handleLabelInput}
                    dangerouslySetInnerHTML={{
                      __html: name as string,
                    }}
                  />
                  <IconButton
                    sx={{ padding: "5px" }}
                    onClick={() => handleAddRemoveChange(elId, "add")}
                  >
                    <Add />
                  </IconButton>
                </Box>

                <Box>
                  {optionNames?.map((opt, i) => (
                    <Typography
                      key={`${name}-${opt}`}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span
                        contentEditable={allowEdit}
                        onBlur={(e) => handleOptionChange(e, elId, i + 1)}
                        dangerouslySetInnerHTML={{
                          __html: opt.toLowerCase(),
                        }}
                        onClick={(e) => e.stopPropagation()}
                      ></span>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddRemoveChange(elId, "delete");
                        }}
                      >
                        <Remove />
                      </IconButton>
                    </Typography>
                  ))}
                </Box>
              </>
            )}
          </Box>
        );
        break;
    }
    return (
      <Box
        key={`element-${element.id}`}
        className="element"
        sx={
          isPreview
            ? {
                "&:hover": { borderColor: "transparent !important" },
                ">.MuiBox-root, .MuiTypography-root": { padding: 0 },
              }
            : {}
        }
      >
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

export default PostBuilder;

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
    ">*": {
      padding: ".7rem 1rem",
    },
  },

  ".delete_btn": {
    bgcolor: "rgba(229, 72, 77, 1)",
    color: "#fff",
    position: "absolute",
    right: "-75px",
    top: "50%",
    transform: "translateY(-50%)",
    transition: ".3s",
    padding: "8px",
  },
};
