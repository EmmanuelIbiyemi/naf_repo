import {
    Box,
    FormControl,
    TextField,
    Typography,
  } from "@mui/material";
  import { BlockType } from "../../../../../types/blocks";
  import { ChangeEvent, useEffect } from "react";
  import { PostType } from "../../../../../types/posts";
  import { ActionButtons } from ".././ActionButtons";
  
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
  
  const TextBlock = ({ page, setPage, element, index }: Props) => {

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
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
  
    return (<Box key={`element-${element.id + index}`} className="element">
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
              <FormControl fullWidth>
                <TextField
                  label=""
                  defaultValue={element.content}
                  rows={8}
                  multiline={true}
                  onBlur={(e) => handleContentChange(e, element.randomId)}
                />
              </FormControl>
            </Box>
            </Box>
          );
    };

  export default TextBlock;