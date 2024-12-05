import { Box, IconButton } from "@mui/material";
import { useDeletePostBlockMutation } from "../../../../store/api/posts.api";
import { useAppDispatch } from "../../../../store/hooks";
import { BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import DeleteIcon from "../../../../assets/deleteIcon";
import { setBuilderLoading } from "../../../../store/app.slice";

type ActionProp = {
  block: BlockType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

export const ActionButtons = ({ block, setPage }: ActionProp) => {
  const dispatch = useAppDispatch();
  const [deleteBlock] = useDeletePostBlockMutation();

  const handleMoveUp = (currentPos: number) => {
    if (currentPos <= 1) return; // Can't move up if already at top

    setPage((prev) => {
      const newBlocks = [...prev.blocks];

      const currentIndex = currentPos - 1; // Convert position to zero-based index
      if (newBlocks[currentIndex] && newBlocks[currentIndex - 1]) {
        // Swap blocks
        [newBlocks[currentIndex], newBlocks[currentIndex - 1]] = [
          newBlocks[currentIndex - 1],
          newBlocks[currentIndex],
        ];

        // Update positions accurately for all blocks
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index + 1,
        }));

        return { ...prev, blocks: updatedBlocks };
      }
      return prev;
    });
  };

  const handleMoveDown = (currentPos: number) => {
    setPage((prev) => {
      const newBlocks = [...prev.blocks];

      const currentIndex = currentPos - 1;
      if (newBlocks[currentIndex] && newBlocks[currentIndex + 1]) {
        // Swap blocks
        [newBlocks[currentIndex], newBlocks[currentIndex + 1]] = [
          newBlocks[currentIndex + 1],
          newBlocks[currentIndex],
        ];

        // Update positions accurately for all blocks
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index + 1,
        }));

        return { ...prev, blocks: updatedBlocks };
      }
      return prev;
    });
  };

  const handleDelete = async (block_id: number) => {
    dispatch(setBuilderLoading(true));
    try {
      await deleteBlock(block_id).unwrap();
    } catch (error) {
      console.log(error);
    }
    setPage((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== block_id),
    }));
    dispatch(setBuilderLoading(false));
  };

  return (
    <Box sx={{ display: "flex", gap: ".3rem" }}>
      <IconButton onClick={() => handleMoveUp(block.position)}>
        <ArrowUpward />
      </IconButton>
      <IconButton onClick={() => handleMoveDown(block.position)}>
        <ArrowDownward />
      </IconButton>
      <IconButton onClick={() => handleDelete(block.id)} className="delete_btn">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
