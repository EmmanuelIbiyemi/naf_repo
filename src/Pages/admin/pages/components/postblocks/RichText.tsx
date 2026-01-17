import { Box, Typography, IconButton, Divider, Tooltip } from "@mui/material";
import { BlockType } from "../../../../../types/blocks";
import { useEffect, useCallback, useState } from "react";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState, FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, FORMAT_ELEMENT_COMMAND, $getSelection, $isRangeSelection } from "lexical";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatClearIcon from "@mui/icons-material/FormatClear";

const capitalizeText = (text: string) => {
  const allTexts = text.split(" ");
  return allTexts.map((t) => t[0].toUpperCase() + t.substring(1)).join(" ");
};

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
};

const editorTheme = {
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
  },
  list: {
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listitem",
  },
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
  },
  link: "editor-link",
};

const RichTextBlock = ({ page, setPage, element, index }: Props) => {
  useEffect(() => {
    handlePositionChange(index + 1, element.randomId);
  }, [index]);

  const updateBlock = (newBlock: BlockType) => {
    setPage((prev) => {
      if (!prev) return prev;

      const updatedBlocks = prev.blocks.map((block) =>
        block.randomId === newBlock.randomId ? newBlock : block
      );

      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });
  };

  const handleContentChange = useCallback(
    (_editorState: EditorState, randomId: string | null | undefined) => {
      const json = JSON.stringify(_editorState.toJSON());
      const foundBlock = page.blocks.find((block) => block.randomId === randomId);
      if (foundBlock) {
        const newBlock: BlockType = {
          ...foundBlock,
          content: json,
        };
        updateBlock(newBlock);
      }
    },
    [page, updateBlock]
  );

  const handlePositionChange = (
    position: number,
    randomId: string | null | undefined
  ) => {
    const foundBlock = page.blocks.find((block) => block.randomId === randomId);
    if (foundBlock) {
      const newBlock: BlockType = {
        ...foundBlock,
        position: position,
      };
      updateBlock(newBlock);
    }
  };

  const getInitialEditorState = () => {
    if (!element.content || element.content.trim() === "") {
      return undefined;
    }
    
    try {
      JSON.parse(element.content);
      return element.content;
    } catch {
      return undefined;
    }
  };

  const initialConfig = {
    namespace: "RichTextBlockEditor",
    theme: editorTheme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      AutoLinkNode,
      LinkNode,
    ],
    editorState: getInitialEditorState(),
  };

  return (
    <Box key={`element-${element.id + index}`} className="element">
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <Typography variant="h5" id={`element-${element.id}`}>
            {capitalizeText(element.type)}
          </Typography>
          <ActionButtons block={element} setPage={setPage} />
        </Box>
        <Box
          sx={{
            border: "1px solid #D1D1D6",
            borderRadius: "8px",
            overflow: "hidden",
            minHeight: "400px",
            backgroundColor: "#fff",
          }}
        >
          <LexicalComposer initialConfig={initialConfig}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <ToolbarPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    style={{
                      outline: "none",
                      padding: "16px",
                      minHeight: "350px",
                      fontSize: "14px",
                      fontFamily: "Inter, sans-serif",
                      lineHeight: "1.6",
                      color: "#202124",
                    }}
                  />
                }
                placeholder={
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      padding: "16px",
                      color: "#80868B",
                      fontSize: "14px",
                      pointerEvents: "none",
                    }}
                  >
                    Enter your rich text content here...
                  </Box>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <OnChangePlugin 
                onChange={(editorState) => handleContentChange(editorState, element.randomId)} 
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <ListPlugin />
              <LinkPlugin />
            </Box>
          </LexicalComposer>
        </Box>
      </Box>
    </Box>
  );
};

export default RichTextBlock;

// Toolbar Component
const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      // Check formatting
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrike(selection.hasFormat("strikethrough"));
      }
    });
  }, [editor]);

  useEffect(() => {
    editor.registerUpdateListener(updateToolbar);
    return () => {
      // Cleanup if needed
    };
  }, [editor, updateToolbar]);

  const toolbarButtonStyle = {
    padding: "8px 12px",
    minWidth: "36px",
    height: "36px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
    "&.active": {
      backgroundColor: "#e3f2fd",
      color: "#1976d2",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: "4px",
        padding: "12px 16px",
        borderBottom: "1px solid #D1D1D6",
        backgroundColor: "#F5F5F7",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {/* Undo/Redo */}
      <Tooltip title="Undo (Ctrl+Z)">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          sx={toolbarButtonStyle}
        >
          <UndoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo (Ctrl+Y)">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          sx={toolbarButtonStyle}
        >
          <RedoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" sx={{ my: 1, mx: 0.5 }} />

      {/* Text Formatting */}
      <Tooltip title="Bold (Ctrl+B)">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          className={isBold ? "active" : ""}
          sx={toolbarButtonStyle}
        >
          <FormatBoldIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic (Ctrl+I)">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          className={isItalic ? "active" : ""}
          sx={toolbarButtonStyle}
        >
          <FormatItalicIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline (Ctrl+U)">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
          className={isUnderline ? "active" : ""}
          sx={toolbarButtonStyle}
        >
          <FormatUnderlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Strikethrough">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}
          className={isStrike ? "active" : ""}
          sx={toolbarButtonStyle}
        >
          <StrikethroughSIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Clear Formatting">
        <IconButton
          size="small"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
          sx={toolbarButtonStyle}
        >
          <FormatClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" sx={{ my: 1, mx: 0.5 }} />

      {/* Lists */}
      <Tooltip title="Bullet List">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          sx={toolbarButtonStyle}
        >
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered List">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          sx={toolbarButtonStyle}
        >
          <FormatListNumberedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" sx={{ my: 1, mx: 0.5 }} />

      {/* Text Alignment */}
      <Tooltip title="Align Left">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
          sx={toolbarButtonStyle}
        >
          <FormatAlignLeftIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Center">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
          sx={toolbarButtonStyle}
        >
          <FormatAlignCenterIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Align Right">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
          sx={toolbarButtonStyle}
        >
          <FormatAlignRightIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Justify">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")}
          sx={toolbarButtonStyle}
        >
          <FormatAlignJustifyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
