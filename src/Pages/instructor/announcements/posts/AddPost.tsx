import { Box, Button, SxProps } from "@mui/material";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import { selectCurrentAnnouncement } from "../../../../store/announcement.slice";
import { PostType } from "../../../../types/posts";
import ElementsSideBar from "../../../admin/application/components/ElementsSideBar";
import PropertiesSideBar from "./PropertiesSideBar";
import PostContentArea from "./PostContentArea";
// import PostContentArea from "../../../admin/application copy/components/PostContentArea";
const AddPostPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector(selectCurrentAnnouncement);
  useEffect(() => {
    dispatch(setPageName("Posts"));
  }, [dispatch]);

  // Use global post
  const [post, setForm] = useState<PostType>({
    id: selectedPost?.id || 1,
    elements: selectedPost?.elements || [],
    title: selectedPost?.title || "Untitled Post",
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
        <PostContentArea post={post} setPost={setForm} />

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
