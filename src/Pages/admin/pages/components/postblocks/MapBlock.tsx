import {
    Box,
    SxProps,
    Typography,
    TextField,
    FormControl,
  } from "@mui/material";
  import { BlockType } from "../../../../../types/blocks";
  import { ChangeEvent } from "react";
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
  
  const MapBlock = ({ page, setPage, element }: Props) => {
  
      // Removed position update based on index to avoid conflict with move operations
  
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

    const handleAddressChange = (
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

    const extractMapUrl = (input: string): string => {
        // If it's already a clean URL, return it
        if (input.startsWith('http') && !input.includes('<iframe')) {
            return input;
        }
        
        // Try to extract URL from iframe embed code
        const srcMatch = input.match(/src=["']([^"']+)["']/);
        if (srcMatch && srcMatch[1]) {
            return srcMatch[1];
        }
        
        // Return original input if no pattern matches
        return input;
    };

    const handleMapUrlChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        randomId: string | null | undefined
    ) => {
        const foundBlock = page.blocks.find((block) => block.randomId === randomId);
        if (foundBlock) {
            const extractedUrl = extractMapUrl(e.target.value);
            const newBlock: BlockType = {
                ...foundBlock,
                link: extractedUrl,
            };
            updateBlock(newBlock);
        }
    };
      
    return (
      <>

          <Box sx={mapContainer}>
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
                    gap: "1rem",
                }}
            >
                <TextField
                    label="Address"
                    defaultValue={element.content}
                    multiline
                    rows={2}
                    onBlur={(e) => handleAddressChange(e, element.randomId)}
                />
                <TextField
                    label="Map Embed URL"
                    defaultValue={element.link}
                    multiline
                    rows={3}
                    onBlur={(e) => handleMapUrlChange(e, element.randomId)}
                    helperText="Paste the entire Google Maps embed code (from Share → Embed a map) or just the URL"
                />
                <Box sx={mapPreview}>
                    {element.link ? (
                        <iframe
                            src={element.link}
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            loading="lazy"
                            title="Location Map"
                        />
                    ) : (
                        <Box sx={placeholderStyle}>
                            <Typography>Enter a map URL to preview</Typography>
                        </Box>
                    )}
                </Box>
            </FormControl>
        </Box>
          </>
          );
    };

    const mapContainer: SxProps = {
        padding: "1rem",
    };
    
    const mapPreview: SxProps = {
        width: "100%",
        height: "300px",
        backgroundColor: "rgba(204, 204, 204, 0.3)",
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
    };
    
    const placeholderStyle: SxProps = {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
    };

  export default MapBlock;
