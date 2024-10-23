
import { Box, Button, LinearProgress } from "@mui/material";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomMarkdownEditor from "../../../../components/layout/CustomMarkdownEditor";
import * as yup from "yup";
import { useFormik } from "formik";
import ShareWithModal from "../../../../components/ShareWithModal";
import { useAddNoteMutation } from "../../../../store/api/notes.api";
import { noteInput } from "../../../../types/notes";
import { useGetParticipantsQuery } from "../../../../store/api/participants.api";


const NewNote = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [noteId, setNoteId] = useState<number | null>(null);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const locationData = location.pathname.split("/");
  const courseId = locationData[locationData.length - 3];

  const [createNote, { isLoading: isCreatingNote }] = useAddNoteMutation();
  const { data: participants, isLoading: isFetchingParticipants } =
    useGetParticipantsQuery(null);
  // console.log(participants?.data.first_name);
  // console.log(participants?.data);

  const formik = useFormik<noteInput>({
    initialValues: {
      title: "Untitled Document",
      content: "",
      media: [],
      course_id: parseInt(courseId) | 0,
      // note_id: 0,
      // participants: []
    },
    validationSchema: yup.object({
      title: yup.string().required("Required"),
      content: yup.string().required("Required"),
      course_id: yup.number().required(),
      // recipients: yup.array().required("Required"),
    }),
    onSubmit: async (values: noteInput) => {
      try {
        const response = await createNote(values).unwrap();
        setNoteId(response?.data?.id);
        handleOpenModal();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Box ref={containerRef} className="content-container">
      {isFetchingParticipants && <LinearProgress />}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
          height: "75vh",
        }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ padding: "1.5rem" }}>
            <input
              type="text"

              name="title"
              id="title"
              onChange={formik.handleChange}
              value={formik.values.title}
              style={{
                border: "none",
                fontWeight: 500,
                fontSize: "1.8rem",
                color: "#8E8E93",
                outline: "none",
                // width: "500px",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#CCCCCC",
                borderRadius: "6px",
                width: "11em",
                alignSelf: "end",
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: "6px",
                width: "11em",
                alignSelf: "end",
              }}

              type="submit"
              // onClick={handleOpenModal}
            >
              {isCreatingNote ? "Loading" : "Save & Share"}
            </Button>
          </Box>
        </Box>
        <Box>
          <CustomMarkdownEditor
            placeholder="Start writing something here..."

            value={formik.values.content}
            onChange={(markdown) => formik.setFieldValue("content", markdown)}
          />
        </Box>
      </Box>
      <ShareWithModal
        open={openModal}
        handleClose={handleCloseModal}
        // handleSelectedRecipients={handleSelectedRecipients}
        noteId={noteId}
        participants={participants?.data ?? []}

      />
    </Box>
  );
};

export default NewNote;
