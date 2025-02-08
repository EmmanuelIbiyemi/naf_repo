import {
    Box,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
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
  
  const ContactsBlock = ({ page, setPage, element, index }: Props) => {
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
          content: e.target.value,
        };
        updateBlock(newBlock);
      }
    };
  
    const handleIconChange = (
      e: SelectChangeEvent<string>, 
      randomId: string | null | undefined
    ) => {
      const foundBlock = page.blocks.find((block) => block.randomId === randomId);
      if (foundBlock) {
  
        const newBlock: BlockType = {
          ...foundBlock,
          title: e.target.value
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

    const socialElements = [
    <MenuItem value={"phone"}>Phone</MenuItem>,
    <MenuItem value={"whatsapp"}>WhatsApp</MenuItem>,
    <MenuItem value={"mail"}>Email</MenuItem>,
    <MenuItem value={"clock"}>Available Hour</MenuItem>,];
  
    return (<Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: ".2rem",
        }}
      >
        <Typography variant="h5" id={`element-${element.id}`}>
          {capitalizeText(element.type)}
        </Typography>
        <ActionButtons block={element} setPage={setPage} />
      </Box>
      <Box sx={{ display: "flex", gap: "1rem" }}>
      <FormControl fullWidth>
          <label style={{ marginBottom: ".4rem" }}>Icon</label>
          <Select
            value={element.title}
            onChange={(e) => handleIconChange(e, element.randomId)}
          >
            {socialElements}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <label style={{ marginBottom: ".4rem" }}>Content</label>
          <TextField
            label=""
            defaultValue={element.content}
            onBlur={(e) => handleContentChange(e, element.randomId)}
          />
        </FormControl>
      </Box>
    </Box>
          );
    };

  export default ContactsBlock;