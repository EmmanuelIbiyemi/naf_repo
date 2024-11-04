import {
  Box,
  Button,
  IconButton,
  TextareaAutosize,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FormatBold,
  FormatItalic,
  Code,
  Link,
  FormatListBulleted,
  FormatListNumbered,
  // Image,
  Undo,
  Redo,
} from "@mui/icons-material";

type Props = {
  placeholder: string;
  value: string;
  minHeight?: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
  handleImageUpload: (file: File) => void; // Image upload handler
  isLoading: boolean;
};

const CustomMarkdownEditor = ({
  placeholder,
  value,
  minHeight,
  onChange,
  disabled,
  handleImageUpload,
  isLoading,
}: Props) => {
  const [markdownText, setMarkdownText] = useState(value || "");
  const [mode, setMode] = useState<"write" | "preview">("write"); // Specify mode type
  const [history, setHistory] = useState<string[]>([markdownText]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkURL, setLinkURL] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setMarkdownText(newText);
    onChange(newText);

    // Update history
    if (historyIndex === history.length - 1) {
      setHistory([...history, newText]);
    } else {
      setHistory([...history.slice(0, historyIndex + 1), newText]);
    }
    setHistoryIndex((prev) => prev + 1);
  };

  const insertText = (
    tag: string,
    placeholder: string = "",
    type: "list" | "text" = "text"
  ) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeText = markdownText.substring(0, start);
    const afterText = markdownText.substring(end);
    const selectedText = markdownText.substring(start, end);

    // Handle duplicate bullet or numbered list
    if (
      type === "list" &&
      (beforeText.endsWith("\n- ") || beforeText.endsWith("\n1. "))
    ) {
      return;
    }

    // Handle selection removal if already wrapped
    if (selectedText.startsWith(tag) && selectedText.endsWith(tag)) {
      const updatedText = `${beforeText}${selectedText.slice(
        tag.length,
        -tag.length
      )}${afterText}`;
      setMarkdownText(updatedText);
      onChange(updatedText);
      textarea.selectionStart = textarea.selectionEnd = start;
      textarea.focus();
      return;
    }

    const updatedText = `${beforeText}${tag}${placeholder}${tag}${afterText}`;
    setMarkdownText(updatedText);
    onChange(updatedText);

    const cursorPosition = start + tag.length + placeholder.length;
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = cursorPosition;
      textarea.focus();
    }, 0);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setMarkdownText(history[historyIndex - 1]);
      onChange(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setMarkdownText(history[historyIndex + 1]);
      onChange(history[historyIndex + 1]);
    }
  };

  const handleLinkInsert = () => {
    const linkMarkdown = `[${linkText}](${linkURL})`;
    insertText(linkMarkdown);
    setOpenLinkDialog(false);
    setLinkText("");
    setLinkURL("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <Box
      sx={{
        // maxWidth: "600px",
        mx: "auto",
        mt: 2,
        bgcolor: "#fff",
        color: "#02306B",
        borderRadius: "8px",
        p: 2,
      }}
    >
      <Tabs
        value={mode}
        onChange={(_e, newValue) => setMode(newValue)}
        textColor="inherit"
        TabIndicatorProps={{ style: { backgroundColor: "#ffffff" } }}
        aria-label="Markdown editor tabs"
      >
        <Tab label="Write" value="write" />
        <Tab label="Preview" value="preview" />
      </Tabs>

      {mode === "write" && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Tooltip title="Bold">
              <IconButton onClick={() => insertText("**", "")}>
                <FormatBold style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton onClick={() => insertText("_", "")}>
                <FormatItalic style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Code">
              <IconButton onClick={() => insertText("`", "")}>
                <Code style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Link">
              <IconButton onClick={() => setOpenLinkDialog(true)}>
                <Link style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bulleted List">
              <IconButton onClick={() => insertText("- ", "", "list")}>
                <FormatListBulleted style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Numbered List">
              <IconButton onClick={() => insertText("1. ", "", "list")}>
                <FormatListNumbered style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            {/* <Tooltip title="Image"> */}
            {/* <IconButton >
                <Image style={{ color: "#02306B" }} />
                <input type="file" hidden onChange={handleFileChange} />
              </IconButton> */}
            <Button
              variant="contained"
              component="label"
              sx={{
                mt: 1,
                color: "#fff",
                bgcolor: "#02306B",
                ":hover": { bgcolor: "#666" },
              }}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload File"}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {/* </Tooltip> */}
            <Tooltip title="Undo">
              <IconButton onClick={handleUndo}>
                <Undo style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton onClick={handleRedo}>
                <Redo style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
          </Box>

          <TextareaAutosize
            placeholder={placeholder}
            value={markdownText}
            onChange={handleInputChange}
            disabled={disabled}
            minRows={5}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #555",
              outline: "none",
              resize: "vertical",
              minHeight: minHeight || "15px",
            }}
          />
        </>
      )}

      {mode === "preview" && (
        <Box
          sx={{
            p: 2,
            border: "1px solid #555",
            borderRadius: "8px",
            minHeight: minHeight || "150px",
            color: "#000",
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdownText}
          </ReactMarkdown>
        </Box>
      )}

      {/* Link dialog */}
      <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)}>
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Link Text"
            type="text"
            fullWidth
            variant="standard"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
          <TextField
            margin="dense"
            label="URL"
            type="url"
            fullWidth
            variant="standard"
            value={linkURL}
            onChange={(e) => setLinkURL(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
          <Button onClick={handleLinkInsert}>Insert</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomMarkdownEditor;
