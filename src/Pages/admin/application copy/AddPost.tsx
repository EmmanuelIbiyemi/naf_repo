import { Box, Button, SxProps } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ElementsSideBar from "./components/ElementsSideBar";
import FormContentArea from "./components/PostContentArea";
import PropertiesSideBar from "./components/PropertiesSideBar";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { PostType } from "../../../types/posts";
import { selectCurrentForm } from "../../../store/forms.slice";

const AddPostPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Posts"));

  // Use global post
  const selectedForm = useAppSelector(selectCurrentForm);
  const [post, setForm] = useState<PostType>({
    id: selectedForm?.id || 1,
    elements: selectedForm?.elements || [],
    title: selectedForm?.title || "Untitled Post",
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const loremIpsum =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

  const addElement = (type: string) => {
    setForm((prev) => {
      const els = [...prev.elements];
      els.push({
        id: prev.elements.length + 1,
        content: type == "paragraph" ? loremIpsum : "Type something",
        type,
      });
      return { ...prev, elements: els };
    });
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
        <Box>
          <ElementsSideBar />
        </Box>
        <FormContentArea post={post} setPost={setForm} />

        {/* DragOverlay */}
        <DragOverlay>
          {activeId ? (
            <Button sx={{ cursor: "move" }}>{activeId}</Button>
          ) : null}
        </DragOverlay>
        <Box>
          <PropertiesSideBar post={post} />
        </Box>
      </DndContext>
    </Box>
  );
};

export default AddPostPage;

const pageStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "300px 1fr 300px",
};
