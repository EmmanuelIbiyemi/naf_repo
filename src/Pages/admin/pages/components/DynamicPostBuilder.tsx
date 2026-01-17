import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  SxProps,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";
import { useMemo, useState } from "react";
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
import BlockStyleFields from "./postblocks/BlockStyleFields";
import { ActionButtons } from "./ActionButtons";


type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

const PageBuilder = ({ page, setPage }: Props) => {
  const [editingRowBlockId, setEditingRowBlockId] = useState<string | null>(null);
  
  const displayEl = (element: BlockType, index: number) => {
    let el;
    const showStyleFields = element.type !== "margin";

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
      <Box key={`element-${element.id + index}`} className="element">
        {el}
        {showStyleFields ? (
          <BlockStyleFields block={element} blocks={page.blocks} setPage={setPage} />
        ) : null}
      </Box>
    );
  };

  const renderBlockEditor = (element: BlockType, index: number) => {
    let el;
    switch (element.type) {
      case "heading":
      case "subheading":
      case "link":
        el = <HeadingBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "text":
        el = <TextBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "image":
      case "video":
      case "map":
        el = <MediaBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "banner":
        el = <BannerBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "link page":
        el = <LinkPageBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "link url":
      case "button link":
        el = <LinkUrlBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "link social":
        el = <LinkSocialBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "dropdown":
        el = <DropdownBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "contacts":
        el = <ContactsBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "left card":
      case "right card":
        el = <CardBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "post carousel":
        el = <PostCarouselBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "post cards":
        el = <PostCardsBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      case "margin":
        el = <MarginBlock page={page} setPage={setPage} element={element} index={index} />;
        break;
      default:
        el = null;
    }

    return (
      <Box sx={{ display: "grid", gap: "1rem" }}>
        {el}
        <BlockStyleFields block={element} blocks={page.blocks} setPage={setPage} />
      </Box>
    );
  };

  const rowEditBlockData = useMemo(() => {
    if (!editingRowBlockId) return { block: null, index: -1 };
    const index = page.blocks.findIndex((block) => block.randomId === editingRowBlockId);
    return { block: index >= 0 ? page.blocks[index] : null, index };
  }, [editingRowBlockId, page.blocks]);
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
            <Button
              size="small"
              variant="outlined"
              onClick={() => handleAddBlockToRow(rowId, j)}
            >
              Add Block to Row
            </Button>
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
                  <Box sx={rowCardStyles}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                      <Typography variant="subtitle2" sx={{ textTransform: "capitalize" }}>
                        {rowBlock.type}
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        onClick={() => setEditingRowBlockId(rowBlock.randomId || null)}
                      >
                        Edit
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Width: {rowBlock.settings?.columnWidth || "1/2"}
                    </Typography>
                    <ActionButtons block={rowBlock} setPage={setPage} />
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

  return (
    <>
      <Box sx={formBuilderStyles}>{renderedBlocks}</Box>
      <Dialog
        open={Boolean(rowEditBlockData.block)}
        onClose={() => setEditingRowBlockId(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ textTransform: "capitalize" }}>
            {rowEditBlockData.block?.type} block
          </Typography>
          <IconButton onClick={() => setEditingRowBlockId(null)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {rowEditBlockData.block
            ? renderBlockEditor(rowEditBlockData.block, rowEditBlockData.index)
            : null}
        </DialogContent>
      </Dialog>
    </>
  );
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
};
