import { Close } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import uploadIcon from "../assets/uploadIcon.svg";
import { useState } from "react";

type uploadFileModalProps = {
  open: boolean;
  handleClose: () => void;
  // handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleFileChange: (file: File) => void;
  handleProcessFileUrl?: (fileUrl: string) => void;
};

const UploadFileModal = ({
  open,
  handleClose,
  handleFileChange,
  handleProcessFileUrl,
}: uploadFileModalProps) => {
  const [fileUrl, setFileUrl] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrop = (event: any) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
      // handleClose();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFileInputChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      handleFileChange(event.target.files[0]);
      // handleClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          padding: "2em",
          borderRadius: "6px",
          width: { xs: "90%", sm: "70%", md: "40%" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
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
            flexDirection: "column",
          }}
        >
          {handleProcessFileUrl ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                width: "90%",
                gap: 1,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: "1.2rem",
                  textAlign: "center",
                  color: "#0B0B0B",
                }}
              >
                Media Upload
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontSize: ".8rem",
                  textAlign: "center",
                  marginBottom: "2em",
                  color: "#6D6D6D",
                }}
              >
                Add your documents here, and you can upload up to 5 files max
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="h4"
              sx={{
                fontSize: "1.2rem",
                color: "#0B0B0B",
                width: "90%",
                marginBottom: "1em",
              }}
            >
              Import Docx
            </Typography>
          )}
          <Box
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            sx={{
              border: "2px dashed #6F6F67",
              borderRadius: 2,
              textAlign: "center",
              cursor: "pointer",
              width: "90%",
              padding: "4em",
            }}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={onFileInputChange}
            />
            <label
              htmlFor="fileInput"
              style={{
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Box sx={{ width: "3.5em" }}>
                <img src={uploadIcon} style={{ width: "100%" }} />
              </Box>
              <Typography
                sx={{ fontSize: "1rem", fontWeight: 300, color: "#0B0B0B" }}
              >
                Drag your file(s) or{" "}
                <span style={{ color: "#152259", fontWeight: 600 }}>
                  browse
                </span>
              </Typography>
            </label>
          </Box>
          {handleProcessFileUrl && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                width: "90%",
                gap: 1,
                marginTop: "1.5em",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontSize: ".8rem",
                  textAlign: "center",
                  marginBottom: "1em",
                  color: "#6D6D6D",
                }}
              >
                Add your documents here, and you can upload up to 5 files max
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  marginBottom: ".5rem",
                }}
              >
                <span
                  style={{ borderTop: "1px solid #E7E7E7", width: "48%" }}
                ></span>
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    color: "#6D6D6D",
                  }}
                >
                  OR
                </Typography>
                <span
                  style={{ borderTop: "1px solid #E7E7E7", width: "48%" }}
                ></span>
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "1rem",
                  textAlign: "center",
                  color: "#0B0B0B",
                }}
              >
                Upload from URL
              </Typography>
              <TextField
                id="fileUrl"
                placeholder="Add file URL"
                onChange={(e) => setFileUrl(e.target.value)}
                value={fileUrl}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="start">
                        <Button
                          sx={{ color: "#6D6D6D" }}
                          onClick={() => handleProcessFileUrl(fileUrl)}
                        >
                          Upload
                        </Button>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ width: "100%" }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadFileModal;
