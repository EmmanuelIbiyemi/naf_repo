import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { BlockType, MediaCreateType } from "../../../../types/blocks";
import {
  ArrowDownward,
  ArrowUpward,
  CloudUploadOutlined,
} from "@mui/icons-material";
import { ChangeEvent, MouseEvent, useCallback } from "react";
import DeleteIcon from "../../../../assets/deleteIcon";
import { PostType } from "../../../../types/posts";
import {
  useDeletePostBlockMutation,
  useGetPostByCategoryQuery,
} from "../../../../store/api/posts.api";
import { useAppDispatch } from "../../../../store/hooks";
import { setBuilderLoading } from "../../../../store/app.slice";
import { useAddMediaMutation } from "../../../../store/api/media.api";
import { MediaType } from "../../../../types/media";

const capitalizeText = (text: string) => {
  const allTexts = text.split(" ");
  return allTexts.map((t) => t[0].toUpperCase() + t.substring(1)).join(" ");
};

type ActionProp = {
  block: BlockType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

const ActionButtons = ({ block, setPage }: ActionProp) => {
  const dispatch = useAppDispatch();
  const [deleteBlock] = useDeletePostBlockMutation();

  const handleMoveUp = (currentPos: number) => {
    if (currentPos <= 1) return; // Can't move up if already at top

    setPage((prev) => {
      const newBlocks = [...prev.blocks];

      const currentIndex = currentPos - 1; // Convert position to zero-based index
      if (newBlocks[currentIndex] && newBlocks[currentIndex - 1]) {
        // Swap blocks
        [newBlocks[currentIndex], newBlocks[currentIndex - 1]] = [
          newBlocks[currentIndex - 1],
          newBlocks[currentIndex],
        ];

        // Update positions accurately for all blocks
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index + 1,
        }));

        return { ...prev, blocks: updatedBlocks };
      }
      return prev;
    });
  };

  const handleMoveDown = (currentPos: number) => {
    setPage((prev) => {
      const newBlocks = [...prev.blocks];

      const currentIndex = currentPos - 1;
      if (newBlocks[currentIndex] && newBlocks[currentIndex + 1]) {
        // Swap blocks
        [newBlocks[currentIndex], newBlocks[currentIndex + 1]] = [
          newBlocks[currentIndex + 1],
          newBlocks[currentIndex],
        ];

        // Update positions accurately for all blocks
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index + 1,
        }));

        return { ...prev, blocks: updatedBlocks };
      }
      return prev;
    });
  };

  const handleDelete = async (block_id: number) => {
    dispatch(setBuilderLoading(true));
    try {
      await deleteBlock(block_id).unwrap();
    } catch (error) {
      console.log(error);
    }
    setPage((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== block_id),
    }));
    dispatch(setBuilderLoading(false));
  };

  return (
    <Box sx={{ display: "flex", gap: ".3rem" }}>
      <IconButton onClick={() => handleMoveUp(block.position)}>
        <ArrowUpward />
      </IconButton>
      <IconButton onClick={() => handleMoveDown(block.position)}>
        <ArrowDownward />
      </IconButton>
      <IconButton onClick={() => handleDelete(block.id)} className="delete_btn">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

type Props = {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

const PageBuilder = ({ page, setPage }: Props) => {
  const [uploadMedia] = useAddMediaMutation();
  const { data: pages } = useGetPostByCategoryQuery({
    tag: "page",
    per_page: 1000,
  });

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

  const handleOpenFileSelect = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.currentTarget as HTMLDivElement;
    target.querySelector("input")?.click();
  };

  const handleSelectImage = async (
    event: ChangeEvent<HTMLInputElement>,
    blockId: number
  ) => {
    const target = event.target;

    if (target.files) {
      try {
        const form = new FormData();
        const files = target.files;
        for (let i = 0; i < files.length; i++) {
          form.append("file", files[i]);
        }

        const response = await uploadMedia(form).unwrap();
        const blocks = page.blocks.map((b) => {
          if (b.id === blockId)
            return {
              ...b,
              media: response.media.map((m) => ({ id: m.id })),
            };
          return b;
        });

        setPage((prev) => ({
          ...prev,
          blocks,
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateBlock = useCallback(
    (newBlock: BlockType) => {
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
    },
    [page]
  );

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

  const handleImageChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const { target } = ev;
    const id = +target.id.split("-")[1];

    if (target.files && target.files[0]) {
      try {
        const form = new FormData();
        form.append("file", target.files[0]);
        const response = await uploadMedia(form).unwrap();

        setPage((prev) => {
          const blocks = prev.blocks.map((b) => {
            if (b.id == id) {
              const media = b?.media ? [...b.media] : b.media;
              b = { ...b, media };
              b.media = [{ id: response.media[0].id } as MediaCreateType];
              console.log(b.media);
            }
            return b;
          });
          return { ...prev, blocks };
        });
      } catch (error) {
        console.log(error);
      }
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
                <input
                  id={`upload-${element.id}`}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
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
                <input
                  id={`upload-${element.id}`}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
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
              onClick={handleOpenFileSelect}
            >
              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={(e) => handleSelectImage(e, element.id)}
              />
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
              onClick={handleOpenFileSelect}
            >
              <input
                type="file"
                multiple
                hidden
                accept="video/*"
                onChange={(e) => handleSelectImage(e, element.id)}
              />
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

  return (
    <Box sx={formBuilderStyles}>{page.blocks?.map((el) => displayEl(el))}</Box>
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
