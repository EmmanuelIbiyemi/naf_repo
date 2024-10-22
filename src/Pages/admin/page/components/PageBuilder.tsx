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
import { PageType } from "../../../../types/pages";

type ActionProp = {
  id: number;
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
};

const ActionButtons = ({ id, setPage }: ActionProp) => {
  const handleMoveUp = (post_id: number) => {
    console.log(post_id);
  };

  const handleMoveDown = (post_id: number) => {
    console.log(post_id);
  };

  const handleDelete = (id: number) => {
    setPage((prev) => {
      prev.elements = prev.elements.filter((el) => el.id != id);
      return { ...prev };
    });
  };

  return (
    <Box sx={{ display: "flex", gap: ".3rem" }}>
      <IconButton onClick={() => handleMoveUp(id)}>
        <ArrowUpward />
      </IconButton>
      <IconButton onClick={() => handleMoveDown(id)}>
        <ArrowDownward />
      </IconButton>
      <IconButton onClick={() => handleDelete(id)} className="delete_btn">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

type Props = {
  page: PageType;
  setPage: React.Dispatch<React.SetStateAction<PageType>>;
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
                {element.content}
              </Typography>
              <ActionButtons id={element.id} setPage={setPage} />
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
                {element.content}
              </Typography>
              <ActionButtons id={element.id} setPage={setPage} />
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
                {element.content}
              </Typography>
              <ActionButtons id={element.id} setPage={setPage} />
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
                {element.content}
              </Typography>
              <ActionButtons id={element.id} setPage={setPage} />
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
            <Box sx={{ marginBottom: "1rem" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" id={`element-${element.id}`}>
                  {element.content}
                </Typography>
                <ActionButtons id={element.id} setPage={setPage} />
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
      case "video":
        el = (
          <Box sx={imageEl}>
            <Box sx={{ marginBottom: "1rem" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h5" id={`element-${element.id}`}>
                  {element.content}
                </Typography>
                <ActionButtons id={element.id} setPage={setPage} />
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
                {element.content}
              </Typography>
              <ActionButtons id={element.id} setPage={setPage} />
            </Box>
            <FormControl fullWidth>
              <TextField label="Content" />
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
                {element.content}
              </Typography>
              <ActionButtons id={element.id} setPage={setPage} />
            </Box>
            <FormControl fullWidth>
              <TextField label="Content" />
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
              {element.content}
            </Typography>
            <ActionButtons id={element.id} setPage={setPage} />
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
              {element.content}
            </Typography>
            <ActionButtons id={element.id} setPage={setPage} />
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
              {element.content}
            </Typography>
            <ActionButtons id={element.id} setPage={setPage} />
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
              {element.content}
            </Typography>
            <ActionButtons id={element.id} setPage={setPage} />
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
    <Box sx={formBuilderStyles}>
      {page.elements?.map((el) => displayEl(el))}
    </Box>
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
