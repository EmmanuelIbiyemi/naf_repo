import { Box, IconButton, SxProps, Typography } from "@mui/material";
import { BlockType } from "../../../../types/blocks";
import { CloudUploadOutlined } from "@mui/icons-material";
import { ChangeEvent, FocusEvent, MouseEvent } from "react";
// import "./blocks.scss";
import DeleteIcon from "../../../../assets/deleteIcon";
import { PageType } from "../../../../types/pages";

type Props = {
  page: PageType;
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
};

const PageBuilder = ({ page, setPage }: Props) => {
  const handleInput = (e: FocusEvent) => {
    const target = e.currentTarget;
    if (target && target.id) {
      setPage((prev) => {
        const updatedElements = prev.blocks.map((el) =>
          `element-${el.id}` === target.id
            ? { ...el, content: target.textContent?.trim() || el.content }
            : el
        );
        return { ...prev, blocks: updatedElements };
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
            contentEditable={"true"}
            onBlur={handleInput}
          >
            {page.blocks.find((el) => el.id == element.id)?.content}
          </Typography>
        );
        break;
      case "paragraph":
        el = (
          <Typography
            id={`element-${element.id}`}
            contentEditable={"true"}
            onBlur={handleInput}
          >
            {page.blocks.find((el) => el.id == element.id)?.content}
          </Typography>
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
        <IconButton
          onClick={() => handleDelete(element.id)}
          className="delete_btn"
          id={`element-${element.id}-delete`}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    );
  };

  const handleDelete = (id: number) => {
    console.log(id);
    setPage((prev) => {
      prev.blocks = prev.blocks.filter((el) => el.id != id);
      return { ...prev };
    });
  };

  return (
    <Box sx={formBuilderStyles}>{page.blocks?.map((el) => displayEl(el))}</Box>
  );
};

export default PageBuilder;

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
