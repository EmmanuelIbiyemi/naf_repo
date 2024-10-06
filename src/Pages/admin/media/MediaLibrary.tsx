import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  SxProps,
  Tab,
  Typography,
} from "@mui/material";
import {
  CSSProperties,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import MediaItem from "./components/MediaItem";
import thumb1 from "/images/amphibious.png";
import thumb2 from "/images/image1.png";
import thumb3 from "/images/image2.png";
import { Close } from "@mui/icons-material";
import uploadIcon from "../../../assets/upload-file.svg";

const MediaLibrary = () => {
  const [tab, setTab] = useState("1");
  const [mediaArray] = useState([1, 2, 3, 4, 5]);
  const [modalOpen, setModalOpen] = useState(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, maxFiles: 5 });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Box sx={contentStyles}>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        scroll="body"
      >
        <Box sx={modalContentStyles}>
          <Box
            sx={{
              alignItems: "start",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h5">Media Upload</Typography>
              <Typography>
                Add your documents here, and you can upload up to 5 files max
              </Typography>
            </Box>
            <IconButton>
              <Close />
            </IconButton>
          </Box>
          <div
            {...getRootProps(style)}
            className="dashed_border"
            style={dropzoneStyles}
          >
            <img src={uploadIcon} alt="" height={40} />

            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
          <Box sx={{ position: "relative" }}>
            <Divider
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                width: "100%",
                zIndex: -1,
              }}
            />
            <span
              style={{
                backgroundColor: "#fff",
                display: "block",
                marginInline: "auto",
                textAlign: "center",
                width: "50px",
              }}
            >
              OR
            </span>
          </Box>
          <Typography>Upload from URL</Typography>
          <Box sx={uploadByURLStyles}>
            <input type="text" placeholder="Add file URL" />
            <Button>Upload</Button>
          </Box>
        </Box>
      </Dialog>
      <Box sx={headerStyles}>
        <Typography variant="h5">Media Library</Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Media
        </Button>
      </Box>

      <Box sx={{ width: "100%", position: "relative" }}>
        <TabContext value={tab}>
          <Box>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="All Media" value="1" />
              <Tab label="Videos" value="2" />
              <Tab label="Images" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={TabStyles}>
            {mediaArray.map(() => (
              <MediaItem image={thumb1} />
            ))}
          </TabPanel>
          <TabPanel value="2" sx={TabStyles}>
            {mediaArray.map(() => (
              <MediaItem image={thumb2} />
            ))}
          </TabPanel>
          <TabPanel value="3" sx={TabStyles}>
            {mediaArray.map(() => (
              <MediaItem image={thumb3} />
            ))}
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default MediaLibrary;

const contentStyles: SxProps = {
  paddingInline: "2rem",
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem",
};

const TabStyles: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(4,1fr)",
  paddingInline: "0 !important",
  position: "absolute",
  width: "100%",
};

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const dropzoneStyles: CSSProperties = {
  borderRadius: "var(--border-radius)",
  cursor: "pointer",
  display: "grid",
  padding: "1rem",
  placeItems: "center",
  placeContent: "center",
  height: "200px",
};

const modalContentStyles: SxProps = {
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  display: "grid",
  gap: "2rem",
  left: "50%",
  position: "fixed",
  padding: "1.5rem",
  top: "50%",
  transform: "translate(-50%,-50%)",
  width: "40vw",
};

const uploadByURLStyles: SxProps = {
  alignItems: "center",
  bgcolor: "rgba(252, 252, 253, 1)",
  border: "1px solid rgba(204, 204, 204, 0.5)",
  borderRadius: "var(--border-radius)",
  display: "flex",
  height: "60px",
  justifyContent: "space-between",
  padding: ".4rem 1rem",

  input: {
    bgcolor: "transparent",
    border: "transparent",
    height: "100%",
    outline: "none",
  },
  button: {
    bgcolor: "#fff",
    border: "inherit",
    color: "inherit",
    height: "25px",
    padding: 0,
  },
};
