import {
  Box,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { BlockType } from "../../../../../types/blocks";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from "../ActionButtons";
import { Add, Delete, Close } from "@mui/icons-material";
import BlockEditorPanel from "../BlockEditorPanel";

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
  onSelectBlock?: (block: BlockType) => void;
  renderBlock?: (block: BlockType, columnIndex: number, blockIndex: number) => React.ReactNode;
};

type ActiveGridPath = {
  columnIndex: number;
  blockIndex: number;
};

type GridDragPayload = {
  gridId: string;
  columnIndex: number;
  blockIndex: number;
};

type GridColumnSlotProps = {
  id: string;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
};

const GridColumnSlot = ({ id, onDrop, children }: GridColumnSlotProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        border: "2px dashed rgba(0,0,0,0.1)",
        borderRadius: "8px",
        padding: "1rem",
        minHeight: "150px",
        backgroundColor: isOver ? "rgba(43, 135, 251, 0.08)" : "rgba(0,0,0,0.01)",
        borderColor: isOver ? "rgba(43, 135, 251, 1)" : "rgba(0,0,0,0.1)",
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={onDrop}
    >
      {children}
    </Box>
  );
};

const GridBlock = ({ page, setPage, element, onSelectBlock }: Props) => {
  const [activePath, setActivePath] = useState<ActiveGridPath | null>(null);
  const gridId = element.randomId ?? (element.id ? String(element.id) : "grid");

  // Initialize columns if they don't exist
  if (!element.columns || element.columns.length === 0) {
    element.columns = [{ blocks: [] }];
  }

  const handleColumnCountChange = (count: 1 | 2) => {
    const updatedBlock: BlockType = {
      ...element,
      settings: {
        ...(element.settings || {}),
        gridColumns: count,
      },
      columns: count === 1 
        ? [{ blocks: [...(element.columns?.[0]?.blocks || []), ...(element.columns?.[1]?.blocks || [])] }]
        : element.columns?.length === 1
        ? [element.columns[0], { blocks: [] }]
        : element.columns || [{ blocks: [] }, { blocks: [] }],
    };

    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((block) =>
        block.randomId === element.randomId ? updatedBlock : block
      );
      return { ...prev, blocks: updatedBlocks };
    });
  };

  const handleAddBlock = (columnIndex: number, blockType: string = "text") => {
    const newBlock: BlockType = {
      id: 0,
      randomId: Math.random().toString(36).substring(2, 15),
      content: "",
      type: blockType,
      caption: "",
      link: "",
      media: [],
      position: 0,
      title: "",
    };

    const updatedColumns = [...(element.columns || [])];
    if (!updatedColumns[columnIndex]) {
      updatedColumns[columnIndex] = { blocks: [] };
    }
    updatedColumns[columnIndex] = {
      blocks: [...updatedColumns[columnIndex].blocks, newBlock],
    };

    const updatedBlock: BlockType = {
      ...element,
      columns: updatedColumns,
    };

    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((block) =>
        block.randomId === element.randomId ? updatedBlock : block
      );
      return { ...prev, blocks: updatedBlocks };
    });
  };

  const handleDropBlock = (
    event: React.DragEvent<HTMLDivElement>,
    columnIndex: number,
    targetBlockIndex?: number
  ) => {
    event.preventDefault();
    const draggedId =
      event.dataTransfer.getData("application/x-naf-block-id") ||
      event.dataTransfer.getData("text/plain");
    const gridPayloadRaw = event.dataTransfer.getData("application/x-naf-grid-block");
    const gridPayload: GridDragPayload | null = gridPayloadRaw
      ? JSON.parse(gridPayloadRaw)
      : null;

    if (gridPayload && gridPayload.gridId === gridId) {
      setPage((prev) => {
        if (!prev) return prev;
        const gridIndex = prev.blocks.findIndex((block) => block.randomId === element.randomId);
        if (gridIndex === -1) return prev;
        const currentGrid = prev.blocks[gridIndex];
        const updatedColumns = [...(currentGrid.columns || [])];
        const sourceColumn = updatedColumns[gridPayload.columnIndex];
        if (!sourceColumn) return prev;
        const movingBlock = sourceColumn.blocks[gridPayload.blockIndex];
        if (!movingBlock) return prev;

        updatedColumns[gridPayload.columnIndex] = {
          blocks: sourceColumn.blocks.filter((_, idx) => idx !== gridPayload.blockIndex),
        };

        if (!updatedColumns[columnIndex]) {
          updatedColumns[columnIndex] = { blocks: [] };
        }

        const targetBlocks = [...updatedColumns[columnIndex].blocks];
        let insertIndex =
          typeof targetBlockIndex === "number" ? targetBlockIndex : targetBlocks.length;
        if (gridPayload.columnIndex === columnIndex && gridPayload.blockIndex < insertIndex) {
          insertIndex -= 1;
        }
        targetBlocks.splice(insertIndex, 0, movingBlock);
        updatedColumns[columnIndex] = { blocks: targetBlocks };

        const updatedGrid: BlockType = {
          ...currentGrid,
          columns: updatedColumns,
        };

        const updatedBlocks = prev.blocks.map((block) =>
          block.randomId === updatedGrid.randomId ? updatedGrid : block
        );

        return { ...prev, blocks: updatedBlocks };
      });
      return;
    }

    if (!draggedId) return;

    setPage((prev) => {
      if (!prev) return prev;
      const gridIndex = prev.blocks.findIndex((block) => block.randomId === element.randomId);
      if (gridIndex === -1) return prev;
      const draggedIndex = prev.blocks.findIndex((block) => {
        const id = block.randomId ?? (block.id ? String(block.id) : null);
        return id === draggedId;
      });
      if (draggedIndex === -1) return prev;

      const draggedBlock = prev.blocks[draggedIndex];
      if (draggedBlock.randomId === element.randomId) return prev;

      const currentGrid = prev.blocks[gridIndex];
      const updatedColumns = [...(currentGrid.columns || [])];
      if (!updatedColumns[columnIndex]) {
        updatedColumns[columnIndex] = { blocks: [] };
      }

      const nextSettings = { ...(draggedBlock.settings || {}) };
      if (nextSettings.layout === "row") {
        delete nextSettings.layout;
        delete nextSettings.rowId;
        delete nextSettings.columnWidth;
      }
      nextSettings.columnIndex = columnIndex;

      const nestedBlock: BlockType = {
        ...draggedBlock,
        settings: nextSettings,
      };

      updatedColumns[columnIndex] = {
        blocks: [...updatedColumns[columnIndex].blocks, nestedBlock],
      };

      const updatedGrid: BlockType = {
        ...currentGrid,
        columns: updatedColumns,
      };

      const remainingBlocks = prev.blocks.filter((_, idx) => idx !== draggedIndex);
      const updatedBlocks = remainingBlocks.map((block) =>
        block.randomId === updatedGrid.randomId ? updatedGrid : block
      );

      return { ...prev, blocks: updatedBlocks };
    });
  };

  const handleRemoveBlock = (columnIndex: number, blockIndex: number) => {
    const updatedColumns = [...(element.columns || [])];
    updatedColumns[columnIndex] = {
      blocks: updatedColumns[columnIndex].blocks.filter((_, idx) => idx !== blockIndex),
    };

    const updatedBlock: BlockType = {
      ...element,
      columns: updatedColumns,
    };

    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((block) =>
        block.randomId === element.randomId ? updatedBlock : block
      );
      return { ...prev, blocks: updatedBlocks };
    });
  };

  const columnCount = element.settings?.gridColumns || 1;
  const gridBlocks = useMemo(
    () => element.columns?.flatMap((column) => column.blocks) || [],
    [element.columns]
  );

  const activeBlock = useMemo(() => {
    if (!activePath) return null;
    return element.columns?.[activePath.columnIndex]?.blocks?.[activePath.blockIndex] || null;
  }, [activePath, element.columns]);

  useEffect(() => {
    if (activePath && !activeBlock) {
      setActivePath(null);
    }
  }, [activePath, activeBlock]);

  const handleOpenEditor = (columnIndex: number, blockIndex: number) => {
    setActivePath({ columnIndex, blockIndex });
    onSelectBlock?.(element);
  };

  const handleCloseEditor = () => setActivePath(null);

  const gridPage: PostType = useMemo(
    () => ({
      ...page,
      blocks: gridBlocks,
    }),
    [page, gridBlocks]
  );

  const setGridPage: React.Dispatch<React.SetStateAction<PostType>> = (nextState) => {
    setPage((prev) => {
      if (!prev) return prev;
      const currentGridBlock =
        prev.blocks.find((block) => block.randomId === element.randomId) || element;
      const currentGridBlocks =
        currentGridBlock?.columns?.flatMap((column) => column.blocks) || [];
      const baseGridPage: PostType = { ...prev, blocks: currentGridBlocks };
      const resolvedNext =
        typeof nextState === "function" ? nextState(baseGridPage) : nextState;
      const updatedBlocks = resolvedNext?.blocks || [];
      const updatedById = new Map<string, BlockType>();
      updatedBlocks.forEach((block) => {
        const key = block.randomId ?? block.id;
        if (key !== null && key !== undefined) {
          updatedById.set(String(key), block);
        }
      });

      const updatedColumns = (currentGridBlock.columns || []).map((column) => ({
        ...column,
        blocks: column.blocks.map((block) => {
          const key = block.randomId ?? block.id;
          const updated = key !== null && key !== undefined ? updatedById.get(String(key)) : null;
          return updated || block;
        }),
      }));

      const updatedBlock: BlockType = {
        ...currentGridBlock,
        columns: updatedColumns,
      };

      const updatedPageBlocks = prev.blocks.map((block) =>
        block.randomId === element.randomId ? updatedBlock : block
      );

      return { ...prev, blocks: updatedPageBlocks };
    });
  };

  return (
    <Box sx={{ width: "100%" }} className="element">
      <Box sx={{ padding: "1rem", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Grid Layout
          </Typography>
          <ActionButtons block={element} setPage={setPage} />
        </Box>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ mb: 0.5 }}>
            Number of Columns
          </Typography>
          <Select
            value={columnCount}
            onChange={(e) => handleColumnCountChange(e.target.value as 1 | 2)}
          >
            <MenuItem value={1}>1 Column</MenuItem>
            <MenuItem value={2}>2 Columns</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: columnCount === 2 ? "1fr 1fr" : "1fr",
          gap: "1rem",
          padding: "1rem",
          minHeight: "200px",
        }}
      >
        {Array.from({ length: columnCount }, (_, columnIndex) => {
          const columnBlocks = element.columns?.[columnIndex]?.blocks || [];
          return (
            <GridColumnSlot
              key={columnIndex}
              id={`grid-column:${gridId}:${columnIndex}`}
              onDrop={(event) => handleDropBlock(event, columnIndex)}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Column {columnIndex + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleAddBlock(columnIndex)}
                >
                  <Add fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem", mt: 2 }}>
                {columnBlocks.map((block, blockIndex) => (
                  <Box
                    key={block.randomId || blockIndex}
                    sx={{
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "rgba(43, 135, 251, 1)",
                      },
                    }}
                    draggable
                    onDragStart={(event) => {
                      const payload: GridDragPayload = {
                        gridId,
                        columnIndex,
                        blockIndex,
                      };
                      event.dataTransfer.setData(
                        "application/x-naf-grid-block",
                        JSON.stringify(payload)
                      );
                      event.dataTransfer.setData("text/plain", `grid:${gridId}`);
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    onDragOver={(event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleDropBlock(event, columnIndex, blockIndex);
                    }}
                    onClick={() => handleOpenEditor(columnIndex, blockIndex)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="body2" sx={{ textTransform: "capitalize", fontWeight: 500 }}>
                        {block.type}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBlock(columnIndex, blockIndex);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    {block.title && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        {block.title}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              {columnBlocks.length === 0 && (
                <Box
                  sx={{
                    textAlign: "center",
                    color: "text.secondary",
                    py: 3,
                  }}
                >
                  <Typography variant="caption">Empty column - click "Add Block" to add content</Typography>
                </Box>
              )}
            </GridColumnSlot>
          );
        })}
      </Box>
      <Dialog
        open={Boolean(activePath && activeBlock)}
        onClose={handleCloseEditor}
        fullWidth
        maxWidth="md"
        scroll="paper"
        PaperProps={{
          sx: {
            maxHeight: "90vh",
          },
        }}
      >
        <DialogContent
          dividers
          sx={{
            display: "grid",
            gap: "1rem",
            ".move_up_btn, .move_down_btn, .delete_btn": { display: "none" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Edit Grid Block: {activeBlock?.type}
            </Typography>
            <IconButton onClick={handleCloseEditor} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>
          {activeBlock ? (
            <BlockEditorPanel
              block={activeBlock}
              index={activePath?.blockIndex ?? 0}
              page={gridPage}
              setPage={setGridPage}
              showAppearance
              disableApiSync
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GridBlock;
