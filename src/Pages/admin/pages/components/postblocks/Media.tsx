import {
    Box,
    Dialog,
    IconButton,
    SxProps,
    Typography,
  } from "@mui/material";
  import { BlockType } from "../../../../../types/blocks";
  import { useEffect, useState } from "react";
  import { PostCreateType, PostType } from "../../../../../types/posts";
  import { ActionButtons } from ".././ActionButtons";
import { MediaType } from "../../../../../types/media";
import { Close, CloudUploadOutlined } from "@mui/icons-material";
import MediaLibraryModal from "../../../media/MediaLibraryModal";
import { useUpdatePostMutation } from "../../../../../store/api/posts.api";
  
  const capitalizeText = (text: string) => {
    const allTexts = text.split(" ");
    return allTexts.map((t) => t[0].toUpperCase() + t.substring(1)).join(" ");
  };
  
  
  type Props = {
    page: PostType;
    setPage: React.Dispatch<React.SetStateAction<PostType>>;
    element: BlockType,
    index: number;
    disableApiSync?: boolean;
  };

  type Media = {
      media: MediaType | null;
      type: string;
      modal: boolean;
    };
  
  const MediaBlock = ({ page, setPage, element, index, disableApiSync = false }: Props) => {

    const [updatePost] = useUpdatePostMutation();

    const [activeBlock, setActiveBlock] = useState<BlockType>();
    const [media, setMediaData] = useState<Media>({
      media: null,
      type: element.type == "map"? "image" : element.type,
      modal: false,
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

      const handleOpenModal = (type: string) => {
            setMediaData((prev) => ({ ...prev, modal: true, type }));
          };
        
      const handleCloseModal = () =>
        setMediaData((prev) => ({ ...prev, modal: false }));
    
      const handleOpenMediaSelect = (block: BlockType, type: string) => {
        setActiveBlock(block);
        handleOpenModal(type);
      };
      
      const handleSelectImage = async (media: MediaType, blockId: number) => {
            if (page) {
              try {
                const blocks = page.blocks.map((b) => {
                  if (b.id === blockId)
                    return {
                      ...b,
                      media: [{ id: media.id }],
                    };
                  return b;
                });

                setPage((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    blocks: prev.blocks.map((b) =>
                      b.id === blockId ? { ...b, media: [media] } : b
                    ),
                  };
                });

                if (!disableApiSync) {
                  const payload: PostCreateType = {
                    ...page,
                    blocks: blocks,
                    categories: page.categories?.map((cat) => cat.name),
                    tags: page.tags?.map((cat) => cat.name),
                  };

                  updatePost(payload).unwrap();
                }
              } catch (error) {
                console.log(error);
              }
              handleCloseModal();
            }
          };
  
    return (
      <>
      <Dialog
          open={media.modal}
          onClose={handleCloseModal}
          scroll="body"
          sx={{
            ".MuiPaper-root": { maxWidth: "100% !important" },
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              width: "min(100vw, 1000px)",
            }}
          >
            <Box sx={{ padding: "1rem 1rem 0 0", textAlign: "end" }}>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </Box>
            <MediaLibraryModal
              key="modal-2"
              selectMedia={(media) =>
                handleSelectImage(media, activeBlock?.id as number)
              }
              mediaType={media.type}
            />
          </Box>
        </Dialog>

          <Box sx={imageEl}>
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
            <Box
              id={`element-${element.id}`}
              className="image_el dashed_border"
              onClick={() => handleOpenMediaSelect(element, element.type == "map"? "image":element.type)}
            >
              {element.media?.length && (element.media[0] as MediaType)?.url ? (
                <Box
                  className="hide_scrollbar"
                  sx={{
                    display: "flex",
                    gap: "10px",
                    height: "100%",
                    maxWidth: "550px",
                    overflow: "auto",
                    ">div": {
                      flexShrink: "0",
                      height: "100%",
                      width: "100px",
                    },
                  }}
                >
                  {element.media?.map((m) => (
                    <Box className="has_bg_image" key={`media-${m?.id}`}>
                      {element.type === "image" || element.type === "map" ? (
                        <img
                          className="bg"
                          src={(m as MediaType).url}
                          alt={(m as MediaType).name}
                        />
                      ) : (
                        <video>
                          <source src={(m as MediaType).url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    width: "100%",
                  }}
                >
                  <CloudUploadOutlined /> Drag and drop your {element.type} here or
                  browse
                </Box>
              )}
            </Box>
          </Box>
          </>
          );
    };

    const imageEl: SxProps = {
      alignItems: "center",
      padding: "1rem",
    
      ".image_el": {
        alignItems: "center",
        backgroundColor: "rgba(204, 204, 204, 0.3)",
        borderRadius: "var(--border-radius)",
        cursor: "pointer",
        display: "flex",
        gap: "1rem",
        height: "100px",
        padding: "1rem",
      },
    };
    

  export default MediaBlock;
