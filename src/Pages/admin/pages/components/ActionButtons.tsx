import { Box, IconButton } from "@mui/material";
import { useDeletePostBlockMutation } from "../../../../store/api/posts.api";
import { BlockType } from "../../../../types/blocks";
import { PostType } from "../../../../types/posts";
import DeleteIcon from "../../../../assets/deleteIcon";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type ActionProp = {
  block: BlockType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

export const ActionButtons = ({ block, setPage }: ActionProp) => {
  const [deleteBlock] = useDeletePostBlockMutation();

  const handleDelete = async (block_id: number) => {
    setPage((prev) => ({
      ...prev,
      blocks: prev.blocks
        .filter((item) => item.id !== block_id)
        .map((item, index) => ({
          ...item,
          position: index + 1,
        })),
    }));

    try {
      await deleteBlock(block_id).unwrap();
    } catch (error) {
      console.error(error);
      setPage((prev) => {
        if (prev.blocks.some((item) => item.id === block_id)) return prev;

        const nextBlocks = [...prev.blocks];
        const insertIndex = Math.max(
          0,
          Math.min(nextBlocks.length, (block.position || 1) - 1)
        );

        nextBlocks.splice(insertIndex, 0, block);

        return {
          ...prev,
          blocks: nextBlocks.map((item, index) => ({
            ...item,
            position: index + 1,
          })),
        };
      });
    }
  };

  const handleDuplicate = () => {
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

      // Create a duplicate of the block
      const duplicatedBlock: BlockType = {
        ...block,
        id: 0, // Will be assigned by the backend when saved
        randomId: `temp_${Date.now()}_${Math.random()}`, // Generate unique temporary ID
        position: index + 2, // Position after the current block
      };

      // Insert the duplicated block after the current block
      blocks.splice(index + 1, 0, duplicatedBlock);

      // Update positions for all blocks
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
      <IconButton onClick={handleDuplicate} className="duplicate_btn" title="Duplicate block">
        <ContentCopyIcon />
      </IconButton>
      <IconButton onClick={() => handleDelete(block.id)} className="delete_btn" title="Delete block">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};
