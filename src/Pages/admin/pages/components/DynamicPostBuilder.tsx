import {
  Box,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { BlockType } from "../../../../types/blocks";
import { Close, CloudUploadOutlined } from "@mui/icons-material";
import { ChangeEvent, useState } from "react";
import { PostCreateType, PostType } from "../../../../types/posts";
import {
  useGetPostByCategoryQuery,
  useUpdatePostMutation,
} from "../../../../store/api/posts.api";
import MediaLibraryModal from "../../media/MediaLibraryModal";
import { MediaType } from "../../../../types/media";
import { ActionButtons } from "./ActionButtons";

const capitalizeText = (text: string) => {
  const allTexts = text.split(" ");
  return allTexts.map((t) => t[0].toUpperCase() + t.substring(1)).join(" ");
};

type Media = {
  media: MediaType | null;
  type: string;
  modal: boolean;
};

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

const PageBuilder = ({ page, setPage }: Props) => {
  const { data: pages } = useGetPostByCategoryQuery({
    tag: "page",
    page: 1,
    per_page: 1000,
  });
  const [activeBlock, setActiveBlock] = useState<BlockType>();
  const [media, setMediaData] = useState<Media>({
    media: null,
    type: "image",
    modal: false,
  });
  const [updatePost] = useUpdatePostMutation();

  const pagesElements =
    pages?.post.map((page) => (
      <MenuItem key={`page-${page.id}`} value={page.title}>
        {capitalizeText(page.title)}
      </MenuItem>
    )) || [];
  pagesElements.push(
    <MenuItem value={"e-learning"}>E-Learning</MenuItem>,
    <MenuItem value={"apply"}>Apply</MenuItem>
  );

  const updateBlock = (newBlock: BlockType) => {
    setPage((prev) => {
      if (!prev) return prev;

      const updatedBlocks = prev.blocks.map((block) =>
        block.id === newBlock.id ? newBlock : block
      );

      return {
        ...prev,
        blocks: updatedBlocks,
      };
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
    elId: number
  ) => {
    const foundBlock = page.blocks.find((block) => block.id === elId);
    if (foundBlock) {
      const content = foundBlock.content?.split("::");
      const value = e.target.value;

      switch (type) {
        case "title":
          content[0] = value;
          break;
        case "subTitle":
          content[1] = value;
          break;
        case "buttonText":
          content[2] = value;
          break;
      }

      const newBlock: BlockType = {
        ...foundBlock,
        content: content.join("::"),
      };
      updateBlock(newBlock);
    }
  };

  const handleLinkChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    elId: number
  ) => {
    const foundBlock = page.blocks.find((block) => block.id === elId);
    if (foundBlock) {
      let content = [];
      if (!foundBlock.content.includes("::")) {
        content = [foundBlock.content, ""];
      } else content = foundBlock.content?.split("::");

      content[0] = e.target.value;

      const newBlock: BlockType = {
        ...foundBlock,
        content: content.join("::"),
      };
      updateBlock(newBlock);
    }
  };

  const handleLinkPageChange = (e: SelectChangeEvent<string>, elId: number) => {
    const foundBlock = page.blocks.find((block) => block.id === elId);
    if (foundBlock) {
      let content = [];
      if (!foundBlock.content.includes("::")) {
        content = [foundBlock.content, ""];
      } else content = foundBlock.content?.split("::");

      content[1] = e.target.value;

      const newBlock: BlockType = {
        ...foundBlock,
        content: content.join("::"),
      };
      updateBlock(newBlock);
    }
  };

  const displayEl = (element: BlockType) => {
    let el;
    const content = element.content?.split("::");

    switch (element.type) {
      case "banner":
        el = (
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
                display: "grid",
                gap: ".4rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <TextField
                label="Title"
                defaultValue={content[0]}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
              <TextField
                label="Sub title"
                defaultValue={content[1]}
                onBlur={(e) => handleChange(e, "subTitle", element.id)}
              />
              <TextField
                label="Button text"
                defaultValue={content[2]}
                onBlur={(e) => handleChange(e, "buttonText", element.id)}
              />
              <label htmlFor={`upload-${element.id}`}>
                {/* <input
                  id={`upload-${element.id}`}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                /> */}
                <Typography
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.25)",
                    cursor: "pointer",
                    height: "100%",
                    width: "100%",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "var(--border-radius)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {(element.media?.[0] as MediaType)?.name ||
                    "Upload image/video"}
                </Typography>
              </label>
            </FormControl>
          </Box>
        );
        break;
      case "history":
        el = (
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
                display: "grid",
                gap: ".4rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <TextField
                label="Title"
                defaultValue={content[0]}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
              <TextField
                label="Sub title"
                defaultValue={content[1]}
                onBlur={(e) => handleChange(e, "subTitle", element.id)}
              />
              <TextField
                label="Button text"
                defaultValue={content[2]}
                onBlur={(e) => handleChange(e, "buttonText", element.id)}
              />
              <label htmlFor={`upload-${element.id}`}>
                {/* <input
                  id={`upload-${element.id}`}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                /> */}
                <Typography
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.25)",
                    cursor: "pointer",
                    height: "100%",
                    width: "100%",
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "var(--border-radius)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {(element.media?.[0] as MediaType)?.name || "Upload image"}
                </Typography>
              </label>
            </FormControl>
          </Box>
        );
        break;
      case "courses":
        el = (
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
          </Box>
        );
        break;
      case "map":
        el = (
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
          </Box>
        );
        break;
      case "news":
        el = (
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
          </Box>
        );
        break;
      case "news section":
        el = (
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
                display: "grid",
                gap: ".4rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <TextField
                label="Title"
                defaultValue={content[0]}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
              <TextField
                label="Sub title"
                defaultValue={content[1]}
                onBlur={(e) => handleChange(e, "subTitle", element.id)}
              />
              <TextField
                label="Button text"
                defaultValue={content[2]}
                onBlur={(e) => handleChange(e, "buttonText", element.id)}
              />
            </FormControl>
          </Box>
        );
        break;
      case "image":
        el = (
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
              onClick={() => handleOpenMediaSelect(element, "image")}
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
                      <img
                        className="bg"
                        src={(m as MediaType).url}
                        alt={(m as MediaType).name}
                      />
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
                  <CloudUploadOutlined /> Drag and drop your image here or
                  browse
                </Box>
              )}
            </Box>
          </Box>
        );
        break;
      case "video":
        el = (
          <Box sx={imageEl}>
            <Box sx={{ marginBottom: "1rem" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" id={`element-${element.id}`}>
                  {capitalizeText(element.type)}
                </Typography>
                <ActionButtons block={element} setPage={setPage} />
              </Box>
            </Box>
            <Box
              id={`element-${element.id}`}
              className="image_el dashed_border"
              onClick={() => handleOpenMediaSelect(element, "video")}
            >
              {element.media?.length && (element.media[0] as MediaType)?.url ? (
                <Box
                  className="hide_scrollbar"
                  sx={{
                    display: "flex",
                    gap: "10px",
                    height: "100%",
                    maxWidth: "500px",
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
                      <img
                        className="bg"
                        src={(m as MediaType).url}
                        alt={(m as MediaType).name}
                      />
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
                  <CloudUploadOutlined /> Drag and drop your videos here or
                  browse
                </Box>
              )}
            </Box>
          </Box>
        );
        break;
      case "heading":
        el = (
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
                defaultValue={content[0]}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
            </FormControl>
          </Box>
        );
        break;
      case "title":
        el = (
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
                defaultValue={content[0]}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
            </FormControl>
          </Box>
        );
        break;
      case "link":
        el = (
          <Box>
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
                  defaultValue={content[0]}
                  onBlur={(e) => handleLinkChange(e, element.id)}
                />
              </FormControl>
              <FormControl fullWidth>
                <label style={{ marginBottom: ".4rem" }}>Page</label>
                <Select
                  value={content[1] || ""}
                  onChange={(e) => handleLinkPageChange(e, element.id)}
                >
                  {pagesElements}
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
        break;
      case "buttonLink":
        el = (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: ".2rem",
              }}
            >
              <Typography variant="h5" id={`element-${element.id}`}>
                Button Link
              </Typography>
              <ActionButtons block={element} setPage={setPage} />
            </Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <FormControl fullWidth>
                <label style={{ marginBottom: ".4rem" }}>Name</label>
                <TextField
                  label=""
                  defaultValue={content[0]}
                  onBlur={(e) => handleLinkChange(e, element.id)}
                />
              </FormControl>
              <FormControl fullWidth>
                <label style={{ marginBottom: ".4rem" }}>Page</label>
                <Select
                  value={content[1] || ""}
                  onChange={(e) => handleLinkPageChange(e, element.id)}
                >
                  {pagesElements}
                </Select>
              </FormControl>
            </Box>
          </Box>
        );
        break;
      case "text":
        el = (
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
                defaultValue={content[0]}
                multiline
                rows={4}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
            </FormControl>
          </Box>
        );
        break;
      case "subtitle":
        el = (
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
                defaultValue={content[0]}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
            </FormControl>
          </Box>
        );
        break;
      case "commandants":
        el = (
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
                display: "grid",
                gap: ".4rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <TextField
                label="Title"
                defaultValue={content[0]}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
              <TextField
                label="Sub title"
                defaultValue={content[1]}
                onBlur={(e) => handleChange(e, "subTitle", element.id)}
              />
            </FormControl>
          </Box>
        );
        break;
      case "staffs":
        el = (
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
                display: "grid",
                gap: ".4rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <TextField
                label="Title"
                defaultValue={content[0]}
                onBlur={(e) => handleChange(e, "title", element.id)}
              />
              <TextField
                label="Sub title"
                defaultValue={content[1]}
                onBlur={(e) => handleChange(e, "subTitle", element.id)}
              />
            </FormControl>
          </Box>
        );
        break;
      case "big space":
        el = (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" id={`element-${element.id}`}>
              {capitalizeText(element.type)}
            </Typography>
            <ActionButtons block={element} setPage={setPage} />
          </Box>
        );
        break;
      case "small space":
        el = (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" id={`element-${element.id}`}>
              {capitalizeText(element.type)}
            </Typography>
            <ActionButtons block={element} setPage={setPage} />
          </Box>
        );
        break;
    }

    return (
      <Box key={`element-${element.id}`} className="element">
        {el}
      </Box>
    );
  };

  // Temp Placement
  const handleOpenModal = (type: string) => {
    setMediaData((prev) => ({ ...prev, modal: true, type }));
  };

  const handleCloseModal = () =>
    setMediaData((prev) => ({ ...prev, modal: false }));

  // Mark
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

        const payload: PostCreateType = {
          ...page,
          blocks: blocks,
          categories: page.categories?.map((cat) => cat.name),
          tags: page.tags?.map((cat) => cat.name),
        };

        await updatePost(payload).unwrap();
      } catch (error) {
        console.log(error);
      }
      handleCloseModal();
    }
  };
  // Temp

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
      <Box sx={formBuilderStyles}>
        {page.blocks?.map((el) => displayEl(el))}
      </Box>
    </>
  );
};

export default PageBuilder;

const formBuilderStyles: SxProps = {
  padding: "1.5rem 1rem",

  ".element": {
    border: "1px solid transparent",
    borderRadius: "var(--border-radius)",
    position: "relative",
    transition: ".3s",

    "&:hover": {
      borderColor: "rgba(43, 135, 251, 1)",
    },
    ">*": {
      flexShrink: 0,
      padding: ".7rem 1rem",
    },

    ".MuiIconButton-root": {
      bgcolor: "rgba(170, 170, 170, 1)",
      color: "#fff",
      height: "35px",
      padding: "8px",
      width: "35px",
    },
  },

  ".MuiIconButton-root.delete_btn": {
    bgcolor: "rgba(229, 72, 77, 1)",
  },
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
