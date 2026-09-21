import { useCallback, useEffect, useState } from "react";
import { Box, IconButton, Divider, Select, MenuItem, Tooltip } from "@mui/material";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
} from "lexical";
import {
  $createHeadingNode,
  $isHeadingNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ImageIcon from "@mui/icons-material/Image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useRef } from "react";
import { $createLinkNode } from "@lexical/link";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";

interface ToolbarPluginProps {
  onImageUpload?: (file: File) => Promise<string>;
  onFileUpload?: (file: File) => Promise<{ url: string; name: string }>;
}

const ToolbarPlugin = ({ onImageUpload, onFileUpload }: ToolbarPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = element;
          const type = parentList.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const handleBlockTypeChange = (value: string) => {
    if (value === "paragraph") {
      formatParagraph();
    } else if (value.startsWith("h")) {
      formatHeading(value as HeadingTagType);
    } else if (value === "bullet") {
      formatBulletList();
    } else if (value === "number") {
      formatNumberedList();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      try {
        const imageUrl = await onImageUpload(file);
        // Insert image into editor
        editor.update(() => {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            altText: file.name,
            src: imageUrl,
          });
        });
        if (imageInputRef.current) {
          imageInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      try {
        const { url, name } = await onFileUpload(file);
        // Insert file as link in editor
        editor.update(() => {
          const linkNode = $createLinkNode(url);
          const textNode = $createTextNode(name);
          linkNode.append(textNode);
          
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([linkNode]);
          } else {
            // If no selection, insert at the root
            const root = $getRoot();
            const paragraph = $createParagraphNode();
            paragraph.append(linkNode);
            root.append(paragraph);
          }
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('File upload failed:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        padding: "8px 16px",
        flexWrap: "wrap",
      }}
    >
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      <Tooltip title="Undo">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          sx={{ color: "#444746" }}
        >
          <UndoIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton
          size="small"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          sx={{ color: "#444746" }}
        >
          <RedoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Select
        value={blockType}
        onChange={(e) => handleBlockTypeChange(e.target.value)}
        size="small"
        sx={{
          minWidth: 150,
          fontSize: "14px",
          "& .MuiSelect-select": {
            paddingY: "4px",
          },
        }}
      >
        <MenuItem value="paragraph">Normal text</MenuItem>
        <MenuItem value="h1">Heading 1</MenuItem>
        <MenuItem value="h2">Heading 2</MenuItem>
        <MenuItem value="h3">Heading 3</MenuItem>
      </Select>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Tooltip title="Bold">
        <IconButton
          size="small"
          onClick={() => formatText("bold")}
          sx={{
            color: isBold ? "#1a73e8" : "#444746",
            backgroundColor: isBold ? "rgba(26, 115, 232, 0.1)" : "transparent",
          }}
        >
          <FormatBoldIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          size="small"
          onClick={() => formatText("italic")}
          sx={{
            color: isItalic ? "#1a73e8" : "#444746",
            backgroundColor: isItalic ? "rgba(26, 115, 232, 0.1)" : "transparent",
          }}
        >
          <FormatItalicIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Underline">
        <IconButton
          size="small"
          onClick={() => formatText("underline")}
          sx={{
            color: isUnderline ? "#1a73e8" : "#444746",
            backgroundColor: isUnderline
              ? "rgba(26, 115, 232, 0.1)"
              : "transparent",
          }}
        >
          <FormatUnderlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Tooltip title="Insert image">
        <IconButton
          size="small"
          onClick={() => imageInputRef.current?.click()}
          sx={{ color: "#444746" }}
        >
          <ImageIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Attach file">
        <IconButton
          size="small"
          onClick={() => fileInputRef.current?.click()}
          sx={{ color: "#444746" }}
        >
          <AttachFileIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <Tooltip title="Bulleted list">
        <IconButton
          size="small"
          onClick={formatBulletList}
          sx={{ color: "#444746" }}
        >
          <FormatListBulletedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered list">
        <IconButton
          size="small"
          onClick={formatNumberedList}
          sx={{ color: "#444746" }}
        >
          <FormatListNumberedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToolbarPlugin;
