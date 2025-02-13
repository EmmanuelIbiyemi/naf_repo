import { Box, Button, SxProps, Typography } from "@mui/material";
import { formElements } from "../elements";
import { useDraggable } from "@dnd-kit/core";
import { PropsWithChildren } from "react";

const ElementsSideBar = () => {
  return (
    <Box sx={elementSidebarStyles}>
      <Typography variant="h5">Form Elements</Typography>
      <Box sx={elementContainerStyles}>
        {formElements.map((el, i) => (
          <Draggable key={`${el.type}-${i}`} id={el.key}>
            <el.icon /> <span>{el.name}</span>
          </Draggable>
        ))}
      </Box>
    </Box>
  );
};

const Draggable = ({ id, children }: PropsWithChildren<{ id: string }>) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
  });

  return (
    <Button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{ cursor: "move" }}
    >
      {children}
    </Button>
  );
};

export default ElementsSideBar;

const elementSidebarStyles: SxProps = {
  borderRight: "1px solid rgba(229, 229, 229, 1)",
  bgcolor: "rgba(249, 250, 251, 1)",
  overflow: "auto",
  height: "100vh",
  padding: "1rem var(--padding)",
  position: "sticky",
  top: "0",

  "&::-webkit-scrollbar": {
    display: "none",
  },
};

const elementContainerStyles: SxProps = {
  marginTop: "2rem",
  button: {
    border: "none",
    borderRadius: 0,
    borderBottom: "1px solid rgba(204, 204, 204, 0.4)",
    color: "inherit",
    display: "flex",
    gap: "1.3rem",
    justifyContent: "start",
    padding: "1rem .7rem",
    width: "100%",
  },
};
