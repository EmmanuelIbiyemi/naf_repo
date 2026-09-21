import { useCallback, useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  TextNode,
} from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import CodeIcon from "@mui/icons-material/Code";
import ImageIcon from "@mui/icons-material/Image";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

interface SlashCommand {
  title: string;
  description: string;
  icon: JSX.Element;
  keywords: string[];
  onSelect: (editor: any) => void;
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <TitleIcon />,
    keywords: ["heading", "h1", "title"],
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h1"));
        }
      });
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <TitleIcon sx={{ fontSize: "20px" }} />,
    keywords: ["heading", "h2", "subtitle"],
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: <TitleIcon sx={{ fontSize: "18px" }} />,
    keywords: ["heading", "h3"],
    onSelect: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h3"));
        }
      });
    },
  },
  {
    title: "Bulleted List",
    description: "Create a bulleted list",
    icon: <FormatListBulletedIcon />,
    keywords: ["list", "bullet", "ul", "unordered"],
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    title: "Numbered List",
    description: "Create a numbered list",
    icon: <FormatListNumberedIcon />,
    keywords: ["list", "number", "ol", "ordered"],
    onSelect: (editor) => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    },
  },
  {
    title: "Quote",
    description: "Add a quote block",
    icon: <FormatQuoteIcon />,
    keywords: ["quote", "blockquote", "cite"],
    onSelect: () => {
      // Quote implementation would go here
    },
  },
  {
    title: "Code Block",
    description: "Insert a code block",
    icon: <CodeIcon />,
    keywords: ["code", "block", "snippet"],
    onSelect: () => {
      // Code block implementation would go here
    },
  },
  {
    title: "Image",
    description: "Upload an image",
    icon: <ImageIcon />,
    keywords: ["image", "picture", "photo", "upload"],
    onSelect: () => {
      // Image upload implementation would go here
    },
  },
];

const SlashCommandPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slashNode, setSlashNode] = useState<TextNode | null>(null);

  const filteredCommands = SLASH_COMMANDS.filter((command) => {
    const query = searchQuery.toLowerCase();
    return (
      command.title.toLowerCase().includes(query) ||
      command.keywords.some((keyword) => keyword.includes(query))
    );
  });

  const checkForSlashCommand = useCallback(() => {
    const selection = $getSelection();
    
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
      setShowMenu(false);
      return;
    }

    const anchor = selection.anchor;
    const node = anchor.getNode();
    
    if (node instanceof TextNode) {
      const text = node.getTextContent();
      const offset = anchor.offset;
      
      // Check if we just typed a slash
      const textBeforeCursor = text.slice(0, offset);
      const match = textBeforeCursor.match(/\/(\w*)$/);
      
      if (match) {
        const query = match[1];
        setSearchQuery(query);
        setSlashNode(node);
        
        // Get cursor position for menu placement
        const domSelection = window.getSelection();
        if (domSelection && domSelection.rangeCount > 0) {
          const range = domSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          setMenuPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          });
          setShowMenu(true);
          setSelectedIndex(0);
        }
      } else {
        setShowMenu(false);
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        checkForSlashCommand();
      });
    });
  }, [editor, checkForSlashCommand]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!showMenu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (event.key === "Enter") {
        event.preventDefault();
        selectCommand(filteredCommands[selectedIndex]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        setShowMenu(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showMenu, selectedIndex, filteredCommands]);

  const selectCommand = (command: SlashCommand) => {
    if (!slashNode) return;

    editor.update(() => {
      // Remove the slash and search text
      const text = slashNode.getTextContent();
      const slashIndex = text.lastIndexOf("/");
      
      if (slashIndex !== -1) {
        const beforeSlash = text.slice(0, slashIndex);
        const afterCursor = text.slice(slashNode.getTextContent().length);
        
        slashNode.setTextContent(beforeSlash + afterCursor);
      }
      
      // Execute the command
      command.onSelect(editor);
    });

    setShowMenu(false);
    setSearchQuery("");
    setSlashNode(null);
  };

  if (!showMenu || filteredCommands.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        top: menuPosition.top,
        left: menuPosition.left,
        zIndex: 1000,
        minWidth: 280,
        maxHeight: 400,
        overflow: "auto",
        borderRadius: "8px",
      }}
    >
      <Box sx={{ padding: "8px 12px", borderBottom: "1px solid #E8EAED" }}>
        <Typography variant="caption" sx={{ color: "#5F6368", fontWeight: 500 }}>
          Type to filter...
        </Typography>
      </Box>
      <List sx={{ padding: 0 }}>
        {filteredCommands.map((command, index) => (
          <ListItem key={command.title} disablePadding>
            <ListItemButton
              selected={index === selectedIndex}
              onClick={() => selectCommand(command)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#F1F3F4",
                },
                "&:hover": {
                  backgroundColor: "#F8F9FA",
                },
                padding: "12px 16px",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#5F6368" }}>
                {command.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {command.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: "#5F6368" }}>
                    {command.description}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SlashCommandPlugin;
