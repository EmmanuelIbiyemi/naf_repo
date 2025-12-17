import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  SxProps,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import MediaItem from "./components/MediaItem";
import { Close, Delete, Search } from "@mui/icons-material";
import uploadIcon from "../../../assets/upload-file.svg";
import SuccessModal from "../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import {
  useAddMediaMutation,
  useDeleteMediaMutation,
  useGetAllMediaQuery,
} from "../../../store/api/media.api";
import { useAppDispatch } from "../../../store/hooks";
import { setPageLoading } from "../../../store/app.slice";
import { MediaType } from "../../../types/media";
import EmptyState from "../../../components/EmptyState";
import { Pagination } from "../../../types/pagination";
import CustomPagination from "../../../components/CustomPagination";

const MediaLibrary = () => {
  const tabs = [
    { id: "1", name: "All Media", type: "" },
    { id: "2", name: "Videos", type: "video" },
    { id: "3", name: "Images", type: "image" },
  ];
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = useState("");
  const [mediaType, setMediaType] = useState<string>("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 12,
  });
  const {
    data: allMedia,
    isError,
    isFetching,
  } = useGetAllMediaQuery({ ...pagination, mediaType, search_term: keyword });

  const [deleteMedia, deleteState] = useDeleteMediaMutation();
  const [addMedia, addState] = useAddMediaMutation();
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
    delete: false,
    bulkDelete: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [startUpload, setStartUpload] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaType>();
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

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

  const handleOpenDeleteModal = (media: MediaType) => {
    handleOpenModal("delete");
    setSelectedMedia(media);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    mediaId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != mediaId);
    setDeleteIds(event.target.checked ? [...newIds, mediaId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deleteMedia(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        // Delete failed - continue with remaining items
      }
  };

  const handleSearch = async (event: KeyboardEvent) => {
    if (event.key == "Enter")
      setKeyword((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    const uploadFiles = async () => {
      if (startUpload && files.length) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            const form = new FormData();
            form.append("file", file);
            await addMedia(form).unwrap();
          } catch (error) {
            // Upload failed - continue with remaining files
          }
        }
        setFiles([]);
      }
    };
    uploadFiles();
  }, [startUpload, files, addMedia]);

  useEffect(() => {
    if (!files.length) setStartUpload(false);
  }, [files]);

  useEffect(() => {
    setDeleteIds([]);

    // Move back 1 page if server response is empty on the page (due to bulk delete)
    if (!allMedia?.media.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [keyword, allMedia]);

  useEffect(() => {
    if ((isFetching && !isError) || deleteState.isLoading || addState.isLoading)
      dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, isError, deleteState, addState]);

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
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText=""
        open={openModal.delete}
        subTitle={`Are you sure you want to delete media ? You can’t undo this action.`}
        title="Delete Media ?"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} Media ?`}
        title="Delete Media ?"
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
        <Box sx={{ alignItems: "center", display: "flex", gap: "1rem" }}>
          <Box sx={searchFieldStyles}>
            <Search />
            <input
              name="keyword"
              placeholder="Search..."
              onKeyDown={handleSearch}
            />
          </Box>
          <Button variant="contained" onClick={() => handleOpenModal("add")}>
            Add Media
          </Button>
        </Box>
      </Box>

      <Box sx={{ width: "100%", position: "relative" }}>
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              {tabs.map((tab, index) => (
                <Button
                  key={`tab-${tab.id}`}
                  onClick={() => setMediaType(tabs[index].type)}
                  sx={{
                    borderRadius: 0,
                    paddingInline: "1rem",
                    borderBottom:
                      tab.type == mediaType
                        ? "3px solid rgba(2, 54, 120, 1)"
                        : "",
                  }}
                >
                  {tab.name}
                </Button>
              ))}
            </Box>
            {/* Bulk delete */}
            <Box sx={{ paddingLeft: "1rem", display: "flex", gap: "1rem" }}>
              {deleteIds.length ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() =>
                    setOpenModal((prev) => ({ ...prev, bulkDelete: true }))
                  }
                >
                  <Delete sx={{ marginRight: ".3rem" }} />
                  Delete selected
                </Button>
              ) : null}
            </Box>
          </Box>

          {allMedia?.media.length ? (
            <>
              <Box sx={mediaContainerStyles}>
                {allMedia?.media?.map((media) => (
                  <MediaItem
                    key={`mediaitem-${media.id}`}
                    media={media}
                    deleteItem={() => handleOpenDeleteModal(media)}
                    deleteIds={deleteIds}
                    handleSelect={handleSelect}
                  />
                ))}
              </Box>

              <CustomPagination
                count={Math.ceil(
                  allMedia?.pagination.total / allMedia?.pagination.per_page
                )}
                page={allMedia?.pagination.page}
                handleChangePage={(_, page) => {
                  setPagination({
                    per_page: allMedia?.pagination.per_page,
                    page,
                  });
                }}
                startIndex={
                  allMedia?.pagination.per_page *
                    (allMedia?.pagination.page - 1) +
                  1
                }
                endIndex={
                  allMedia?.pagination.per_page * allMedia?.pagination.page
                }
                totalNumber={allMedia?.pagination.total}
              />
            </>
          ) : (
            <EmptyState
              title={isError ? "Could Not Fetch Media" : "No Media yet"}
              subTitle="Media will appear here after you add them in your school."
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MediaLibrary;

const contentStyles: SxProps = {
  paddingInline: "2rem",
  paddingBottom: "2rem",
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

const mediaContainerStyles: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(4,1fr)",
  marginTop: "2rem",
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

const fieldStyles: SxProps = {
  bgcolor: "#fff",
  border: "1px solid rgba(204, 204, 204, 0.6)",
  display: "inline-flex",

  "input, select": {
    border: "none",
    borderRadius: "var(--border-radius)",
    padding: ".8rem",
  },

  svg: {
    color: "rgba(138, 138, 138, 1)",
  },
};

const searchFieldStyles: SxProps = {
  ...fieldStyles,
  alignItems: "center",
  paddingInline: ".8rem",

  input: {
    outline: "none",
    width: "300px",
  },
};
