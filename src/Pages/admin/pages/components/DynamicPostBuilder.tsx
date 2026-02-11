import {
  Box,
  Button,
  IconButton,
  SxProps,
  Typography,
} from "@mui/material";
import { ArrowDownward, ArrowUpward, DragIndicator } from "@mui/icons-material";
import { BlockSettings, BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";
import { useMemo, useState } from "react";
import { useDeletePostBlockMutation } from "../../../../store/api/posts.api";
import { useAppDispatch } from "../../../../store/hooks";
import { setBuilderLoading } from "../../../../store/app.slice";
import DeleteIcon from "../../../../assets/deleteIcon";
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
import RichTextBlock from "./postblocks/RichText";
import GalleryBlock from "./postblocks/Gallery";
import FeatureGridBlock from "./postblocks/FeatureGrid";
import AccordionBlock from "./postblocks/Accordion";
import MapBlock from "./postblocks/MapBlock";
import ResultSearchBlock from "./postblocks/ResultSearch";
import HeroSpotlightBlock from "./postblocks/HeroSpotlight";
import SectionHeaderBlock from "./postblocks/SectionHeader";
import CtaStripBlock from "./postblocks/CtaStrip";
import CalloutPanelBlock from "./postblocks/CalloutPanel";
import MediaCarouselBlock from "./postblocks/MediaCarousel";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  selectedBlockId?: string | null;
  onSelectBlock?: (block: BlockType) => void;
  onReorder?: (blocks: BlockType[]) => void;
};

const PageBuilder = ({
  page,
  setPage,
  selectedBlockId,
  onSelectBlock,
  onReorder,
}: Props) => {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [deleteBlock] = useDeletePostBlockMutation();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const displayEl = (
    element: BlockType,
    index: number,
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>
  ) => {
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
        el =<MediaBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "map":
        el =<MapBlock page={page} setPage={setPage} element={element} index={index}/>
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
      case "rich text":
        el =<RichTextBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "gallery":
        el =<GalleryBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "feature grid":
        el =<FeatureGridBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "accordion":
        el =<AccordionBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "margin":
        el =<MarginBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "result search":
        el =<ResultSearchBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "hero spotlight":
        el =<HeroSpotlightBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "section header":
        el =<SectionHeaderBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "cta strip":
        el =<CtaStripBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "callout panel":
        el =<CalloutPanelBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "media carousel":
        el =<MediaCarouselBlock page={page} setPage={setPage} element={element} index={index}/>
        break
      case "row":
        el = (
          <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: '4px', textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
            <Typography variant="caption" color="text.secondary">Empty Row Block</Typography>
          </Box>
        )
        break
    }

    return (
      <Box
        key={`element-${element.randomId || element.id || index}`}
        className="element"
        sx={element.randomId === selectedBlockId ? selectedBlockStyles : undefined}
        onClick={() => onSelectBlock?.(element)}
      >
        <Box sx={dragHandleStyles} {...dragHandleProps}>
          <DragIndicator fontSize="small" />
        </Box>
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

  const getColumnWidthFraction = (value?: BlockSettings["columnWidth"]) => {
    switch (value) {
      case "1/3":
        return 1 / 3;
      case "2/3":
        return 2 / 3;
      case "1/4":
        return 1 / 4;
      case "3/4":
        return 3 / 4;
      case "1/2":
      default:
        return 1 / 2;
    }
  };

  const getRowWidthUsed = (blocks: BlockType[], rowId: string, excludeId?: string | null) =>
    blocks.reduce((total, block) => {
      if (block.settings?.layout !== "row" || block.settings?.rowId !== rowId) return total;
      if (excludeId && block.randomId === excludeId) return total;
      return total + getColumnWidthFraction(block.settings?.columnWidth);
    }, 0);

  const canAddRowBlock = (
    blocks: BlockType[],
    rowId: string,
    columnWidth: BlockSettings["columnWidth"]
  ) => {
    const used = getRowWidthUsed(blocks, rowId);
    return used + getColumnWidthFraction(columnWidth) <= 1;
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
      if (!canAddRowBlock(prev.blocks, rowId, "1/2")) return prev;
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
      const sourceRowId = sourceBlock.settings?.rowId;
      const sourceIsInTargetRow =
        sourceBlock.settings?.layout === "row" && sourceRowId === targetRowId;
      if (!sourceIsInTargetRow) {
        const used = getRowWidthUsed(blocks, targetRowId);
        const incoming = getColumnWidthFraction(sourceBlock.settings?.columnWidth);
        if (used + incoming > 1) {
          return prev;
        }
      }

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

  const handleDeleteRowBlock = async (block: BlockType) => {
    dispatch(setBuilderLoading(true));
    try {
      if (block.id) {
        await deleteBlock(block.id).unwrap();
      }
      setPage((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((b) =>
          block.id ? b.id !== block.id : b.randomId !== block.randomId
        ),
      }));
    } catch (error) {
      console.log(error);
    }
    dispatch(setBuilderLoading(false));
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

  const blockGroups = useMemo(() => {
    const groups: {
      id: string;
      type: "row" | "block";
      blocks: BlockType[];
      startIndex: number;
      endIndex: number;
      rowId?: string;
    }[] = [];

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

        groups.push({
          id: `row-${rowId}`,
          type: "row",
          blocks: rowBlocks,
          startIndex: i,
          endIndex: j - 1,
          rowId,
        });

        i = j - 1;
        continue;
      }

      const blockId = block.randomId || (block.id ? `id-${block.id}` : `index-${i}`);
      groups.push({
        id: `block-${blockId}`,
        type: "block",
        blocks: [block],
        startIndex: i,
        endIndex: i,
      });
    }

    return groups;
  }, [page.blocks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = blockGroups.findIndex((group) => group.id === active.id);
    const newIndex = blockGroups.findIndex((group) => group.id === over.id);

    if (oldIndex < 0 || newIndex < 0) return;

    const reorderedGroups = arrayMove(blockGroups, oldIndex, newIndex);
    const reorderedBlocks = reorderedGroups.flatMap((group) => group.blocks);
    const normalizedBlocks = reorderedBlocks.map((block, index) => ({
      ...block,
      position: index + 1,
    }));

    setPage((prev) => ({ ...prev, blocks: normalizedBlocks }));
    onReorder?.(normalizedBlocks);
  };

  const renderedBlocks = blockGroups.map((group) => (
    <SortableItem key={group.id} id={group.id}>
      {({ attributes, listeners }) => {
        if (group.type === "row" && group.rowId) {
          const rowId = group.rowId;
          const canAdd = canAddRowBlock(group.blocks, rowId, "1/2");
          return (
            <Box sx={rowWrapperStyles}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Box sx={dragHandleStyles} {...attributes} {...listeners}>
                    <DragIndicator fontSize="small" />
                  </Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Row: {rowId}
                  </Typography>
                </Box>
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
                    disabled={!canAdd}
                    title={canAdd ? "Add block" : "Row is full"}
                    onClick={() => handleAddBlockToRow(rowId, group.endIndex + 1)}
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
                {group.blocks.map((rowBlock, rowIndex) => {
                  const percent = getColumnWidthPercent(rowBlock.settings?.columnWidth);
                  return (
                    <Box
                      key={`row-item-${rowBlock.randomId || rowBlock.id || rowIndex}`}
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
                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ textTransform: "capitalize", flex: 1, minWidth: 0 }}
                          >
                            {rowBlock.type === "row" ? "Empty Column" : rowBlock.type}
                          </Typography>
                          <IconButton
                            size="small"
                            className="delete_btn"
                            sx={{ alignSelf: "flex-start" }}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteRowBlock(rowBlock);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
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
        }

        const block = group.blocks[0];
        return displayEl(block, group.startIndex, { ...attributes, ...listeners });
      }}
    </SortableItem>
  ));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={blockGroups.map((group) => group.id)} strategy={verticalListSortingStrategy}>
        <Box sx={formBuilderStyles}>{renderedBlocks}</Box>
      </SortableContext>
    </DndContext>
  );
}

  
export default PageBuilder;

type SortableItemProps = {
  id: string;
  children: (props: {
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown>;
    isDragging: boolean;
  }) => React.ReactNode;
};

const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style}>
      {children({ attributes: (attributes as unknown) as Record<string, unknown>, listeners: listeners || {}, isDragging })}
    </Box>
  );
};

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

const dragHandleStyles: SxProps = {
  alignItems: "center",
  color: "rgba(148, 163, 184, 1)",
  cursor: "grab",
  display: "flex",
  paddingRight: "0.25rem",
  "&:active": { cursor: "grabbing" },
};
