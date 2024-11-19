import { Box, Button, SxProps, Typography } from "@mui/material";
import cursorIcon from "../../../../assets/cursor.svg";
import { useDroppable } from "@dnd-kit/core";
import FormBuilder from "./FormBuilder";
import { useGetFormQuery } from "../../../../store/api/form.api";
import { useParams } from "react-router-dom";

const FormContentArea = () => {
  const { form_id } = useParams();
  const { data: form } = useGetFormQuery(+(form_id || 0));

  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  return (
    <Box sx={formContentContainerStyles}>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            {form?.data.name.split("::")[0]}
          </Typography>
        </Box>
        <Box
          ref={setNodeRef}
          sx={{
            borderBlock: "1px solid rgba(204, 204, 204, 0.4)",
            position: "relative",
          }}
        >
          {form?.data.sections[0].rows.length ? (
            <Box sx={{ padding: "1.5rem" }}>
              <FormBuilder />
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
            {form?.data.name.split("::")[1]}
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
  maxWidth: "800px",
  marginInline: "auto",
  width: "100%",
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
