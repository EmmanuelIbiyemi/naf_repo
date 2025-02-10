import { Box, IconButton, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { useDeletePostBlockMutation } from "../../../../store/api/posts.api";
import { useAppDispatch } from "../../../../store/hooks";
import { BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";
import DeleteIcon from "../../../../assets/deleteIcon";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { setBuilderLoading } from "../../../../store/app.slice";

type ActionProp = {
  block: BlockType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

export const ActionButtons = ({ block, setPage }: ActionProp) => {
  const dispatch = useAppDispatch();
  const [deleteBlock] = useDeletePostBlockMutation();

  const handleDelete = async (block_id: number) => {
    dispatch(setBuilderLoading(true));
    try {
      await deleteBlock(block_id).unwrap();
      setPage((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((block) => block.id !== block_id),
      }));
    } catch (error) {
      console.log(error);
    }
    dispatch(setBuilderLoading(false));
  };

  const moveBlock = (direction: 'up' | 'down') => {
    setPage((prev) => {
      const blocks = [...prev.blocks];
      const index = blocks.indexOf(block);

      if (direction === 'up' && index > 0) {
        [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index + 1], blocks[index]] = [blocks[index], blocks[index + 1]];
      }

      return {
        ...prev,
        blocks,
      };
    });
  };

  const handleTypeChange = (e: SelectChangeEvent) => {
    const newType = e.target.value;
    setPage((prev) => {
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
    <Box sx={{ display: "flex", gap: ".3rem", alignItems: "center" }}>
      <Select
        value={block.type}
        onChange={handleTypeChange}
        displayEmpty
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="heading">Heading</MenuItem>
        <MenuItem value="subheading">Subheading</MenuItem>
        <MenuItem value="text">Text</MenuItem>
        <MenuItem value="image">Image</MenuItem>
        <MenuItem value="video">Video</MenuItem>
        <MenuItem value="map">Map</MenuItem>
        <MenuItem value="banner">Banner</MenuItem>
        <MenuItem value="link page">Link Page</MenuItem>
        <MenuItem value="link url">Link URL</MenuItem>
        <MenuItem value="button link">Button Link</MenuItem>
        <MenuItem value="link social">Link Social</MenuItem>
        <MenuItem value="contacts">Contacts</MenuItem>
        <MenuItem value="left card">Left Card</MenuItem>
        <MenuItem value="right card">Right Card</MenuItem>
        <MenuItem value="post carousel">Post Carousel</MenuItem>
        <MenuItem value="post cards">Post Cards</MenuItem>
        <MenuItem value="margin">Margin</MenuItem>
      </Select>
      <IconButton onClick={() => moveBlock('up')} className="move_up_btn">
        <ArrowUpwardIcon />
      </IconButton>
      <IconButton onClick={() => moveBlock('down')} className="move_down_btn">
        <ArrowDownwardIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(block.id)} className="delete_btn">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
