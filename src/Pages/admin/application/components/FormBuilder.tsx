import { Box, IconButton, SxProps, Typography } from "@mui/material";
import { BlockType } from "../../../../types/blocks";
import { CloudUploadOutlined } from "@mui/icons-material";
import { ChangeEvent, FocusEvent, MouseEvent } from "react";
import "./elements.scss";
import { FormType } from "../../../../types/forms";
import DeleteIcon from "../../../../assets/deleteIcon";

type Props = {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
  allowDelete?: boolean;
};

const FormBuilder = ({ form, setForm, allowDelete = true }: Props) => {
  const handleInput = (e: FocusEvent) => {
    const target = e.currentTarget;
    if (target && target.id) {
      setForm((prev) => {
        const updatedElements = prev.elements.map((el) =>
          `element-${el.id}` === target.id
            ? { ...el, content: target.textContent?.trim() || el.content }
            : el
        );
        return { ...prev, elements: updatedElements };
      });
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

  const displayEl = (element: BlockType) => {
    let el;
    switch (element.type) {
      case "heading":
        el = (
          <Typography
            variant="h5"
            id={`element-${element.id}`}
            contentEditable={allowDelete ? "true" : "false"}
            onBlur={handleInput}
            dangerouslySetInnerHTML={{
              __html: form.elements.find((el) => el.id == element.id)
                ?.content as string,
            }}
          />
        );
        break;
      case "paragraph":
        el = (
          <Typography
            id={`element-${element.id}`}
            contentEditable={allowDelete ? "true" : "false"}
            onBlur={handleInput}
            dangerouslySetInnerHTML={{
              __html: form.elements.find((el) => el.id == element.id)
                ?.content as string,
            }}
          />
        );
        break;
      case "images":
        el = (
          <Box
            id={`element-${element.id}`}
            className="image_el dashed_border"
            onClick={handleOpenFileSelect}
          >
            <CloudUploadOutlined /> Drag and drop your image here or browse
            <input type="file" hidden onChange={handleSelectImage} />
          </Box>
        );
        break;
    }

    return (
      <Box key={`element-${element.id}`} className="element">
        {el}
        {allowDelete ? (
          <IconButton
            onClick={() => handleDelete(element.id)}
            className="delete_btn"
            id={`element-${element.id}-delete`}
          >
            <DeleteIcon />
          </IconButton>
        ) : null}
      </Box>
    );
  };

  const handleDelete = (id: number) => {
    console.log(id);
    setForm((prev) => {
      prev.elements = prev.elements.filter((el) => el.id != id);
      return { ...prev };
    });
  };

  return (
    <Box sx={formBuilderStyles}>
      {form.elements?.map((el) => displayEl(el))}
    </Box>
  );
};

export default FormBuilder;

const formBuilderStyles: SxProps = {
  ".element": {
    border: "1px solid transparent",
    position: "relative",
    transition: ".3s",
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
