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
import { useGetPostByCategoryQuery } from "../../../../../store/api/posts.api";
  
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
  
  const LinkPageBlock = ({ page, setPage, element, index }: Props) => {

    const { data: pages } = useGetPostByCategoryQuery({
      tag: "page",
      page: 1,
      per_page: 1000,
    });

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
  
    const handleTitleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      randomId: string | null | undefined
    ) => {
      const foundBlock = page.blocks.find((block) => block.randomId === randomId);
      if (foundBlock) {
        const newBlock: BlockType = {
          ...foundBlock,
          title: e.target.value,
        };
        updateBlock(newBlock);
      }
    };
  
    const handlePageChange = (
      e: SelectChangeEvent<string>, 
      randomId: string | null | undefined
    ) => {
      const foundBlock = page.blocks.find((block) => block.randomId === randomId);
      if (foundBlock) {
  
        const newBlock: BlockType = {
          ...foundBlock,
          link: e.target.value
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

    const selectedPageValue = (() => {
      if (!element.link) return "";
      const matchingPage = pages?.post?.find(
        (post) => post.slug === element.link || post.title === element.link
      );
      return matchingPage?.slug || element.link;
    })();

    const pagesElements =
    pages?.post
      ?.filter((post) => Boolean(post.slug))
      .map((page) => (
        <MenuItem key={`page-${page.id}`} value={page.slug || ""}>
          {capitalizeText(page.title)}
        </MenuItem>
      )) || [];
  pagesElements.push(
    <MenuItem value={"e-learning"}>Portal</MenuItem>,
    <MenuItem value={"apply"}>Apply</MenuItem>
  );
  
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
          <label style={{ marginBottom: ".4rem" }}>Name</label>
          <TextField
            label=""
            defaultValue={element.title}
            onBlur={(e) => handleTitleChange(e, element.randomId)}
          />
        </FormControl>
        <FormControl fullWidth>
          <label style={{ marginBottom: ".4rem" }}>Page</label>
          <Select
            value={selectedPageValue}
            onChange={(e) => handlePageChange(e, element.randomId)}
          >
            {pagesElements}
          </Select>
        </FormControl>
      </Box>
    </Box>
          );
    };

  export default LinkPageBlock;
