import {
  Box,
  FormControl,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { BlockType } from "../../../../../types/blocks";
import { ChangeEvent, useEffect, useCallback } from "react";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from "../ActionButtons";

const capitalizeText = (text: string) => {
  return text.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
};

const MarginBlock = ({ page, setPage, element, index }: Props) => {

  useEffect(() => {
    handlePositionChange(index + 1, element.randomId);
  }, [index, element.randomId]);

  const updateBlock = useCallback((newBlock: BlockType) => {
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
  }, [setPage]);

  const handleContentChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    randomId: string | null | undefined
  ) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Ensure only digits are allowed
      const foundBlock = page.blocks.find((block) => block.randomId === randomId);
      if (foundBlock) {
        const newBlock: BlockType = {
          ...foundBlock,
          content: value
        };
        updateBlock(newBlock);
      }
    }
  }, [page.blocks, updateBlock]);

  const handlePositionChange = useCallback((
    position: number,
    randomId: string | null | undefined
  ) => {
    const foundBlock = page.blocks.find((block) => block.randomId === randomId);
    if (foundBlock) {
      const newBlock: BlockType = {
        ...foundBlock,
        position: position
      };
      updateBlock(newBlock);
    }
  }, [page.blocks, updateBlock]);

  return (
    <Box sx={{ padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "12px", boxShadow: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Typography variant="h5" id={`element-${element.id}`}>
          {capitalizeText(element.type)}
        </Typography>
        <ActionButtons block={element} setPage={setPage} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body1">Set Margin Value:</Typography>
        <FormControl variant="outlined" sx={{ flex: 1 }}>
          <TextField
        type="text"
        inputMode="numeric"
        value={element.content}
        onChange={(e) => handleContentChange(e, element.randomId)}
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">px</InputAdornment>,
          },
        }}
        fullWidth
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default MarginBlock;
