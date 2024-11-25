import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  SxProps,
  Tab,
  Typography,
} from "@mui/material";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import MediaItem from "./components/MediaItem";
import { Close } from "@mui/icons-material";
import uploadIcon from "../../../assets/upload-file.svg";
import SuccessModal from "../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import {
  useAddMediaMutation,
  useDeleteMediaMutation,
  useGetAllByTypeMediaQuery,
  useGetAllMediaQuery,
} from "../../../store/api/media.api";
import { useAppDispatch } from "../../../store/hooks";
import { setPageLoading } from "../../../store/app.slice";
import { MediaType } from "../../../types/media";
import EmptyState from "../../../components/EmptyState";

const MediaLibrary = () => {
  const tabs = [
    { id: "1", name: "All Media" },
    { id: "2", name: "Videos" },
    { id: "3", name: "Images" },
  ];
  const [tab, setTab] = useState("1");
  const dispatch = useAppDispatch();
  const {
    data: allMedia,
    isFetching: allLoading,
    isError: allError,
  } = useGetAllMediaQuery({ per_page: 100 });
  const {
    data: images,
    isFetching: imagesLoading,
    isError: imagesError,
  } = useGetAllByTypeMediaQuery({
    mediaType: "image",
  });
  const {
    data: videos,
    isFetching: videosLoading,
    isError: videosError,
  } = useGetAllByTypeMediaQuery({
    mediaType: "video",
  });
  const [deleteMedia] = useDeleteMediaMutation();
  const [addMedia] = useAddMediaMutation();
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
    delete: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [startUpload, setStartUpload] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaType>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setStartUpload(true);
  }, []);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 5,
  });

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
    setFiles([]);
  };

  const handleDeleteMedia = async (id: number) => {
    dispatch(setPageLoading(true));
    try {
      await deleteMedia(id).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleOpenModal("success");
    dispatch(setPageLoading(false));
  };

  const handleDeleteAction = (media: MediaType) => {
    handleOpenModal("delete");
    setSelectedMedia(media);
  };

  useEffect(() => {
    if (startUpload && files.length) {
      files.forEach(async (file, i) => {
        try {
          const form = new FormData();
          form.append("file", file);
          const response = await addMedia(form).unwrap();
          console.log(response);
        } catch (error) {
          console.log(error);
        }
        setFiles((prev) => prev.filter((_, j) => i != j));
      });
    }
  }, [startUpload]);

  useEffect(() => {
    if (!files.length) setStartUpload(false);
  }, [files]);

  useEffect(() => {
    dispatch(setPageLoading(true));
  }, []);

  useEffect(() => {
    if (!allLoading && !imagesLoading && !videosLoading)
      dispatch(setPageLoading(false));
  }, [allLoading, imagesLoading, videosLoading]);

  return (
    <Box sx={contentStyles}>
      <SuccessModal
        close={() => {
          handleCloseModal("success");
        }}
        infoText=""
        open={openModal.success}
        subTitle={`Media successfully deleted`}
        title="Updates Successful"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedMedia) handleDeleteMedia(selectedMedia.id);
            console.log("proceed");
          }
        }}
        close={() => handleCloseModal("delete")}
        infoText=""
        open={openModal.delete}
        subTitle={`Are you sure you want to delete media ? You can’t undo this action.`}
        title="Delete Media?"
      />

      <Dialog
        open={openModal.add}
        onClose={() => handleCloseModal("add")}
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
            <IconButton onClick={() => handleCloseModal("add")}>
              <Close />
            </IconButton>
          </Box>
          <div
            {...getRootProps()}
            className="dashed_border"
            style={dropzoneStyles}
          >
            {!files.length ? (
              <Box sx={{ textAlign: "center" }}>
                <img src={uploadIcon} alt="" height={40} />
                <p>Drop the files here ...</p>
              </Box>
            ) : null}

            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : files ? (
              <Box sx={selectedMediaContainer} className="hide_scrollbar">
                {files.map((file, i) => (
                  <Box key={file.name + i}>
                    <img src={URL.createObjectURL(file)} />
                    <CircularProgress />
                  </Box>
                ))}
              </Box>
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
        <Button variant="contained" onClick={() => handleOpenModal("add")}>
          Add Media
        </Button>
      </Box>

      <Box sx={{ width: "100%", position: "relative" }}>
        <TabContext value={tab}>
          <Box>
            <TabList
              onChange={(_, newValue) => setTab(newValue)}
              aria-label="lab API tabs example"
            >
              {tabs.map((tab) => (
                <Tab key={`tab-${tab.id}`} label={tab.name} value={tab.id} />
              ))}
            </TabList>
          </Box>
          <TabPanel
            value="1"
            sx={{
              ...TabStyles,
              display: allMedia?.media.length ? "grid" : "block",
            }}
          >
            {allMedia?.media.length ? (
              allMedia?.media?.map((media) => (
                <MediaItem
                  key={`mediaitem-${media.id}`}
                  media={media}
                  deleteItem={() => handleDeleteAction(media)}
                />
              ))
            ) : (
              <EmptyState
                title={allError ? "Could Not Fetch Media" : "No Media yet"}
                subTitle="Media will appear here after you add them in your school."
              />
            )}
          </TabPanel>
          <TabPanel
            value="2"
            sx={{
              ...TabStyles,
              display: videos?.media.length ? "grid" : "block",
            }}
          >
            {videos?.media.length ? (
              videos?.media?.map((media) => (
                <MediaItem
                  key={`mediaitem-${media.id}`}
                  media={media}
                  deleteItem={() => handleDeleteAction(media)}
                />
              ))
            ) : (
              <EmptyState
                title={videosError ? "Could Not Fetch Media" : "No Media yet"}
                subTitle="Media will appear here after you add them in your school."
              />
            )}
          </TabPanel>
          <TabPanel
            value="3"
            sx={{
              ...TabStyles,
              display: images?.media.length ? "grid" : "block",
            }}
          >
            {images?.media.length ? (
              images?.media?.map((media) => (
                <MediaItem
                  key={`mediaitem-${media.id}`}
                  media={media}
                  deleteItem={() => handleDeleteAction(media)}
                />
              ))
            ) : (
              <EmptyState
                title={imagesError ? "Could Not Fetch Media" : "No Media yet"}
                subTitle="Media will appear here after you add them in your school."
              />
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default MediaLibrary;

const contentStyles: SxProps = {
  paddingInline: "2rem",
  ".MuiTabPanel-root": {
    position: "relative !important",

    "&[hidden]": {
      position: "absolute !important",
      top: 0,
      zIndex: -1,
    },
  },
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem",
  position: "relative",
  zIndex: 1,
};

const TabStyles: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(4,1fr)",
  paddingInline: "0 !important",
  position: "absolute",
  width: "100%",
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

const selectedMediaContainer: SxProps = {
  display: "flex",
  gap: "1rem",
  maxHeight: "100%",
  maxWidth: "100%",

  ">div": {
    borderRadius: "var(--border-radius)",
    display: "grid",
    flexShrink: 0,
    height: "100px",
    overflow: "hidden",
    placeItems: "center",
    position: "relative",
    width: "100px",

    ".MuiCircularProgress-root": {
      color: "#fff",
    },

    img: {
      objectFit: "cover",
      position: "absolute",
    },
  },
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
