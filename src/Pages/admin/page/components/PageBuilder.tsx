import {
  Box,
  FormControl,
  IconButton,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { BlockType } from "../../../../types/blocks";
import {
  ArrowDownward,
  ArrowUpward,
  CloudUploadOutlined,
} from "@mui/icons-material";
import { ChangeEvent, MouseEvent } from "react";
import DeleteIcon from "../../../../assets/deleteIcon";
import { PostType } from "../../../../types/posts";
import { useDeletePostBlockMutation } from "../../../../store/api/posts.api";
import { useAppDispatch } from "../../../../store/hooks";
import { setBuilderLoading } from "../../../../store/app.slice";

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

      // Only proceed if both blocks exist
      if (newBlocks[currentPos - 1] && newBlocks[currentPos - 2]) {
        //   // Store the blocks we want to swap
        const currentBlock = { ...newBlocks[currentPos - 1] };
        const upperBlock = { ...newBlocks[currentPos - 2] };
        newBlocks[currentPos - 1] = upperBlock;
        newBlocks[currentPos - 2] = currentBlock;

        // Update all positions to match array indices - create new objects
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index + 1,
        }));
        return {
          ...prev,
          blocks: updatedBlocks,
        };
      }
      return prev;
    });
  };

  const handleMoveDown = (currentPos: number) => {
    if (currentPos <= 0) return; // Can't move up if already at top

    setPage((prev) => {
      if (!prev || !prev.blocks) return prev;

      const newBlocks = [...prev.blocks];

      // Only proceed if both blocks exist
      if (newBlocks[currentPos] && newBlocks[currentPos - 1]) {
        // Store the blocks we want to swap
        const currentBlock = { ...newBlocks[currentPos] };
        const upperBlock = { ...newBlocks[currentPos - 1] };

        // Perform the swap
        newBlocks[currentPos - 1] = currentBlock;
        newBlocks[currentPos] = upperBlock;

        // Update all positions to match array indices - create new objects
        const updatedBlocks = newBlocks.map((block, index) => ({
          ...block,
          position: index + 1,
        }));

        return {
          ...prev,
          blocks: updatedBlocks,
        };
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
  const handleOpenFileSelect = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    target.querySelector("input")?.click();
  };

  const handleSelectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    console.log(target.files);
  };

  // const handleChange = (e: ChangeEvent) => {
  //   console.log(e.target.value);
  // };

  const displayEl = (element: BlockType) => {
    let el;
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
                {element.type}
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
              <TextField label="Title" />
              <TextField label="Sub title" />
              <TextField label="Button text" />
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
                {element.type}
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
              <TextField label="Title" />
              <TextField label="Sub title" />
              <TextField label="Button text" />
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
                {element.type}
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
              <TextField label="Title" />
              <TextField label="Sub title" />
              <TextField label="Button text" />
            </FormControl>
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
                {element.type}
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
              <TextField label="Title" />
              <TextField label="Sub title" />
              <TextField label="Button text" />
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
              <span></span>
              <ActionButtons block={element} setPage={setPage} />
            </Box>
            <Box
              id={`element-${element.id}`}
              className="image_el dashed_border"
              onClick={handleOpenFileSelect}
            >
              <CloudUploadOutlined /> Drag and drop your image here or browse
              <input type="file" hidden onChange={handleSelectImage} />
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
                  {element.type}
                </Typography>
                <ActionButtons block={element} setPage={setPage} />
              </Box>
              <FormControl
                fullWidth
                sx={{
                  marginTop: "1rem",
                }}
              >
                <TextField label="Title" />
              </FormControl>
            </Box>
            <Box
              id={`element-${element.id}`}
              className="image_el dashed_border"
              onClick={handleOpenFileSelect}
            >
              <CloudUploadOutlined /> Drag and drop your image here or browse
              <input type="file" hidden onChange={handleSelectImage} />
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
                {element.type}
              </Typography>
              <ActionButtons block={element} setPage={setPage} />
            </Box>
            <FormControl fullWidth>
              <TextField label="" />
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
                {element.type}
              </Typography>
              <ActionButtons block={element} setPage={setPage} />
            </Box>
            <FormControl fullWidth>
              <TextField label="" />
            </FormControl>
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
                {element.type}
              </Typography>
              <ActionButtons block={element} setPage={setPage} />
            </Box>
            <FormControl fullWidth>
              <TextField label="" />
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
                {element.type}
              </Typography>
              <ActionButtons block={element} setPage={setPage} />
            </Box>
            <FormControl fullWidth>
              <TextField label="" />
            </FormControl>
          </Box>
        );
        break;
      case "commandants":
        el = (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" id={`element-${element.id}`}>
              {element.type}
            </Typography>
            <ActionButtons block={element} setPage={setPage} />
          </Box>
        );
        break;
      case "staffs":
        el = (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" id={`element-${element.id}`}>
              {element.type}
            </Typography>
            <ActionButtons block={element} setPage={setPage} />
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
              {element.type}
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
              {element.type}
            </Typography>
            <ActionButtons block={element} setPage={setPage} />
          </Box>
        );
        break;
    }

    return (
      <Box key={`element-${element.content}`} className="element">
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
    justifyContent: "center",
    height: "100px",
    padding: "1rem",
  },
};
