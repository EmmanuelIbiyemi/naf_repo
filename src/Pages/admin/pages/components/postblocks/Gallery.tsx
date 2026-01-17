import {
  Box,
  Button,
  Dialog,
  IconButton,
  SxProps,
  Typography,
} from "@mui/material";
import { BlockType } from "../../../../../types/blocks";
import { useEffect, useState } from "react";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";
import { MediaType } from "../../../../../types/media";
import MediaLibraryModal from "../../../media/MediaLibraryModal";
import { Close } from "@mui/icons-material";

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
};

const GalleryBlock = ({ page, setPage, element, index }: Props) => {
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  useEffect(() => {
    handlePositionChange(index + 1, element.randomId);
  }, [index]);

  const updateBlock = (newBlock: BlockType) => {
    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((block) =>
        block.randomId === newBlock.randomId ? newBlock : block
      );
      return { ...prev, blocks: updatedBlocks };
    });
  };

  const handlePositionChange = (
    position: number,
    randomId: string | null | undefined
  ) => {
    const foundBlock = page.blocks.find((block) => block.randomId === randomId);
    if (foundBlock) {
      updateBlock({ ...foundBlock, position });
    }
  };

  const handleSelectImage = (media: MediaType) => {
    const existing = (element.media || []) as MediaType[];
    if (existing.find((item) => item.id === media.id)) {
      setMediaModalOpen(false);
      return;
    }
    const newMedia = [...existing, { id: media.id } as MediaType];
    updateBlock({ ...element, media: newMedia });
    setMediaModalOpen(false);
  };

  const handleRemoveMedia = (mediaId: number) => {
    const nextMedia = (element.media || []).filter((item) => item.id !== mediaId);
    updateBlock({ ...element, media: nextMedia });
  };

  return (
    <>
      <Dialog
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
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
            <IconButton onClick={() => setMediaModalOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <MediaLibraryModal
            key="modal-gallery"
            selectMedia={handleSelectImage}
            mediaType="image"
          />
        </Box>
      </Dialog>
      <Box key={`element-${element.id + index}`} className="element">
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <Typography variant="h5">Gallery</Typography>
          <ActionButtons block={element} setPage={setPage} />
        </Box>
        <Box sx={{ display: "grid", gap: "1rem" }}>
          <Button variant="outlined" onClick={() => setMediaModalOpen(true)}>
            Add Images
          </Button>
          <Box sx={galleryGridStyles}>
            {(element.media as MediaType[] | undefined)?.map((item) => (
              <Box key={`gallery-item-${item.id}`} sx={galleryItemStyles}>
                <img src={item.url} alt={item.name} />
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveMedia(item.id)}
                >
                  Remove
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

const galleryGridStyles: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
};

const galleryItemStyles: SxProps = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: "8px",
  overflow: "hidden",
  display: "grid",
  gap: "0.5rem",
  padding: "0.5rem",
  img: {
    width: "100%",
    height: "100px",
    objectFit: "cover",
  },
};

export default GalleryBlock;
