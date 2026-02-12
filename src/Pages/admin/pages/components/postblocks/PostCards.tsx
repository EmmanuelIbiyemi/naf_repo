import {
  Box,
  FormControl,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { BlockType } from "../../../../../types/blocks";
import { useEffect } from "react";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";
import { useGetPostCategoriesQuery } from "../../../../../store/api/posts.api";
  
  const capitalizeText = (text: string) => {
    const allTexts = text.split(" ");
    return allTexts.map((t) => t[0].toUpperCase() + t.substring(1)).join(" ");
  };
  
  
  type Props = {
    page: PostType;
    setPage: React.Dispatch<React.SetStateAction<PostType>>;
    element: BlockType,
    index: number
  };
  
  const PostCardsBlock = ({ page, setPage, element, index }: Props) => {

    const { data: categories } = useGetPostCategoriesQuery({
      page: 1,
      per_page: 1000
    })

    const categoryElements =
    categories?.categories.map((category) => (
      <MenuItem key={`page-${category.id}`} value={category.name}>
        {capitalizeText(category.name)}
      </MenuItem>
    )) || [];

    useEffect(()=>{
        handlePositionChange(index+1, element.randomId)
    }, [index])
  
    const updateBlock = (newBlock: BlockType) => {
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
    };
  
    const handleContentChange = (
      e: SelectChangeEvent<string>,
      randomId: string | null | undefined
    ) => {
      const foundBlock = page.blocks.find((block) => block.randomId === randomId);
      if (foundBlock) {
        const newBlock: BlockType = {
          ...foundBlock,
          content: e.target.value
        };
        updateBlock(newBlock);
      }
    };

    const handleTextChange = (
      field: keyof BlockType,
      value: string,
      randomId: string | null | undefined
    ) => {
      const foundBlock = page.blocks.find((block) => block.randomId === randomId);
      if (foundBlock) {
        const newBlock: BlockType = {
          ...foundBlock,
          [field]: value,
        };
        updateBlock(newBlock);
      }
    };

    const handlePositionChange = (
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
      };
  
    return (
            <Box>
              <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
              >
              <Typography variant="h5" id={`element-${element.id}`}>
                {capitalizeText(element.type)}
              </Typography>
              <ActionButtons block={element} setPage={setPage} />
              </Box>
              <FormControl
              fullWidth
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: ".4rem",
              }}
              >
                <TextField
                select
                label="Category"
                value={element.content}
                onChange={(e) => handleContentChange(e as SelectChangeEvent<string>, element.randomId)}
                >
                {categoryElements}
                </TextField>
                <TextField
                  label="Section title"
                  value={element.title || ""}
                  onChange={(e) => handleTextChange("title", e.target.value, element.randomId)}
                />
                <TextField
                  label="Section description"
                  value={element.description || ""}
                  onChange={(e) => handleTextChange("description", e.target.value, element.randomId)}
                  multiline
                  minRows={3}
                />
                <TextField
                  label="View all label"
                  value={element.caption || ""}
                  onChange={(e) => handleTextChange("caption", e.target.value, element.randomId)}
                  placeholder="View all"
                />
                <TextField
                  label="View all link"
                  value={element.link || ""}
                  onChange={(e) => handleTextChange("link", e.target.value, element.randomId)}
                  placeholder="Leave empty to link to the category page"
                />
              </FormControl>
            </Box>
          );
    };

  export default PostCardsBlock;
