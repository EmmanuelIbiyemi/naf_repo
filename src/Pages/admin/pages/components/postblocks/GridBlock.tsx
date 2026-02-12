import {
  Box,
  Button,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { BlockType } from "../../../../../types/blocks";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from "../ActionButtons";
import { Add, Delete } from "@mui/icons-material";

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
  onSelectBlock?: (block: BlockType) => void;
  renderBlock?: (block: BlockType, columnIndex: number, blockIndex: number) => React.ReactNode;
};

const GridBlock = ({ setPage, element, onSelectBlock }: Props) => {

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
            <Box
              key={columnIndex}
              sx={{
                border: "2px dashed rgba(0,0,0,0.1)",
                borderRadius: "8px",
                padding: "1rem",
                minHeight: "150px",
                backgroundColor: "rgba(0,0,0,0.01)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                  Column {columnIndex + 1}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => handleAddBlock(columnIndex)}
                >
                  Add Block
                </Button>
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
                    onClick={() => onSelectBlock?.(block)}
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
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default GridBlock;
