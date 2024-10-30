import { Box, Button, SxProps, Typography } from "@mui/material";
import headingIcon from "../../../assets/heading.svg";
import paragraphIcon from "../../../assets/paragraph2.svg";
import ImageIcon from "../../../assets/image.svg";
import videoIcon from "../../../assets/video.svg";
import buttonIcon from "../../../assets/button.svg";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import { PageType } from "../../../types/pages";
import { useState } from "react";
import PageBuilder from "./components/PageBuilder";
import Draggable from "./components/PageBuilderItem";

const elements = [
  { id: 1, name: "Heading", type: "heading", icon: headingIcon },
  { id: 2, name: "Paragraph", type: "paragraph", icon: paragraphIcon },
  { id: 3, name: "Image", type: "image", icon: ImageIcon },
  { id: 4, name: "Video", type: "video", icon: videoIcon },
  { id: 4, name: "Button", type: "button", icon: buttonIcon },
];

const Page = () => {
  //   const { name } = useParams();
  //   console.log(name);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { setNodeRef } = useDroppable({
    id: "page-droppable",
  });
  const [page, setPage] = useState<PageType>({
    id: 1,
    elements: [],
    title: "about",
  });

  const loremIpsum =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

  const addElement = (type: string) => {
    setPage((prev) => {
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
    if (event.over && event.over.id === "page-droppable") {
      console.log(event.active.id);
      addElement(event.active.id as string);
    }
  };

  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  return (
    <Box sx={contentStyles}>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Box>
          <Box sx={headerStyles}>
            <Button onClick={() => {}}>Back</Button>
            <Button variant="contained" onClick={() => {}}>
              Save Changes
            </Button>
          </Box>
          <Box ref={setNodeRef} sx={{ bgcolor: "#fff", minHeight: "100%" }}>
            <PageBuilder page={page} setPage={setPage} />
          </Box>
        </Box>
        <Box sx={sidebarContentStyles}>
          <Typography variant="h6">Blocks</Typography>
          <Box sx={elementSideBar}>
            {elements.map((el) => (
              <Draggable key={el.type} id={el.type}>
                <img src={el.icon} alt="" height={40} />
                <span>{el.name}</span>
              </Draggable>
            ))}
          </Box>
          {/* DragOverlay */}
          <DragOverlay>
            {activeId ? (
              <Button sx={{ cursor: "move" }}>{activeId}</Button>
            ) : null}
          </DragOverlay>
        </Box>
      </DndContext>
    </Box>
  );
};

export default Page;

const contentStyles: SxProps = {
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "1fr 245px",
  paddingInline: "2rem 0rem",
  height: "100%",
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem",
};

const sidebarContentStyles: SxProps = {
  bgcolor: "#fff",
  borderLeft: "1px solid rgba(204, 204, 204, 0.5)",
  padding: "1rem",
  position: "sticky",
  top: 0,
  height: "100%",
};

const elementSideBar: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "1fr 1fr",
  gridAutoRows: "100px",
  height: "100%",
  marginTop: "2rem",

  button: {
    bgcolor: "rgba(245, 245, 245, 1)",
    color: "inherit",
    cursor: "move",
    display: "grid",
    placeContent: "center",
    placeItems: "center",
  },
};
