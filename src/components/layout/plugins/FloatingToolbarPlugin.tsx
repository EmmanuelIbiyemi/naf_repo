import { useCallback, useEffect, useState } from "react";
import { IconButton, Divider, Tooltip, Popper, Paper } from "@mui/material";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import LinkIcon from "@mui/icons-material/Link";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";

interface FloatingToolbarPluginProps {
  anchorElem: HTMLElement;
}

const FloatingToolbarPlugin = ({ }: FloatingToolbarPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const [, ] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const isCollapsed = selection.isCollapsed();
      
      if (isCollapsed) {
        setShowToolbar(false);
        return;
      }

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      // Check if selection has a link
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      // Get selection coordinates
      const nativeSelection = window.getSelection();
      if (nativeSelection && nativeSelection.rangeCount > 0) {
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0) {
          // Create virtual element for Popper positioning
          const virtualElement = {
            getBoundingClientRect: () => rect,
          };
          setAnchorEl(virtualElement as unknown as HTMLElement);
          setShowToolbar(true);
        }
      }
    } else {
      setShowToolbar(false);
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        1
      )
    );
  }, [editor, updateToolbar]);

  const formatText = (format: "bold" | "italic" | "underline") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertLink = () => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  if (!showToolbar || !anchorEl) {
    return null;
  }

  return (
    <Popper
      open={showToolbar}
      anchorEl={anchorEl}
      placement="top"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 10],
          },
        },
        {
          name: "flip",
          enabled: true,
        },
        {
          name: "preventOverflow",
          enabled: true,
          options: {
            boundary: "viewport",
          },
        },
      ]}
      sx={{ zIndex: 1300 }}
    >
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "4px 8px",
          backgroundColor: "#202124",
          borderRadius: "8px",
          gap: 0.5,
        }}
      >
        <Tooltip title="Bold">
          <IconButton
            size="small"
            onClick={() => formatText("bold")}
            sx={{
              color: isBold ? "#8ab4f8" : "#fff",
              padding: "6px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
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
              color: isItalic ? "#8ab4f8" : "#fff",
              padding: "6px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
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
              color: isUnderline ? "#8ab4f8" : "#fff",
              padding: "6px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <FormatUnderlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ backgroundColor: "rgba(255,255,255,0.2)", mx: 0.5 }}
        />

        <Tooltip title={isLink ? "Remove link" : "Insert link"}>
          <IconButton
            size="small"
            onClick={insertLink}
            sx={{
              color: isLink ? "#8ab4f8" : "#fff",
              padding: "6px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Text color">
          <IconButton
            size="small"
            sx={{
              color: "#fff",
              padding: "6px",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <FormatColorTextIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Paper>
    </Popper>
  );
};

export default FloatingToolbarPlugin;
