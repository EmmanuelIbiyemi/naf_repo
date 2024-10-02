import { Box, Button, SxProps } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ElementsSideBar from "./components/ElementsSideBar";
import FormContentArea from "./components/FormContentArea";
import PropertiesSideBar from "./components/PropertiesSideBar";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";
import { FormType } from "../../../types/forms";
import dayjs from "dayjs";
import { selectCurrentForm } from "../../../store/forms.slice";

const ApplicationFormPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Application Form"));

  // Use global form
  const selectedForm = useAppSelector(selectCurrentForm);
  const [form, setForm] = useState<FormType>({
    id: selectedForm?.id || 1,
    elements: selectedForm?.elements || [],
    submitBtn: selectedForm?.submitBtn || "Submit",
    title: selectedForm?.title || "Untitled Form",
    last_edited: selectedForm?.last_edited || dayjs().format("DD-MM-YYYY"),
    submissions: selectedForm?.submissions || 0,
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
        <FormContentArea form={form} setForm={setForm} />

        {/* DragOverlay */}
        <DragOverlay>
          {activeId ? (
            <Button sx={{ cursor: "move" }}>{activeId}</Button>
          ) : null}
        </DragOverlay>
        <Box>
          <PropertiesSideBar form={form} />
        </Box>
      </DndContext>
    </Box>
  );
};

export default ApplicationFormPage;

const pageStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "300px 1fr 300px",
};
