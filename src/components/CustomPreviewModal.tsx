import { Close } from "@mui/icons-material";
import { Box, Modal, Typography, IconButton } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { note } from "../types/notes";
import remarkGfm from "remark-gfm";

type NoteModalsProps = {
  openModal: boolean;
  handleCloseModal: () => void;
  note: note;
};

const CustomPreviewModal = ({
  openModal,
  handleCloseModal,
  note,
}: NoteModalsProps) => {
  const components = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    a: ({ href, children, ...props }: any) => {
      const isVideo = href?.match(/\.(mp4|webm|ogg)$/i);
      const isFile = href?.match(/\.(docx|pdf|txt|xlsx|csv)$/i);

      if (isVideo) {
        return (
          <video
            controls
            style={{
              maxWidth: "100%",
              height: "auto",
              display: "block",
              margin: "1rem 0",
            }}
          >
            <source src={href} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }

      if (isFile) {
        return (
          <a
            {...props}
            href={href}
            style={{
              color: "#0066cc",
              textDecoration: "none",
              display: "inline-block",
              margin: "1rem 0",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            🗂️ Open File: {children || href}
          </a>
        );
      }

      return (
        <a
          {...props}
          href={href}
          style={{ color: "#0066cc", textDecoration: "none" }}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
    img: ({ ...props }) => (
      <img
        {...props}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "1rem 0",
        }}
      />
    ),
  };

  return (
    <Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "2.5em",
            borderRadius: "24px",
            width: { xs: "90%", sm: "70%", md: "55vw" },
            maxWidth: { xs: "75vw", md: "55vw" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{ color: "#2F2F2F", fontWeight: 700, fontSize: "2em" }}
            >
              Preview Note
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <Close sx={{ fontSize: "2rem", color: "#6F6F67" }} />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", gap: 1, marginTop: ".5em" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#9F9F9F",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "capitalize",
              }}
            >
              {note.title}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#F9F9F9",
              borderRadius: "21px",
              marginTop: "1em",
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxHeight: "65vh",
            }}
          >
            <Box
              sx={{
                padding: "1.5em",
                overflowY: "auto",
                flex: 1,
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {note.content}
              </ReactMarkdown>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CustomPreviewModal;
