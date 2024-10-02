import { Box, Button, SxProps, Typography } from "@mui/material";
import cursorIcon from "../../../../assets/cursor.svg";
import { FocusEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import FormBuilder from "./FormBuilder";
import { FormType } from "../../../../types/forms";

type Props = {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<FormType>>;
};

const FormContentArea = ({ form, setForm }: Props) => {
  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  const handleFormPropsChange = (e: FocusEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    if (target && target.id) {
      setForm((prev) => ({
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
              id="title"
              contentEditable="true"
              onBlur={handleFormPropsChange}
              dangerouslySetInnerHTML={{ __html: form.title }}
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
          {form.elements.length ? (
            <Box sx={{ padding: "1.5rem" }}>
              <FormBuilder form={form} setForm={setForm} />
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
        <Box>
          <Button
            variant="contained"
            sx={{
              display: "block",
              margin: "1rem auto",
            }}
          >
            <span
              id="submitBtn"
              contentEditable="true"
              onBlur={handleFormPropsChange}
              dangerouslySetInnerHTML={{ __html: form.submitBtn }}
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
  gridTemplateRows: "80px 1fr 80px",
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
