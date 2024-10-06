import { Box, IconButton, SxProps, Typography } from "@mui/material";
import DeleteIcon from "../../../../assets/deleteIcon";

type Props = {
  image: string;
  deleteItem: () => void;
};
const MediaItem = ({ image, deleteItem }: Props) => {
  return (
    <Box sx={mediaItemStyles}>
      <Box sx={mediaThumbStyles}>
        <img src={image} alt="Media thumbnail" />
      </Box>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography>Amphibious_courses</Typography>
          <Typography sx={{ fontSize: ".8rem" }}>
            1.1mb JPEG image file
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
