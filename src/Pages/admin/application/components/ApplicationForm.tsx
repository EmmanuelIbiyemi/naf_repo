import { Box, Button, SxProps } from "@mui/material";
import { setPageName } from "../../../../store/app.slice";
import { useAppDispatch } from "../../../../store/hooks";
import ElementsSideBar from "./ElementsSideBar";
import FormContentArea from "./FormContentArea";
import PropertiesSideBar from "./PropertiesSideBar";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { BlockType } from "../../../../types/blocks";

const ApplicationFormPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Application Form"));

  const [elements, setElements] = useState<BlockType[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const loremIpsum =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

  const addElement = (type: string) => {
    setElements((prev) => [
      ...prev,
      {
        id: elements.length + 1,
        content: type == "paragraph" ? loremIpsum : "type something",
        type,
      },
    ]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    if (event.over && event.over.id === "droppable") {
      addElement(event.active.id as string);
    }
  };

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  return (
    <Box className="content-container" sx={pageStyles}>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <ElementsSideBar />
        <FormContentArea elements={elements} setElements={setElements} />

        {/* DragOverlay */}
        <DragOverlay>
          {activeId ? (
            <Button sx={{ cursor: "move" }}>{activeId}</Button>
          ) : null}
        </DragOverlay>
        <PropertiesSideBar />
      </DndContext>
    </Box>
  );
};

export default ApplicationFormPage;

const pageStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "300px 1fr 300px",
};
