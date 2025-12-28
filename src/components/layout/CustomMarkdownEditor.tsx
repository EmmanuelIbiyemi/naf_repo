import {
  Box,
  Button,
  IconButton,
  TextareaAutosize,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  Menu,
  MenuItem,
  Typography,
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
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  Image as ImageIcon,
  TableChart,
  Title,
  StrikethroughS,
  CheckBox,
  HorizontalRule,
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
  const [headingAnchorEl, setHeadingAnchorEl] = useState<null | HTMLElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [lastCursorPosition, setLastCursorPosition] = useState<number>(0);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newHistoryIndex = historyIndex - 1;
      const previousText = history[newHistoryIndex];

      setHistoryIndex(newHistoryIndex);
      setMarkdownText(previousText);
      onChange(previousText);

      // Restore cursor position safely
      if (textAreaRef.current) {
        setTimeout(() => {
          textAreaRef.current!.selectionStart = lastCursorPosition;
          textAreaRef.current!.selectionEnd = lastCursorPosition;
          textAreaRef.current!.focus();
        }, 0);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newHistoryIndex = historyIndex + 1;
      const nextText = history[newHistoryIndex];

      setHistoryIndex(newHistoryIndex);
      setMarkdownText(nextText);
      onChange(nextText);

      // Restore cursor position safely
      if (textAreaRef.current) {
        setTimeout(() => {
          textAreaRef.current!.selectionStart = nextText.length;
          textAreaRef.current!.selectionEnd = nextText.length;
          textAreaRef.current!.focus();
        }, 0);
      }
    }
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const newText = e.target.value;
  //   setMarkdownText(newText);
  //   onChange(newText);

  //   // Only add to history if it's a new change
  //   if (newText !== history[historyIndex]) {
  //     const newHistory = [...history.slice(0, historyIndex + 1), newText];
  //     setHistory(newHistory);
  //     setHistoryIndex(newHistory.length - 1);
  //   }
  //   setHistory((prev) => [...prev.slice(0, historyIndex + 1), newText]);
  //   setHistoryIndex((prev) => prev + 1);
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;

    // Truncate history if making changes after undo
    const updatedHistory = history.slice(0, historyIndex + 1);

    setMarkdownText(newText);
    onChange(newText);

    setHistory([...updatedHistory, newText]);
    setHistoryIndex(updatedHistory.length);
  };

  const handleCursorChange = () => {
    if (textAreaRef.current) {
      setLastCursorPosition(textAreaRef.current.selectionStart);
    }
  };

  const insertText = (
    tag: string,
    placeholder: string = "",
    endTag?: string
  ) => {
    if (!textAreaRef.current) return;

    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const beforeText = markdownText.substring(0, start);
    const afterText = markdownText.substring(end);
    const selectedText = markdownText.substring(start, end);

    let updatedText;
    let newCursorPosition;

    const closingTag = endTag || tag;

    if (selectedText.startsWith(tag) && selectedText.endsWith(closingTag)) {
      updatedText = `${beforeText}${selectedText.slice(
        tag.length,
        -closingTag.length
      )}${afterText}`;
      newCursorPosition = start;
    } else {
      if (selectedText) {
        updatedText = `${beforeText}${tag}${selectedText}${closingTag}${afterText}`;
        newCursorPosition =
          start + tag.length + selectedText.length + closingTag.length;
      } else {
        updatedText = `${beforeText}${tag}${placeholder}${closingTag}${afterText}`;
        newCursorPosition = start + tag.length + placeholder.length;
      }
    }

    setMarkdownText(updatedText);
    onChange(updatedText);

    // Update history
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, updatedText]);
    setHistoryIndex(updatedHistory.length);

    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.selectionStart = newCursorPosition;
        textAreaRef.current.selectionEnd = newCursorPosition;
        textAreaRef.current.focus();
      }
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    if (!textAreaRef.current) return;

    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const beforeText = markdownText.substring(0, start);
    const afterText = markdownText.substring(end);
    const selectedText = markdownText.substring(start, end);

    // Find the start of the current line
    const lineStart = beforeText.lastIndexOf("\n") + 1;
    const lineText = markdownText.substring(lineStart, end);

    let updatedText;
    let newCursorPosition;

    if (selectedText.includes("\n")) {
      // Multiple lines selected
      const lines = selectedText.split("\n");
      const prefixedLines = lines.map((line) => `${prefix}${line}`).join("\n");
      updatedText = `${beforeText}${prefixedLines}${afterText}`;
      newCursorPosition = start + prefixedLines.length;
    } else if (lineText.startsWith(prefix)) {
      // Remove prefix if already exists
      const textBeforeLine = markdownText.substring(0, lineStart);
      const textAfterSelection = markdownText.substring(end);
      const unprefixedLine = lineText.substring(prefix.length);
      updatedText = `${textBeforeLine}${unprefixedLine}${textAfterSelection}`;
      newCursorPosition = start - prefix.length;
    } else {
      // Add prefix
      const textBeforeLine = markdownText.substring(0, lineStart);
      const textAfterSelection = markdownText.substring(end);
      updatedText = `${textBeforeLine}${prefix}${lineText}${textAfterSelection}`;
      newCursorPosition = start + prefix.length;
    }

    setMarkdownText(updatedText);
    onChange(updatedText);

    // Update history
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, updatedText]);
    setHistoryIndex(updatedHistory.length);

    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.selectionStart = newCursorPosition;
        textAreaRef.current.selectionEnd = newCursorPosition;
        textAreaRef.current.focus();
      }
    }, 0);
  };

  const insertLink = () => {
    const linkText = prompt("Enter link text:");
    if (!linkText) return;
    
    const linkUrl = prompt("Enter URL:");
    if (!linkUrl) return;

    insertText(`[${linkText}](`, "", linkUrl + ")");
  };

  const insertTable = () => {
    const rows = prompt("Enter number of rows:", "3");
    const cols = prompt("Enter number of columns:", "3");
    
    if (!rows || !cols) return;
    
    const numRows = parseInt(rows);
    const numCols = parseInt(cols);
    
    if (isNaN(numRows) || isNaN(numCols)) return;

    let table = "\n";
    // Header row
    table += "| " + Array(numCols).fill("Header").join(" | ") + " |\n";
    // Separator
    table += "| " + Array(numCols).fill("---").join(" | ") + " |\n";
    // Data rows
    for (let i = 0; i < numRows - 1; i++) {
      table += "| " + Array(numCols).fill("Cell").join(" | ") + " |\n";
    }
    table += "\n";

    if (!textAreaRef.current) return;
    const start = textAreaRef.current.selectionStart;
    const updatedText = `${markdownText.substring(0, start)}${table}${markdownText.substring(start)}`;
    
    setMarkdownText(updatedText);
    onChange(updatedText);

    // Update history
    const updatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...updatedHistory, updatedText]);
    setHistoryIndex(updatedHistory.length);
  };

  const insertHeading = (level: number) => {
    const prefix = "#".repeat(level) + " ";
    insertLinePrefix(prefix);
    setHeadingAnchorEl(null);
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
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.5, mb: 2, p: 1, bgcolor: "#F5F5F7", borderRadius: "8px" }}>
            {/* Heading Dropdown */}
            <Tooltip title="Headings">
              <IconButton 
                onClick={(e) => setHeadingAnchorEl(e.currentTarget)}
                size="small"
              >
                <Title style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={headingAnchorEl}
              open={Boolean(headingAnchorEl)}
              onClose={() => setHeadingAnchorEl(null)}
            >
              <MenuItem onClick={() => insertHeading(1)}>
                <Typography variant="h4">Heading 1</Typography>
              </MenuItem>
              <MenuItem onClick={() => insertHeading(2)}>
                <Typography variant="h5">Heading 2</Typography>
              </MenuItem>
              <MenuItem onClick={() => insertHeading(3)}>
                <Typography variant="h6">Heading 3</Typography>
              </MenuItem>
              <MenuItem onClick={() => insertHeading(4)}>
                <Typography variant="subtitle1">Heading 4</Typography>
              </MenuItem>
              <MenuItem onClick={() => insertHeading(5)}>
                <Typography variant="subtitle2">Heading 5</Typography>
              </MenuItem>
              <MenuItem onClick={() => insertHeading(6)}>
                <Typography variant="body2">Heading 6</Typography>
              </MenuItem>
            </Menu>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Text Formatting */}
            <Tooltip title="Bold (Ctrl+B)">
              <IconButton onClick={() => insertText("**", "bold text")} size="small">
                <FormatBold style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic (Ctrl+I)">
              <IconButton onClick={() => insertText("_", "italic text")} size="small">
                <FormatItalic style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Strikethrough">
              <IconButton onClick={() => insertText("~~", "strikethrough")} size="small">
                <StrikethroughS style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Inline Code">
              <IconButton onClick={() => insertText("`", "code")} size="small">
                <Code style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Lists */}
            <Tooltip title="Bullet List">
              <IconButton onClick={() => insertLinePrefix("- ")} size="small">
                <FormatListBulleted style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Numbered List">
              <IconButton onClick={() => insertLinePrefix("1. ")} size="small">
                <FormatListNumbered style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Task List">
              <IconButton onClick={() => insertLinePrefix("- [ ] ")} size="small">
                <CheckBox style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* Insert Elements */}
            <Tooltip title="Insert Link">
              <IconButton onClick={insertLink} size="small">
                <LinkIcon style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Quote">
              <IconButton onClick={() => insertLinePrefix("> ")} size="small">
                <FormatQuote style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Horizontal Rule">
              <IconButton onClick={() => insertText("\n---\n", "")} size="small">
                <HorizontalRule style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Insert Table">
              <IconButton onClick={insertTable} size="small">
                <TableChart style={{ color: "#02306B" }} />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* File Upload */}
            <Tooltip title="Upload Image/File">
              <Button
                variant="outlined"
                component="label"
                size="small"
                startIcon={<ImageIcon />}
                sx={{
                  color: "#02306B",
                  borderColor: "#02306B",
                  ":hover": { 
                    bgcolor: "#02306B10",
                    borderColor: "#02306B"
                  },
                  textTransform: "none",
                }}
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    e.target.files && handleImageInsert(e.target.files[0])
                  }
                />
              </Button>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            {/* History Controls */}
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <Tooltip title="Undo (Ctrl+Z)">
              <span>
                <IconButton onClick={handleUndo} disabled={historyIndex === 0} size="small">
                  <Undo
                    style={{ color: historyIndex === 0 ? "#aaa" : "#02306B" }}
                  />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Y)">
              <span>
                <IconButton
                  onClick={handleRedo}
                  disabled={historyIndex === history.length - 1}
                  size="small"
                >
                  <Redo
                    style={{
                      color:
                        historyIndex === history.length - 1 ? "#aaa" : "#02306B",
                    }}
                  />
                </IconButton>
              </span>
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
            minRows={15}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #D1D1D6",
              outline: "none",
              resize: "vertical",
              minHeight: minHeight || "400px",
              fontFamily: "'SF Mono', 'Monaco', 'Courier New', monospace",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          />
        </>
      )}

      {mode === "preview" && (
        <Box
          sx={{
            p: 3,
            border: "1px solid #D1D1D6",
            borderRadius: "8px",
            minHeight: minHeight || "400px",
            color: "#000",
            bgcolor: "#FAFAFA",
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              marginTop: "1.5em",
              marginBottom: "0.5em",
              fontWeight: 600,
            },
            "& p": {
              marginBottom: "1em",
              lineHeight: 1.7,
            },
            "& ul, & ol": {
              marginBottom: "1em",
              paddingLeft: "2em",
            },
            "& li": {
              marginBottom: "0.5em",
            },
            "& code": {
              backgroundColor: "#F5F5F7",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.9em",
              fontFamily: "'SF Mono', 'Monaco', 'Courier New', monospace",
            },
            "& pre": {
              backgroundColor: "#1E1E1E",
              color: "#D4D4D4",
              padding: "1em",
              borderRadius: "8px",
              overflow: "auto",
              marginBottom: "1em",
            },
            "& blockquote": {
              borderLeft: "4px solid #02306B",
              paddingLeft: "1em",
              marginLeft: 0,
              color: "#666",
              fontStyle: "italic",
            },
            "& table": {
              borderCollapse: "collapse",
              width: "100%",
              marginBottom: "1em",
            },
            "& th, & td": {
              border: "1px solid #D1D1D6",
              padding: "8px 12px",
              textAlign: "left",
            },
            "& th": {
              backgroundColor: "#F5F5F7",
              fontWeight: 600,
            },
            "& hr": {
              border: "none",
              borderTop: "2px solid #D1D1D6",
              margin: "2em 0",
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {markdownText || "*No content to preview*"}
          </ReactMarkdown>
        </Box>
      )}
    </Box>
  );
};

export default CustomMarkdownEditor;
