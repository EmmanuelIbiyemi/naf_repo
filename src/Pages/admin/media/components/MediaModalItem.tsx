import { Box, IconButton, SxProps, Typography } from "@mui/material";
import DeleteIcon from "../../../../assets/deleteIcon";
import { MediaType } from "../../../../types/media";

type Props = {
  media: MediaType;
  selectMedia: () => void;
  deleteMedia: () => void;
};
const MediaModalItem = ({ media, selectMedia, deleteMedia }: Props) => {
  const extension = media.name.substring(media.name.lastIndexOf(".") + 1);

  return (
    <Box sx={mediaItemStyles}>
      <Box
        sx={{ ...mediaThumbStyles, cursor: "pointer" }}
        onClick={selectMedia}
      >
        {media.type == "image" ? (
          <img src={media.url} alt="Media thumbnail" />
        ) : (
          <video controls>
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box onClick={selectMedia} sx={{ cursor: "pointer" }}>
          <Typography>{media.name}</Typography>
          <Typography sx={{ fontSize: ".8rem" }}>
            {extension} {media.type} file
          </Typography>
        </Box>
        <IconButton onClick={deleteMedia}>
          <DeleteIcon color="rgba(170, 170, 170, 1)" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MediaModalItem;

const mediaThumbStyles: SxProps = {
  position: "relative",
  height: "150px",
  img: {
    height: "100%",
    position: "absolute",
    objectFit: "cover",
    width: "100%",
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
