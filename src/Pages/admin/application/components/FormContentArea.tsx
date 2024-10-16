import { Box, Button, SxProps, Typography } from "@mui/material";
import cursorIcon from "../../../../assets/cursor.svg";
import { FocusEvent, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import FormBuilder from "./FormBuilder";
import {
  useGetFormQuery,
  useUpdateFormMutation,
} from "../../../../store/api/form.api";
import { useLocation, useNavigate } from "react-router-dom";

const FormContentArea = () => {
  const location = useLocation();
  const { data: form } = useGetFormQuery(location.state);

  const [updateForm] = useUpdateFormMutation();
  const navigate = useNavigate();

  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  const handleSubmitBtnChange = async (e: FocusEvent) => {
    if (
      form?.data &&
      form.data.name.split("::")[1] != e.currentTarget.textContent
    )
      try {
        await updateForm({
          ...form?.data,
          name: `${form.data.name}::${e.currentTarget.textContent}`,
        });
      } catch (error) {
        console.log(error);
      }
  };

  const handleFormNameChange = async (e: FocusEvent<HTMLSpanElement>) => {
    if (
      form?.data &&
      form.data.name.split("::")[0] != e.currentTarget.textContent
    ) {
      try {
        await updateForm({
          ...form.data,
          name: e.currentTarget.textContent as string,
        }).unwrap();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!location.state) navigate("/applications");
  }, [location]);

  return (
    <Box sx={formContentContainerStyles}>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            <span
              id="name"
              contentEditable="true"
              onBlur={handleFormNameChange}
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
              onBlur={handleSubmitBtnChange}
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
