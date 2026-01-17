import { FormControl, MenuItem, Select, Typography, SelectChangeEvent } from "@mui/material";
import { elements } from "../elements/post-elements";
import { BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";

type Props = {
  block: BlockType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

const BlockTypeSelector = ({ block, setPage }: Props) => {
  const handleTypeChange = (event: SelectChangeEvent) => {
    const newType = event.target.value;
    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((b) =>
        b.randomId === block.randomId ? { ...b, type: newType } : b
      );
      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });
  };

  return (
    <FormControl fullWidth>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
        Block Type
      </Typography>
      <Select value={block.type} onChange={handleTypeChange} size="small">
        {elements.map((el) => (
          <MenuItem key={el.id} value={el.type}>
            {el.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BlockTypeSelector;
