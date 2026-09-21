import { Box, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { BlockType } from "../../../../../types/blocks";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";

const SectionHeaderBlock = ({
  page,
  setPage,
  element,
  index,
}: {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
}) => {
  useEffect(() => {
    handlePositionChange(index + 1, element.randomId);
  }, [index]);

  const updateBlock = (newBlock: BlockType) => {
    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((block) =>
        block.randomId === newBlock.randomId ? newBlock : block
      );
      return { ...prev, blocks: updatedBlocks };
    });
  };

  const handlePositionChange = (position: number, randomId: string | null | undefined) => {
    const foundBlock = page.blocks.find((block) => block.randomId === randomId);
    if (foundBlock) {
      updateBlock({ ...foundBlock, position });
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography variant="h5">Section Header</Typography>
        <ActionButtons block={element} setPage={setPage} />
      </Box>
      <Box sx={{ display: "grid", gap: "0.75rem" }}>
        <TextField
          label="Heading"
          value={element.title || ""}
          onChange={(e) => updateBlock({ ...element, title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Subheading"
          value={element.caption || ""}
          onChange={(e) => updateBlock({ ...element, caption: e.target.value })}
          fullWidth
          multiline
          rows={2}
        />
        <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
          <TextField
            label="Action label"
            value={element.content || ""}
            onChange={(e) => updateBlock({ ...element, content: e.target.value })}
            fullWidth
          />
          <TextField
            label="Action link"
            value={element.link || ""}
            onChange={(e) => updateBlock({ ...element, link: e.target.value })}
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SectionHeaderBlock;
