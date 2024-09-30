import { Box, IconButton, SxProps, Typography } from "@mui/material";
import { BlockType } from "../../../types/blocks";
import { Delete } from "@mui/icons-material";
import { FocusEvent } from "react";

type Props = {
  elements: BlockType[];
  setElements: React.Dispatch<React.SetStateAction<BlockType[]>>;
};
const FormBuilder = ({ elements, setElements }: Props) => {
  const handleInput = (e: FocusEvent) => {
    const target = e.currentTarget;
    if (target && target.id) {
      setElements((prev) => {
        const foundEl = prev.find((el) => `element-${el.id}` == target.id);
        if (foundEl?.content)
          foundEl.content = target.textContent?.trim() || foundEl.content;
        return [...prev];
      });
    }
  };

  const displayEl = (element: BlockType) => {
    let el;
    switch (element.type) {
      case "heading":
        el = (
          <Typography
            variant="h5"
            id={`element-${element.id}`}
            contentEditable="true"
            onBlur={handleInput}
            dangerouslySetInnerHTML={{
              __html: elements.find((el) => el.id == element.id)
                ?.content as string,
            }}
          />
        );
        break;
      case "paragraph":
        el = (
          <Typography
            id={`element-${element.id}`}
            contentEditable="true"
            onBlur={handleInput}
            dangerouslySetInnerHTML={{
              __html: elements.find((el) => el.id == element.id)
                ?.content as string,
            }}
          />
        );
        break;
    }

    return (
      <Box key={`element-${element.id}`} className="element">
        {el}
        <IconButton
          onClick={() => handleDelete(element.id)}
          className="delete_btn"
          id={`element-${element.id}-delete`}
        >
          <Delete />
        </IconButton>
      </Box>
    );
  };

  const handleDelete = (id: number) => {
    console.log(id);
    setElements((prev) => prev.filter((el) => el.id != id));
  };

  return (
    <Box sx={formBuilderStyles}>{elements.map((el) => displayEl(el))}</Box>
  );
};

export default FormBuilder;

const formBuilderStyles: SxProps = {
  ".element": {
    border: "1px solid transparent",
    marginBottom: ".6rem",
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
      paddingInline: ".6rem",
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
    paddingInline: "8px",
  },
};
