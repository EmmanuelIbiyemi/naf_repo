import { Box, Button } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomMarkdownEditor from "../../../../components/layout/CustomMarkdownEditor";
import * as yup from "yup";
import { useFormik } from "formik";
import ShareWithModal from "../../../../components/ShareWithModal";
import SuccessModal from "../../../../components/SuccessModal";

const NewNote = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => setOpenSuccessModal(false);

  const formik = useFormik({
    initialValues: {
      name: "Untitled Document",
      body: "",
      recipients: [],
    },
    validationSchema: yup.object({
      name: yup.string().required("Required"),
      body: yup.string().required("Required"),
      recipients: yup.array().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      handleOpenSuccessModal();
    },
  });

  const handleSelectedRecipients = (recipients: number[]) => {
    // formik.setFieldValue("recipients", recipients);
    console.log(recipients);
    handleOpenSuccessModal();
  };

  return (
    <Box ref={containerRef} className="content-container">
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
              name="name"
              id="name"
              onChange={formik.handleChange}
              value={formik.values.name}
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
              // type="submit"
              onClick={handleOpenModal}
            >
              Save & Share
            </Button>
          </Box>
        </Box>
        <Box>
          <CustomMarkdownEditor
            placeholder="Start writing something here..."
            value={formik.values.body}
            onChange={(markdown) => formik.setFieldValue("body", markdown)}
          />
        </Box>
      </Box>
      <ShareWithModal
        open={openModal}
        handleClose={handleCloseModal}
        handleSelectedRecipients={handleSelectedRecipients}
      />
      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={() => {
          handleCloseSuccessModal();
        }}
        infoText=""
        open={openSuccessModal}
        subTitle={`You have successfully shared a new note to your students`}
        title="Successful"
      />
    </Box>
  );
};

export default NewNote;
