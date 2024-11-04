import { Box, Button, LinearProgress } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomMarkdownEditor from "../../../../components/layout/CustomMarkdownEditor";
import * as yup from "yup";
import { useFormik } from "formik";
import ShareWithModal from "../../../../components/ShareWithModal";
import { useAddNoteMutation } from "../../../../store/api/notes.api";
import { noteInput } from "../../../../types/notes";
import { useGetCourseParticipantsQuery } from "../../../../store/api/participants.api";
import { useAddMediaMutation } from "../../../../store/api/media.api";

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
  const [uploadFile, { isLoading: isUploadingFile }] = useAddMediaMutation();

  const { data: participants, isLoading: isFetchingParticipants } =
    useGetCourseParticipantsQuery({ course_id: parseInt(courseId) });
  // console.log(participants?.data.first_name);
  // console.log(participants?.data);

  const formik = useFormik<noteInput>({
    initialValues: {
      title: "Untitled Document",
      content: "",
      media: [],
      course_id: parseInt(courseId),
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

  const handleImageUpload = async (file: File) => {
    try {
      const image = file;
      const formData = new FormData();
      formData.append("file", image);
      console.log(formData);
      const response = await uploadFile(formData).unwrap();
      formik.setFieldValue("media", [
        ...formik.values.media,
        ...response.media.map((resource) => ({ id: resource.id })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

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
          {/* <Box sx={{ padding: "1.5rem" }}>
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
          </Box> */}
          <Box sx={{ padding: "1.5rem" }}>
            <input
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
            handleImageUpload={handleImageUpload}
            isLoading={isUploadingFile}
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
