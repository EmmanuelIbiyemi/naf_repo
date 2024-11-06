import { Box, Button, SxProps } from "@mui/material";
import { setBuilderLoading, setPageName } from "../../../store/app.slice";
import { useAppDispatch } from "../../../store/hooks";
import ElementsSideBar from "./components/ElementsSideBar";
import FormContentArea from "./components/FormContentArea";
import PropertiesSideBar from "./components/PropertiesSideBar";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import {
  useAddFormFieldMutation,
  useAddFormRowMutation,
  useGetFormQuery,
} from "../../../store/api/form.api";
import { formElements } from "./elements";
import { useParams } from "react-router-dom";

const AddFormPage = () => {
  // set page name
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageName("Application Form"));
  }, []);

  // Use global form
  const { form_id } = useParams();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addRow] = useAddFormRowMutation();
  const [addField] = useAddFormFieldMutation();
  const { data: form } = useGetFormQuery(+(form_id || 0));

  const addElement = async (type: string) => {
    const element = formElements.find((el) => el.key == type);
    dispatch(setBuilderLoading(true));
    if (element) {
      try {
        if (form?.data) {
          const row = await addRow({
            formsection_id: form?.data.sections[form?.data.sections.length - 1]
              .id as number,
          }).unwrap();

          const names = element.options
            ? element.name + "::" + element.options?.join("::")
            : element.name;

          await addField({
            formrow_id: row?.data.id as number,
            key: element.key,
            name: names,
            placeholder: ["dropdown", "single-choice", "multi-choice"].includes(
              element.type
            )
              ? element.options?.join("::") || ""
              : "Type something",
            type: element.type,
          }).unwrap();
        }
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(setBuilderLoading(false));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    if (event.over && event.over.id === "droppable") {
      addElement(event.active.id as string);
    }
  };

  const handleDragStart = (event: DragEndEvent) => {
    console.log(event.active.id);
    setActiveId(event.active.id as string);
  };

  return (
    <Box className="content-container" sx={pageStyles}>
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Box>
          <ElementsSideBar />
        </Box>
        <FormContentArea />

        {/* DragOverlay */}
        <DragOverlay>
          {activeId ? (
            <Button sx={{ cursor: "move" }}>{activeId}</Button>
          ) : null}
        </DragOverlay>
        <Box>
          <PropertiesSideBar />
        </Box>
      </DndContext>
    </Box>
  );
};

export default AddFormPage;

const pageStyles: SxProps = {
  display: "grid",
  gridTemplateColumns: "300px 1fr 300px",
};
