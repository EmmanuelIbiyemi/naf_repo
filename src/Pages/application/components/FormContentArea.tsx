import { Box, Button, SxProps, Typography } from "@mui/material";
import cursorIcon from "../../../assets/cursor.svg";
import { FocusEvent, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { BlockType } from "../../../types/blocks";
import FormBuilder from "./FormBuilder";

type Props = {
  elements: BlockType[];
  setElements: React.Dispatch<React.SetStateAction<BlockType[]>>;
};

const FormContentArea = ({ elements, setElements }: Props) => {
  const [props, setProps] = useState({
    formName: "Untitled Form",
    submitBtn: "Submit Form",
  });
  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  const handleFormPropsChange = (e: FocusEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    if (target && target.id) {
      setProps((prev) => ({
        ...prev,
        [target.id]: target.textContent?.trim() || "",
      }));
    }
  };

  return (
    <Box sx={formContentContainerStyles}>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            <span
              id="formName"
              contentEditable="true"
              onBlur={handleFormPropsChange}
              dangerouslySetInnerHTML={{ __html: props.formName }}
            />
          </Typography>
        </Box>
        <Box
          ref={setNodeRef}
          sx={{
            borderBlock: "1px solid rgba(204, 204, 204, 0.4)",
            position: "relative",
          }}
        >
          {elements.length ? (
            <Box sx={{ padding: "1.5rem" }}>
              <FormBuilder elements={elements} setElements={setElements} />
            </Box>
          ) : (
            <Box sx={emptyDropAreaStyles}>
              <Box className="dashed_border" sx={{ textAlign: "center" }}>
                <img src={cursorIcon} alt="" />
                <Box>
                  <Typography>
                    Drag your first element here from the left
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="contained">
            <span
              id="submitBtn"
              contentEditable="true"
              onBlur={handleFormPropsChange}
              dangerouslySetInnerHTML={{ __html: props.submitBtn }}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FormContentArea;

const formContentContainerStyles: SxProps = {
  display: "grid",
  padding: "2rem",
  placeItems: "center",
};

const dropContainerStyles: SxProps = {
  bgcolor: "#fff",
  display: "grid",
  gridTemplateRows: "15% 1fr 15%",
  height: "80%",
  minHeight: "400px",
  width: "80%",
};

const emptyDropAreaStyles: SxProps = {
  display: "grid",
  paddingInline: "3rem",
  placeItems: "center",
  height: "50vh",

  ">div": {
    bgcolor: "rgba(204, 204, 204, 0.3)",
    borderRadius: "var(--border-radius)",
    padding: "2rem",
  },
};
