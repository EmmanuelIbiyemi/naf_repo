import { Box, Button, SxProps, Typography } from "@mui/material";
import cursorIcon from "../../../../assets/cursor.svg";
import { FocusEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  useGetFormQuery,
  useUpdateFormMutation,
} from "../../../../store/api/form.api";
import { useParams } from "react-router-dom";
import FormBuilder from "../../../admin/application/components/FormBuilder";

const PostContentArea = () => {
  const { form_id } = useParams();
  const { data: form } = useGetFormQuery(+(form_id || 0));
  const [updateForm] = useUpdateFormMutation();

  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  const handleFormPropsChange = async (e: FocusEvent, type: string) => {
    if (form?.data) {
      let name = "";
      if (type == "name")
        name = `${form.data.name.split("::")[0]}::${
          e.currentTarget.textContent
        }`;
      else
        name = `${e.currentTarget.textContent}::${
          form.data.name.split("::")[1]
        }`;

      try {
        await updateForm({
          id: form.data.id,
          fee: form.data.fee,
          name,
          program_id: form.data.program_id,
          level_id: form.data.level_id,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box sx={formContentContainerStyles}>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            <span
              id="name"
              contentEditable="true"
              onBlur={(e) => handleFormPropsChange(e, "name")}
              dangerouslySetInnerHTML={{
                __html: form?.data.name.split("::")[0] as string,
              }}
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
            <span
              id="submitBtn"
              contentEditable="true"
              onBlur={(e) => handleFormPropsChange(e, "name")}
              dangerouslySetInnerHTML={{
                __html: form?.data.name.split("::")[1] as string,
              }}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PostContentArea;

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
