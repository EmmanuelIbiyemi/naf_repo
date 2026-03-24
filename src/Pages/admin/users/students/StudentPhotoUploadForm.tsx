import { CloudUploadOutlined, InsertPhotoOutlined } from "@mui/icons-material";
import { Alert, Box, Button, List, ListItem, Paper, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { DragEvent, useMemo, useRef, useState } from "react";
import { useBulkUploadStudentPhotosMutation } from "../../../../store/api/students.api";
import { StudentPhotoUploadResponse } from "../../../../types/students";

type Props = {
  close: () => void;
};

const allowedFileTypes = "image/png,image/jpeg,image/jpg,image/webp,image/gif";

const StudentPhotoUploadForm = ({ close }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [result, setResult] = useState<StudentPhotoUploadResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [bulkUploadStudentPhotos, uploadState] =
    useBulkUploadStudentPhotosMutation();

  const filenames = useMemo(
    () => selectedFiles.map((file) => file.name),
    [selectedFiles]
  );

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setSelectedFiles(Array.from(files));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedFiles.length) return;

    const form = new FormData();
    selectedFiles.forEach((file) => {
      form.append("files", file);
    });

    try {
      const response = await bulkUploadStudentPhotos(form).unwrap();
      setResult(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <Box
      sx={{
        width: { xs: "90vw", sm: 640 },
        maxHeight: "85vh",
        overflowY: "auto",
        p: 3,
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center", mb: 1 }}>
        Upload Student Photos
      </Typography>
      <Typography
        sx={{ color: "text.secondary", textAlign: "center", mb: 3, px: 2 }}
      >
        Upload multiple image files named with each student&apos;s matric number.
        If the matric number contains slashes, use a sanitized filename like{" "}
        <strong>24_CSE_0001.jpg</strong>.
      </Typography>

      <Paper
        variant="outlined"
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        sx={{
          borderStyle: "dashed",
          borderWidth: 2,
          borderColor: isDragging ? "primary.main" : "divider",
          borderRadius: 3,
          p: 4,
          textAlign: "center",
          bgcolor: isDragging ? "#f4f8ff" : "#fafafa",
        }}
      >
        <InsertPhotoOutlined sx={{ fontSize: 42, color: "primary.main", mb: 1 }} />
        <Typography sx={{ mb: 1, fontWeight: 600 }}>
          Drag your photo files here or browse
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 2 }}>
          Accepted formats: JPG, PNG, WEBP, GIF
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept={allowedFileTypes}
          multiple
          style={{ display: "none" }}
          onChange={(event) => handleFiles(event.target.files)}
        />
        <Button
          variant="outlined"
          onClick={() => inputRef.current?.click()}
          startIcon={<CloudUploadOutlined />}
        >
          Choose Photos
        </Button>
      </Paper>

      {selectedFiles.length ? (
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 1 }}>
            Selected Files ({selectedFiles.length})
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 180, overflowY: "auto" }}>
            <List dense>
              {filenames.map((name, index) => (
                <ListItem
                  key={`${name}-${index}`}
                  sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                >
                  <Typography variant="body2">{name}</Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      ) : null}

      {result ? (
        <Alert
          severity={result.failed ? "warning" : "success"}
          sx={{ mt: 3, alignItems: "flex-start" }}
        >
          <Typography sx={{ fontWeight: 600 }}>
            {result.updated} photo{result.updated === 1 ? "" : "s"} updated
            {result.failed ? `, ${result.failed} failed` : ""}
          </Typography>
          {result.failed ? (
            <List dense sx={{ mt: 1, listStyleType: "disc", pl: 2 }}>
              {result.failures.map((failure, index) => (
                <ListItem key={`${failure.filename}-${index}`} sx={{ display: "list-item", py: 0.25 }}>
                  <Typography variant="body2">
                    {failure.filename || "Unnamed file"}: {failure.reason}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : null}
        </Alert>
      ) : null}

      {uploadState.isError && !result ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          Photo upload failed. Please try again.
        </Alert>
      ) : null}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}>
        <Button variant="contained" color="inherit" onClick={close}>
          Close
        </Button>
        <LoadingButton
          variant="contained"
          onClick={handleSubmit}
          loading={uploadState.isLoading}
          disabled={!selectedFiles.length}
        >
          Upload Photos
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default StudentPhotoUploadForm;
