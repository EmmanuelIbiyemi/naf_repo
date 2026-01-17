import {
  Box,
  Button,
  IconButton,
  SxProps,
  Typography,
} from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";
import { useState } from "react";
import HeadingBlock from "./postblocks/Heading";
import MediaBlock from "./postblocks/Media";
import BannerBlock from "./postblocks/Banner";
import CardBlock from "./postblocks/Card";
import TextBlock from "./postblocks/Text";
import LinkPageBlock from "./postblocks/LinkPage";
import LinkUrlBlock from "./postblocks/LinkUrl";
import LinkSocialBlock from "./postblocks/LinkSocial";
import ContactsBlock from "./postblocks/Contacts";
import PostCarouselBlock from "./postblocks/PostCarousel";
import PostCardsBlock from "./postblocks/PostCards";
import MarginBlock from "./postblocks/Margin";
import DropdownBlock from "./postblocks/Dropdown";

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  selectedBlockId?: string | null;
  onSelectBlock?: (block: BlockType) => void;
};

const PageBuilder = ({ page, setPage, selectedBlockId, onSelectBlock }: Props) => {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  
  const displayEl = (element: BlockType, index: number) => {
    let el;

    switch (element.type) {
      case "heading":
      case "subheading":
      case "link":
        el =<HeadingBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "text":
        el =<TextBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "image":
      case "video":
      case "map":
        el =<MediaBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "banner":
        el =<BannerBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "link page":
        el =<LinkPageBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "link url":
      case "button link":
        el =<LinkUrlBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "link social":
        el =<LinkSocialBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "dropdown":
        el =<DropdownBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "contacts":
        el =<ContactsBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "left card":
      case "right card":
        el =<CardBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "post carousel":
        el =<PostCarouselBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "post cards":
        el =<PostCardsBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "margin":
        el =<MarginBlock page={page} setPage={setPage} element={element} index={index}/>
        break
    }

    return (
      <Box
        key={`element-${element.id + index}`}
        className="element"
        sx={element.randomId === selectedBlockId ? selectedBlockStyles : undefined}
        onClick={() => onSelectBlock?.(element)}
      >
        {el}
      </Box>
    );
  };
  const getColumnWidthPercent = (value?: string) => {
    switch (value) {
      case "1/3":
        return 33.33;
      case "2/3":
        return 66.66;
      case "1/4":
        return 25;
      case "3/4":
        return 75;
      case "1/2":
      default:
        return 50;
    }
  };

  const createRowBlock = (rowId: string): BlockType => ({
    id: 0,
    randomId: Math.random().toString(36).substring(2, 15),
    content: "",
    type: "text",
    caption: "",
    link: "",
    media: [],
    position: page.blocks.length + 1,
    settings: {
      layout: "row",
      rowId,
      columnWidth: "1/2",
    },
    title: "",
  });

  const handleAddBlockToRow = (rowId: string, insertIndex: number) => {
    setPage((prev) => {
      if (!prev) return prev;
      const nextBlocks = [...prev.blocks];
      nextBlocks.splice(insertIndex, 0, createRowBlock(rowId));
      return {
        ...prev,
        blocks: nextBlocks,
      };
    });
  };

  const handleRowDragStart = (blockId?: string | null) => {
    if (!blockId) return;
    setDraggedBlockId(blockId);
  };

  const handleRowDrop = (targetRowId: string, targetBlockId?: string) => {
    if (!draggedBlockId) return;
    if (targetBlockId && targetBlockId === draggedBlockId) return;
    setPage((prev) => {
      if (!prev) return prev;
      const blocks = [...prev.blocks];
      const sourceIndex = blocks.findIndex((block) => block.randomId === draggedBlockId);
      if (sourceIndex === -1) return prev;
      const sourceBlock = blocks[sourceIndex];

      const updatedBlock: BlockType = {
        ...sourceBlock,
        settings: {
          ...(sourceBlock.settings || {}),
          layout: "row",
          rowId: targetRowId,
        },
      };

      blocks.splice(sourceIndex, 1);

      let insertIndex = blocks.length;
      if (targetBlockId) {
        const targetIndex = blocks.findIndex((block) => block.randomId === targetBlockId);
        if (targetIndex >= 0) {
          insertIndex = targetIndex;
        }
      } else {
        let lastIndex = -1;
        blocks.forEach((block, index) => {
          if (block.settings?.layout === "row" && block.settings?.rowId === targetRowId) {
            lastIndex = index;
          }
        });
        insertIndex = lastIndex >= 0 ? lastIndex + 1 : blocks.length;
      }

      blocks.splice(insertIndex, 0, updatedBlock);

      return { ...prev, blocks };
    });
    setDraggedBlockId(null);
  };

  const moveRowGroup = (rowId: string, direction: "up" | "down") => {
    setPage((prev) => {
      if (!prev) return prev;
      const blocks = [...prev.blocks];
      const startIndex = blocks.findIndex(
        (block) => block.settings?.layout === "row" && block.settings?.rowId === rowId
      );
      if (startIndex === -1) return prev;

      let endIndex = startIndex;
      while (
        endIndex + 1 < blocks.length &&
        blocks[endIndex + 1]?.settings?.layout === "row" &&
        blocks[endIndex + 1]?.settings?.rowId === rowId
      ) {
        endIndex += 1;
      }

      if (direction === "up" && startIndex === 0) return prev;
      if (direction === "down" && endIndex === blocks.length - 1) return prev;

      const beforeIndex = startIndex - 1;
      const afterIndex = endIndex + 1;

      if (direction === "up") {
        const prevRowId = blocks[beforeIndex]?.settings?.rowId;
        if (blocks[beforeIndex]?.settings?.layout === "row" && prevRowId) {
          let prevStart = beforeIndex;
          while (
            prevStart - 1 >= 0 &&
            blocks[prevStart - 1]?.settings?.layout === "row" &&
            blocks[prevStart - 1]?.settings?.rowId === prevRowId
          ) {
            prevStart -= 1;
          }
          const prevGroup = blocks.splice(prevStart, beforeIndex - prevStart + 1);
          const currentGroup = blocks.splice(startIndex - (beforeIndex - prevStart + 1), endIndex - startIndex + 1);
          blocks.splice(prevStart, 0, ...currentGroup, ...prevGroup);
        } else {
          const currentGroup = blocks.splice(startIndex, endIndex - startIndex + 1);
          blocks.splice(beforeIndex, 0, ...currentGroup);
        }
      }

      if (direction === "down") {
        const nextRowId = blocks[afterIndex]?.settings?.rowId;
        if (blocks[afterIndex]?.settings?.layout === "row" && nextRowId) {
          let nextEnd = afterIndex;
          while (
            nextEnd + 1 < blocks.length &&
            blocks[nextEnd + 1]?.settings?.layout === "row" &&
            blocks[nextEnd + 1]?.settings?.rowId === nextRowId
          ) {
            nextEnd += 1;
          }
          const currentGroup = blocks.splice(startIndex, endIndex - startIndex + 1);
          blocks.splice(nextEnd - (endIndex - startIndex + 1) + 1, 0, ...currentGroup);
        } else {
          const currentGroup = blocks.splice(startIndex, endIndex - startIndex + 1);
          blocks.splice(afterIndex - (endIndex - startIndex + 1) + 1, 0, ...currentGroup);
        }
      }

      return { ...prev, blocks };
    });
  };

  const renderedBlocks: React.ReactNode[] = [];
  for (let i = 0; i < page.blocks.length; i += 1) {
    const block = page.blocks[i];
    const layout = block?.settings?.layout;
    const rowId = block?.settings?.rowId;

    if (layout === "row" && rowId) {
      const rowBlocks = [block];
      let j = i + 1;
      while (
        j < page.blocks.length &&
        page.blocks[j]?.settings?.layout === "row" &&
        page.blocks[j]?.settings?.rowId === rowId
      ) {
        rowBlocks.push(page.blocks[j]);
        j += 1;
      }

      renderedBlocks.push(
        <Box key={`row-${rowId}-${i}`} sx={rowWrapperStyles}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Row: {rowId}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconButton
                size="small"
                onClick={() => moveRowGroup(rowId, "up")}
                aria-label="Move row up"
              >
                <ArrowUpward fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => moveRowGroup(rowId, "down")}
                aria-label="Move row down"
              >
                <ArrowDownward fontSize="small" />
              </IconButton>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleAddBlockToRow(rowId, j)}
              >
                Add Block
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridAutoFlow: { xs: "row", md: "column" },
              gridAutoColumns: { md: "minmax(220px, 1fr)" },
              overflowX: { md: "auto" },
              paddingBottom: { md: "0.5rem" },
              alignItems: "stretch",
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleRowDrop(rowId)}
          >
            {rowBlocks.map((rowBlock, rowIndex) => {
              const percent = getColumnWidthPercent(rowBlock.settings?.columnWidth);
              return (
                <Box
                  key={`row-item-${rowBlock.id || rowIndex}`}
                  sx={{
                    minWidth: { md: `${percent}%` },
                    maxWidth: { xs: "100%", md: `${percent}%` },
                  }}
                >
                  <Box
                    sx={{
                      ...rowCardStyles,
                      ...(rowBlock.randomId === selectedBlockId ? rowCardSelectedStyles : {}),
                    } as SxProps}
                    draggable
                    onDragStart={() => handleRowDragStart(rowBlock.randomId)}
                    onDragEnd={() => setDraggedBlockId(null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleRowDrop(rowId, rowBlock.randomId || undefined)}
                    onClick={() => onSelectBlock?.(rowBlock)}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                      <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                        {rowBlock.type}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Width: {rowBlock.settings?.columnWidth || "1/2"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      );

      i = j - 1;
      continue;
    }

    renderedBlocks.push(displayEl(block, i));
  }

  return <Box sx={formBuilderStyles}>{renderedBlocks}</Box>;
}

  
export default PageBuilder;

const formBuilderStyles: SxProps = {
  padding: "1.5rem 1rem",

  ".element": {
    border: "1px solid transparent",
    borderRadius: "var(--border-radius)",
    position: "relative",
    transition: ".3s",

    "&:hover": {
      borderColor: "rgba(43, 135, 251, 1)",
    },
    ">*": {
      flexShrink: 0,
      padding: ".7rem 1rem",
    },

    ".MuiIconButton-root": {
      bgcolor: "rgba(170, 170, 170, 1)",
      color: "#fff",
      height: "35px",
      padding: "8px",
      width: "35px",
    },
  },

  ".MuiIconButton-root.delete_btn": {
    bgcolor: "rgba(229, 72, 77, 1)",
  },
};

const rowWrapperStyles: SxProps = {
  border: "1px dashed rgba(43, 135, 251, 0.6)",
  borderRadius: "var(--border-radius)",
  display: "grid",
  gap: "0.75rem",
  marginBottom: "1rem",
  padding: "0.75rem",
};

const rowCardStyles: SxProps = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: "12px",
  display: "grid",
  gap: "0.5rem",
  padding: "0.75rem",
  backgroundColor: "#fff",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
  cursor: "grab",
};

const selectedBlockStyles: SxProps = {
  borderColor: "rgba(43, 135, 251, 1)",
  backgroundColor: "rgba(43, 135, 251, 0.04)",
};

const rowCardSelectedStyles: SxProps = {
  borderColor: "rgba(43, 135, 251, 1)",
  boxShadow: "0 0 0 1px rgba(43, 135, 251, 0.35)",
};
