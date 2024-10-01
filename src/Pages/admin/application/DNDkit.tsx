import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { Button, Typography } from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";

type Element = {
  id: number;
  type: string;
  content: string;
};

export function DNDkit() {
  const [elements, setElements] = useState<Element[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const displayEl = (element: Element) => {
    switch (element.type) {
      case "text":
        return (
          <Typography key={`element-${element.id}`}>
            {element?.content}
          </Typography>
        );
    }
  };

  const addElement = (type: string) => {
    setElements((prev) => [
      ...prev,
      { id: elements.length + 1, content: "type something", type },
    ]);
  };

  function handleDragEnd(event: DragEndEvent) {
    console.log(event.active);
    setActiveId(null); // Reset active draggable item
    if (event.over && event.over.id === "droppable") {
      addElement(event.active.id as string);
    }
  }

  function handleDragStart(event: DragEndEvent) {
    setActiveId(event.active.id as string); // Set active draggable item
  }
  useEffect(() => {
    console.log(elements);
    console.log(elements.map((el) => displayEl(el)));
  }, [elements]);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Draggable id="text">Drag me</Draggable>

      <Droppable>
        {elements.length ? elements.map((el) => displayEl(el)) : "Drop here"}
      </Droppable>

      {/* DragOverlay */}
      <DragOverlay>
        {activeId ? <Button>Drag me (Overlay)</Button> : null}
      </DragOverlay>
    </DndContext>
  );
}

function Droppable(props: PropsWithChildren) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
    border: "1px dashed",
    height: "200px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

function Draggable({ id, children }: PropsWithChildren<{ id: string }>) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: id,
  });

  return (
    <button ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </button>
  );
}
