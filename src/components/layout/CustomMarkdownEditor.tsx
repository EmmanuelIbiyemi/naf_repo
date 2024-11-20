import {
  Box,
  Button,
  IconButton,
  TextareaAutosize,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FormatBold,
  FormatItalic,
  Code,
  Undo,
  Redo,
} from "@mui/icons-material";

type Props = {
  placeholder: string;
  value: string;
  minHeight?: string;
  onChange: (markdown: string) => void;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleImageUpload: (file: File) => any;
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
            🗂️ Click to download file: {children || href}
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

  const [markdownText, setMarkdownText] = useState(value || "");
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [history, setHistory] = useState<string[]>([markdownText]);
  const [historyIndex, setHistoryIndex] = useState(0);
  // const [openLinkDialog, setOpenLinkDialog] = useState(false);
  // const [linkText, setLinkText] = useState("");
  // const [linkURL, setLinkURL] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [lastCursorPosition, setLastCursorPosition] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setMarkdownText(newText);
    onChange(newText);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newText]);
    setHistoryIndex((prev) => prev + 1);
  };

  const handleCursorChange = () => {
    if (textAreaRef.current) {
      setLastCursorPosition(textAreaRef.current.selectionStart);
    }
  };

  const insertText = (
    tag: string,
    placeholder: string = ""
    // type: "list" | "text" = "text"
  ) => {
    if (!textAreaRef.current) return;

    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const beforeText = markdownText.substring(0, start);
    const afterText = markdownText.substring(end);
    const selectedText = markdownText.substring(start, end);

    let updatedText;
    let newCursorPosition;

    if (selectedText.startsWith(tag) && selectedText.endsWith(tag)) {
      updatedText = `${beforeText}${selectedText.slice(
        tag.length,
        -tag.length
      )}${afterText}`;
      newCursorPosition = start;
    } else {
      if (selectedText) {
        updatedText = `${beforeText}${tag}${selectedText}${tag}${afterText}`;
        newCursorPosition =
          start + tag.length + selectedText.length + tag.length;
      } else {
        updatedText = `${beforeText}${tag}${placeholder}${tag}${afterText}`;
        newCursorPosition = start + tag.length + placeholder.length;
      }
    }

    setMarkdownText(updatedText);
    onChange(updatedText);

    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.selectionStart = newCursorPosition;
        textAreaRef.current.selectionEnd = newCursorPosition;
        textAreaRef.current.focus();
      }
    }, 0);
  };

  const handleImageInsert = async (file: File) => {
    if (!textAreaRef.current) return;

    try {
      const imageData = await handleImageUpload(file);

      const fileName = imageData[0]; // File name
      const fileURL = imageData[1]; // File URL

      const isImage = fileURL.match(/\.(jpg|jpeg|png|gif|svg)$/i);
      const isVideo = fileURL.match(/\.(mp4|webm|ogg)$/i);

      let markdownSyntax;

      if (isImage) {
        markdownSyntax = `![${fileName}](${fileURL})`;
      } else if (isVideo) {
        markdownSyntax = `[${fileName}](${fileURL})`;
      } else {
        markdownSyntax = `[${fileName}](${fileURL})`;
      }

      const updatedText = `${markdownText.slice(
        0,
        lastCursorPosition
      )}${markdownSyntax}${markdownText.slice(lastCursorPosition)}`;

      setMarkdownText(updatedText);
      onChange(updatedText);

      setTimeout(() => {
        if (textAreaRef.current) {
          const newCursorPos = lastCursorPosition + markdownSyntax.length;
          textAreaRef.current.selectionStart = newCursorPos;
          textAreaRef.current.selectionEnd = newCursorPos;
          textAreaRef.current.focus();
        }
      }, 0);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Box
      sx={{
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
              {isLoading ? "Uploading..." : "Upload file"}
              <input
                type="file"
                hidden
                onChange={(e) =>
                  e.target.files && handleImageInsert(e.target.files[0])
                }
              />
            </Button>
            <Tooltip title="Undo">
              <IconButton
                onClick={() => setHistoryIndex((prev) => Math.max(prev - 1, 0))}
              >
                <Undo style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton
                onClick={() =>
                  setHistoryIndex((prev) =>
                    Math.min(prev + 1, history.length - 1)
                  )
                }
              >
                <Redo style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
          </Box>

          <TextareaAutosize
            ref={textAreaRef}
            placeholder={placeholder}
            value={markdownText}
            onChange={handleInputChange}
            onKeyUp={handleCursorChange}
            onClick={handleCursorChange}
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
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {markdownText}
          </ReactMarkdown>
        </Box>
      )}
    </Box>
  );
};

export default CustomMarkdownEditor;
