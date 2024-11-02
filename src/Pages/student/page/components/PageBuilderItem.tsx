import { useDraggable } from "@dnd-kit/core";
import { Button } from "@mui/material";
import { PropsWithChildren } from "react";

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

export default Draggable;
