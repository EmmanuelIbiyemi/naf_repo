import {
  Box,
  Button,
  TextField,
  Chip,
  Typography,
  Alert,
  Snackbar,
  Paper,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import GoogleDocsEditor from "../../../../components/layout/GoogleDocsEditor";
import * as yup from "yup";
import { useFormik } from "formik";
import { useUpdateNoteMutation } from "../../../../store/api/notes.api";
import { note, noteInput } from "../../../../types/notes";
import { useGetCourseParticipantsQuery } from "../../../../store/api/participants.api";
import { useAddMediaMutation } from "../../../../store/api/media.api";
import ShareWithList from "../../../../components/ShareWithList";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

type noteProps = {
  noteData: note;
};

const EditNote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saved" | "saving" | "error" | null
  >(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState({ title: "", content: "" });
  const autoSaveTimerRef = useRef<number | null>(null);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const { noteData } = (location.state as noteProps) || {};

  // Redirect if no note data (direct navigation or page refresh)
  if (!noteData) {
    return <Navigate to="/instructor/notes" replace />;
  }

  const mediaItems = noteData.media
    .filter((media) => media.id)
    .map((media) => ({ id: media.id }));

  const { courseId } = useParams();

  // const courseId = locationData[locationData.length - 3];

  const [updateNote, { isLoading: isUpdatingNote }] = useUpdateNoteMutation();
  const [uploadFile] = useAddMediaMutation();

  const { data: participants } = useGetCourseParticipantsQuery(
    { course_id: parseInt(courseId || "") },
    { skip: !courseId || isNaN(parseInt(courseId)) }
  );

  // Warn user about unsaved changes when leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const formik = useFormik<noteInput>({
    initialValues: {
      title: noteData.title || "",
      content: noteData.content || "",
      media: mediaItems || [],
      course_id: courseId ? parseInt(courseId) : 0,
      is_draft: false,
    },
    validationSchema: yup.object({
      title: yup.string().required("Required"),
      content: yup.string().required("Required"),
      course_id: yup.number().required(),
    }),
    onSubmit: async () => {
      // This will be used for the Share button
      await handleSave();
      if (noteData.id) {
        handleOpenModal();
      }
    },
  });

  // Initialize last saved content
  useEffect(() => {
    setLastSavedContent({
      title: noteData.title || "",
      content: noteData.content || "",
    });
  }, [noteData.title, noteData.content]);

  // Track unsaved changes
  useEffect(() => {
    const contentChanged = 
      formik.values.title !== lastSavedContent.title ||
      formik.values.content !== lastSavedContent.content;
    
    setHasUnsavedChanges(contentChanged && Boolean(formik.values.title || formik.values.content));
  }, [formik.values.title, formik.values.content, lastSavedContent]);

  // Calculate word count and reading time
  const calculateStats = useCallback((content: string) => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words/min
    return { words, readingTime };
  }, []);

  const stats = calculateStats(formik.values.content);

  // Manual save handler
  const handleSave = async () => {
    if (!formik.values.title || !formik.values.content) {
      setSnackbarMessage("Please add a title and content before saving.");
      setSnackbarOpen(true);
      return;
    }

    try {
      setAutoSaveStatus("saving");
      
      await updateNote({
        body: { ...formik.values, is_draft: false },
        id: noteData.id,
      }).unwrap();
      
      setLastSavedContent({
        title: formik.values.title,
        content: formik.values.content,
      });
      setHasUnsavedChanges(false);
      setAutoSaveStatus("saved");
      setSnackbarMessage("Note saved successfully!");
      setSnackbarOpen(true);
      setTimeout(() => setAutoSaveStatus(null), 3000);
    } catch (error) {
      setAutoSaveStatus("error");
      console.error("Save failed:", error);
      setSnackbarMessage("Failed to save note. Please try again.");
      setSnackbarOpen(true);
    }
  };

  // Auto-save functionality (saves as draft)
  const autoSave = useCallback(async () => {
    if (!formik.values.title || !formik.values.content) return;
    
    // Check if there are actual changes
    const hasChanges = 
      formik.values.title !== lastSavedContent.title ||
      formik.values.content !== lastSavedContent.content;
    
    if (!hasChanges) {
      return; // No changes to save
    }
    
    try {
      setAutoSaveStatus("saving");
      
      await updateNote({
        body: { ...formik.values, is_draft: true },
        id: noteData.id,
      }).unwrap();
      
      setLastSavedContent({
        title: formik.values.title,
        content: formik.values.content,
      });
      setHasUnsavedChanges(false);
      setAutoSaveStatus("saved");
      setTimeout(() => setAutoSaveStatus(null), 3000);
    } catch (error) {
      setAutoSaveStatus("error");
      console.error("Auto-save failed:", error);
    }
  }, [formik.values, noteData.id, updateNote]);

  // Trigger auto-save on content change
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Check if there are actual changes
    const hasChanges = 
      formik.values.title !== lastSavedContent.title ||
      formik.values.content !== lastSavedContent.content;

    if (hasChanges && (formik.values.content || formik.values.title)) {
      setHasUnsavedChanges(true);
      autoSaveTimerRef.current = setTimeout(() => {
        autoSave();
      }, 3000); // Auto-save after 3 seconds of inactivity
    } else if (!hasChanges) {
      setHasUnsavedChanges(false);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formik.values.content, formik.values.title, lastSavedContent, autoSave]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave? Your changes will be lost."
      );
      if (!confirmLeave) return;
    }
    navigate(-1);
  };

  // Upload handler for images and files
  const handleUpload = async (file: File): Promise<{ url: string; id: number }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadFile(formData).unwrap();
      const mediaItem = response.media[0];
      
      // Add to formik media array
      formik.setFieldValue("media", [
        ...formik.values.media,
        { id: mediaItem.id },
      ]);
      
      return { url: mediaItem.url, id: mediaItem.id };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const { url } = await handleUpload(file);
      // Return the URL so the toolbar can insert it
      return url;
    } catch (error) {
      console.error("Image upload failed:", error);
      setSnackbarMessage("Failed to upload image. Please try again.");
      setSnackbarOpen(true);
      throw error;
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const { url } = await handleUpload(file);
      // Return the URL and filename so the toolbar can insert it as a link
      return { url, name: file.name };
    } catch (error) {
      console.error("File upload failed:", error);
      setSnackbarMessage("Failed to upload file. Please try again.");
      setSnackbarOpen(true);
      throw error;
    }
  };

  return (
    <Box className="content-container">
      <Paper
        elevation={0}
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          margin: "1em",
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.5rem",
            borderBottom: "1px solid #E5E5EA",
            backgroundColor: "#F9FAFB",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Go Back">
              <IconButton onClick={handleBack} size="small">
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1D1D1F" }}>
              Edit Note
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Auto-save status */}
            {autoSaveStatus && (
              <Chip
                size="small"
                label={
                  autoSaveStatus === "saving"
                    ? "Saving draft..."
                    : autoSaveStatus === "saved"
                    ? "Draft saved"
                    : "Save failed"
                }
                color={
                  autoSaveStatus === "saved"
                    ? "success"
                    : autoSaveStatus === "saving"
                    ? "default"
                    : "error"
                }
                icon={<SaveIcon fontSize="small" />}
              />
            )}

            {/* Unsaved changes indicator */}
            {hasUnsavedChanges && !autoSaveStatus && (
              <Chip
                size="small"
                label="Unsaved changes"
                color="warning"
                variant="outlined"
              />
            )}

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isUpdatingNote || !formik.values.content}
              sx={{
                borderRadius: "8px",
                paddingX: 3,
              }}
            >
              {isUpdatingNote ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ShareIcon />}
              onClick={formik.handleSubmit as () => void}
              disabled={!noteData.id}
              sx={{
                borderRadius: "8px",
                paddingX: 3,
              }}
            >
              Share
            </Button>
          </Box>
        </Box>

        {/* Stats Bar */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            padding: "0.75rem 1.5rem",
            backgroundColor: "#F5F5F7",
            borderBottom: "1px solid #E5E5EA",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "#6E6E73" }}>
              Words:
            </Typography>
            <Chip
              label={stats.words.toLocaleString()}
              size="small"
              sx={{ height: "20px", fontSize: "0.75rem" }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: "1rem", color: "#6E6E73" }} />
            <Typography variant="caption" sx={{ color: "#6E6E73" }}>
              {stats.readingTime} min read
            </Typography>
          </Box>
        </Box>

        {/* Form Section */}
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{
            height: "calc(75vh - 140px)",
            overflow: "auto",
          }}
        >
          {/* Title Input */}
          <Box sx={{ padding: "2rem 2rem 1rem 2rem" }}>
            <TextField
              name="title"
              id="title"
              placeholder="Untitled Document"
              onChange={formik.handleChange}
              value={formik.values.title}
              fullWidth
              variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  color: "#1D1D1F",
                  "&::placeholder": {
                    color: "#8E8E93",
                  },
                },
              }}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <Divider sx={{ marginTop: 2 }} />
          </Box>

          {/* Content Editor */}
          <Box sx={{ height: "calc(100vh - 400px)", minHeight: "600px" }}>
            <GoogleDocsEditor
              placeholder="Start editing your note..."
              onChange={(content) => {
                formik.setFieldValue("content", content);
              }}
              initialContent={formik.values.content}
              onImageUpload={handleImageUpload}
              onFileUpload={handleFileUpload}
              onUpload={handleUpload}
            />
            {formik.touched.content && formik.errors.content && (
              <Typography color="error" variant="caption" sx={{ marginTop: 1 }}>
                {formik.errors.content}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes("success") ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <ShareWithList
        open={openModal}
        handleClose={handleCloseModal}
        noteId={noteData.id ?? null}
        participants={participants?.data ?? []}
      />
    </Box>
  );
};

export default EditNote;
