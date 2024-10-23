import { Box, IconButton, SxProps, Typography } from "@mui/material";
import DeleteIcon from "../../../../assets/deleteIcon";
import { MediaType } from "../../../../types/media";
// import { useEffect, useState } from "react";

type Props = {
  media: MediaType;
  deleteItem: () => void;
};
const MediaItem = ({ media, deleteItem }: Props) => {
  // const [fileSize, setFileSize] = useState<string | null>(null);

  // useEffect(() => {
  //   const getFileSize = async () => {
  //     try {
  //       const response = await fetch(media.url, { method: "HEAD" });

  //       if (response.ok) {
  //         const size = response.headers.get("Content-Length");
  //         setFileSize(size);
  //       } else {
  //         console.error("Failed to fetch file size");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching file size:", error);
  //     }
  //   };

  //   getFileSize();
  // }, []);

  const extension = media.name.substring(media.name.lastIndexOf(".") + 1);

  return (
    <Box sx={mediaItemStyles}>
      <Box sx={mediaThumbStyles}>
        <img src={media.url} alt="Media thumbnail" />
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
            {/* {fileSize} {extension} {media.type} file */}
            1.1mb {extension} {media.type} file
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
