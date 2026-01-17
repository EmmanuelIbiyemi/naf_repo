import { Box, IconButton } from "@mui/material";
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
      const index = blocks.findIndex((item) => {
        if (block.randomId && item.randomId) {
          return item.randomId === block.randomId;
        }
        if (block.id && item.id) {
          return item.id === block.id;
        }
        return false;
      });

      if (index < 0) return prev;

      if (direction === 'up' && index > 0) {
        [blocks[index - 1], blocks[index]] = [blocks[index], blocks[index - 1]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index + 1], blocks[index]] = [blocks[index], blocks[index + 1]];
      }

      const updatedBlocks = blocks.map((item, positionIndex) => ({
        ...item,
        position: positionIndex + 1,
      }));

      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });
  };

  return (
    <Box sx={{ display: "flex", gap: ".3rem", alignItems: "center" }}>
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
