import {
  Box,
  Checkbox,
  IconButton,
  SxProps,
  Typography,
} from "@mui/material";
import InsertDriveFileOutlined from "@mui/icons-material/InsertDriveFileOutlined";
import DeleteIcon from "../../../../assets/deleteIcon";
import { MediaType } from "../../../../types/media";
import { ChangeEvent } from "react";

type Props = {
  media: MediaType;
  deleteItem: () => void;
  handleSelect: (event: ChangeEvent<HTMLInputElement>, postId: number) => void;
  deleteIds: number[];
};
const MediaItem = ({ media, deleteItem, handleSelect, deleteIds }: Props) => {
  const extension = media.name.includes(".")
    ? media.name.substring(media.name.lastIndexOf(".") + 1)
    : media.type;
  const isImage = media.type === "image";
  const isVideo = media.type === "video";

  const renderPreview = () => {
    if (isImage) return <img src={media.url} alt="Media thumbnail" />;
    if (isVideo)
      return (
        <video controls>
          <source src={media.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    return (
      <Box sx={fileThumbStyles}>
        <InsertDriveFileOutlined sx={{ fontSize: 36, color: "#4D4D4D" }} />
        <Typography sx={{ fontSize: ".9rem", fontWeight: 600 }}>
          {extension?.toUpperCase()}
        </Typography>
        <Typography
          component="a"
          href={media.url}
          target="_blank"
          rel="noreferrer"
          sx={{ fontSize: ".8rem", color: "primary.main" }}
        >
          Open file
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={mediaItemStyles}>
      <Box sx={mediaThumbStyles}>
        <Checkbox
          sx={{
            bgcolor: "#fff",
            borderRadius: "0",
            opacity: 0.8,
            position: "absolute",
            transition: ".3s",
            zIndex: 99,

            "&:hover": {
              bgcolor: "#fff",
            },
          }}
          onChange={(event) => handleSelect(event, media.id as number)}
          checked={deleteIds.includes(media.id as number)}
        />
        {renderPreview()}
      </Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography>{media.name}</Typography>
          <Typography sx={{ fontSize: ".8rem" }}>
            {extension} {media.type} file
          </Typography>
        </Box>
        <IconButton onClick={deleteItem}>
          <DeleteIcon color="rgba(170, 170, 170, 1)" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MediaItem;

const mediaThumbStyles: SxProps = {
  position: "relative",
  height: "150px",
  img: {
    height: "100%",
    position: "absolute",
    objectFit: "cover",
    width: "100%",
  },
  video: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    position: "absolute",
    left: 0,
    top: 0,
  },
};

const mediaItemStyles: SxProps = {
  width: "100%",
  ".MuiTypography-root": {
    textWrap: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "20ch",
    overflow: "hidden",
  },
};

const fileThumbStyles: SxProps = {
  alignItems: "center",
  border: "1px dashed rgba(0,0,0,0.1)",
  display: "grid",
  gap: ".2rem",
  height: "100%",
  justifyContent: "center",
  padding: "1rem",
  textAlign: "center",
};
