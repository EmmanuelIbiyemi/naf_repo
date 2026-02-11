import {
  Box,
  Button,
  Dialog,
  IconButton,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Close } from "@mui/icons-material";
import { BlockType } from "../../../../../types/blocks";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";
import { MediaType } from "../../../../../types/media";
import MediaLibraryModal from "../../../media/MediaLibraryModal";

const MediaCarouselBlock = ({
  page,
  setPage,
  element,
  index,
}: {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
}) => {
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

  const handlePositionChange = (position: number, randomId: string | null | undefined) => {
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

  const handleUpdateMediaCaption = (mediaId: number, caption: string) => {
    const updated = (element.media || []).map((item) =>
      item.id === mediaId ? { ...item, caption } : item
    );
    updateBlock({ ...element, media: updated });
  };

  const handleTitleChange = (title: string) => {
    updateBlock({ ...element, title });
  };

  const handleCaptionChange = (caption: string) => {
    updateBlock({ ...element, caption });
  };

  const handleButtonLabelChange = (label: string) => {
    updateBlock({ ...element, content: label });
  };

  const handleButtonLinkChange = (link: string) => {
    updateBlock({ ...element, link });
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
            key="modal-media-carousel"
            selectMedia={handleSelectImage}
            mediaType="image"
          />
        </Box>
      </Dialog>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <Typography variant="h5">Media Carousel</Typography>
          <ActionButtons block={element} setPage={setPage} />
        </Box>
        <Box sx={{ display: "grid", gap: "0.75rem" }}>
          <TextField
            label="Section title"
            value={element.title || ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            fullWidth
          />
          <TextField
            label="Section description"
            value={element.caption || ""}
            onChange={(e) => handleCaptionChange(e.target.value)}
            fullWidth
            multiline
            rows={2}
          />
          <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
            <TextField
              label="Button label"
              value={element.content || ""}
              onChange={(e) => handleButtonLabelChange(e.target.value)}
              fullWidth
            />
            <TextField
              label="Button link"
              value={element.link || ""}
              onChange={(e) => handleButtonLinkChange(e.target.value)}
              fullWidth
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Use captions to set card titles and descriptions. Format: "Title :: Description".
          </Typography>
          <Button variant="outlined" onClick={() => setMediaModalOpen(true)}>
            Add Images
          </Button>
          <Box sx={galleryGridStyles}>
            {(element.media as MediaType[] | undefined)?.map((item) => (
              <Box key={`media-carousel-${item.id}`} sx={galleryItemStyles}>
                <img src={item.url} alt={item.name} />
                <TextField
                  label="Caption"
                  placeholder="Title :: Description"
                  value={item.caption || ""}
                  onChange={(e) => handleUpdateMediaCaption(item.id, e.target.value)}
                  size="small"
                  fullWidth
                  sx={{ mt: 0.5 }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleRemoveMedia(item.id)}
                  sx={{ mt: 0.5 }}
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
  gridTemplateRows: "auto 1fr auto",
};

export default MediaCarouselBlock;
