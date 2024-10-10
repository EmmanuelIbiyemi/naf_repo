import { useState } from "react";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import { Close } from "@mui/icons-material";
import csvIcon from "../../../../assets/csvIcon.svg";
import notesQuestionIcon from "../../../../assets/notesQuestionIcon.svg";
import UploadFileModal from "../../../../components/UploadFileModal";
import { useNavigate } from "react-router-dom";

type uplodaModalProps = {
  open: boolean;
  handleClose: () => void;
  // handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleFileChange: (file: File) => void;
  handleProcessFileUrl: (fileUrl: string) => void;
  //   handleSelectMedia: (id: number, name: string) => void;
};

const NotesUploadModal = ({
  open,
  handleClose,
  handleFileChange,
  handleProcessFileUrl,
}: //   handleSelectMedia,
uplodaModalProps) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleUploadNew = () => {
    setUploadModalOpen(true);
    handleClose();
  };

  return (
    <Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "2em",
            borderRadius: "6px",
            width: { xs: "90%", sm: "70%", md: "60%" },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "start",
            }}
          >
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "64%" }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  textAlign: "center",
                  marginBottom: "1em",
                }}
              >
                Create New Note
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "column",
                    padding: "2em 1.3em",
                    // border: "1px solid #CCCCCC",
                    // borderRadius: "20px",
                    // boxShadow: "0px 3.74px 3.74px 0px #00000040",
                  }}
                >
                  <Box sx={{ width: "9em", margin: "2.2em 1em" }}>
                    <img src={csvIcon} style={{ width: "100%" }} />
                  </Box>
                  <Button
                    sx={{
                      border: "1px solid #FCC21B",
                      fontSize: ".8rem",
                      padding: ".8em",
                      fontWeight: 500,
                      backgroundColor: "#F0F9FF",
                    }}
                    onClick={handleUploadNew}
                  >
                    Import CSV
                  </Button>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "column",
                    padding: "2em 1.3em",
                    // border: "1px solid #CCCCCC",
                    // borderRadius: "20px",
                    // boxShadow: "0px 3.74px 3.74px 0px #00000040",
                  }}
                >
                  <Box sx={{ width: "9em", margin: "2.2em 1em" }}>
                    <img src={notesQuestionIcon} style={{ width: "100%" }} />
                  </Box>
                  <Button
                    sx={{
                      border: "1px solid #FCC21B",
                      fontSize: ".8rem",
                      padding: ".8em",
                      fontWeight: 500,
                      backgroundColor: "#F0F9FF",
                    }}
                    onClick={() => navigate("new")}
                  >
                    Imput Manually
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
      <UploadFileModal
        open={uploadModalOpen}
        handleClose={() => setUploadModalOpen(false)}
        handleFileChange={handleFileChange}
        handleProcessFileUrl={handleProcessFileUrl}
      />
      {/* <LibraryModal
        open={libraryModalOpen}
        handleClose={() => setLibraryModalOpen(false)}
        handleSelectMedia={handleSelectMedia}
      /> */}
    </Box>
    // </Box>
  );
};

export default NotesUploadModal;
