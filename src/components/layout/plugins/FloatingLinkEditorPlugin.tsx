import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $createTextNode,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { mergeRegister } from "@lexical/utils";
import { Box, IconButton, TextField, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const FloatingLinkEditorPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const floatingElemRef = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const positionEditorElement = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorElement = editor.getRootElement();
    
    if (editorElement && floatingElemRef.current) {
      const editorRect = editorElement.getBoundingClientRect();
      const floatingElemRect = floatingElemRef.current.getBoundingClientRect();
      
      // Position below the link with some spacing
      let top = rect.bottom - editorRect.top + 8;
      let left = rect.left - editorRect.left;
      
      // Adjust if it goes off the right edge
      if (left + floatingElemRect.width > editorRect.width) {
        left = editorRect.width - floatingElemRect.width - 10;
      }
      
      // Adjust if it goes off the left edge
      if (left < 0) {
        left = 10;
      }
      
      setPosition({ top, left });
    }
  }, [editor]);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
        setLinkText(parent.getTextContent());
        setIsLink(true);
        setTimeout(positionEditorElement, 0);
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
        setLinkText(node.getTextContent());
        setIsLink(true);
        setTimeout(positionEditorElement, 0);
      } else {
        setIsLink(false);
      }
    }
  }, [positionEditorElement]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isEditMode) {
            setIsEditMode(false);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateLinkEditor, isEditMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLink) {
        positionEditorElement();
      }
    };

    const handleResize = () => {
      if (isLink) {
        positionEditorElement();
      }
    };

    const editorElement = editor.getRootElement();
    const scrollableParent = editorElement?.closest('[style*="overflow"]');
    
    window.addEventListener('resize', handleResize);
    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollableParent) {
        scrollableParent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [editor, isLink, positionEditorElement]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = selection.anchor.getNode();
        const parent = node.getParent();
        const linkNode = $isLinkNode(parent) ? parent : $isLinkNode(node) ? node : null;
        
        if (linkNode) {
          // Update URL
          linkNode.setURL(linkUrl);
          
          // Update text content by replacing children
          const children = linkNode.getChildren();
          if (children.length > 0) {
            // Remove all children and add new text node
            children.forEach(child => child.remove());
            const textNode = $createTextNode(linkText);
            linkNode.append(textNode);
          }
        }
      }
    });
    setIsEditMode(false);
  };

  const handleCancel = () => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
    setIsEditMode(false);
  };

  const handleRemove = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsLink(false);
    setIsEditMode(false);
  };

  const handleVisit = () => {
    window.open(linkUrl, "_blank");
  };

  if (!isLink) return null;

  return (
    <Box
      ref={floatingElemRef}
      sx={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        display: "flex",
        alignItems: "center",
        gap: 1,
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderRadius: "8px",
        padding: "8px 12px",
        zIndex: 1000,
        minWidth: isEditMode ? "400px" : "auto",
      }}
    >
      {isEditMode ? (
        <>
          <TextField
            size="small"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Link text"
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="URL"
            sx={{ flex: 1 }}
          />
          <Tooltip title="Save">
            <IconButton size="small" onClick={handleSave} color="primary">
              <CheckIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton size="small" onClick={handleCancel}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Box
            component="a"
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "#1a73e8",
              textDecoration: "none",
              fontSize: "14px",
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {linkUrl}
          </Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Open in new tab">
            <IconButton size="small" onClick={handleVisit}>
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove link">
            <IconButton size="small" onClick={handleRemove} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
};

export default FloatingLinkEditorPlugin;
