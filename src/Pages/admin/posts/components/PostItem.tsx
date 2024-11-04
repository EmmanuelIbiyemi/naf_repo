import { Box, IconButton, SxProps, Typography } from "@mui/material";
import DeleteIcon from "../../../../assets/deleteIcon";
import { PostType } from "../../../../types/posts";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type Props = {
  post: PostType;
  deleteItem: () => void;
};
const PostItem = ({ post, deleteItem }: Props) => {
  const navigate = useNavigate();

  return (
    <Box sx={postItemStyles}>
      <Box sx={postThumbStyles}>
        <img src={post.featured_image} alt={post.title} />
      </Box>
      <Box
        sx={{
          display: "grid",
        }}
      >
        <Box sx={{ height: "3em", paddingTop: ".8rem" }}>
          <Typography>{post.title}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifySelf: "end" }}>
          <IconButton onClick={() => navigate(`/settings/post/${post.id}`)}>
            <Edit sx={{ color: "rgba(170, 170, 170, 1)" }} />
          </IconButton>
          <IconButton onClick={deleteItem}>
            <DeleteIcon color="rgba(170, 170, 170, 1)" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default PostItem;

const postThumbStyles: SxProps = {
  position: "relative",
  height: "150px",
  width: "100%",
  img: {
    height: "100%",
    position: "absolute",
    objectFit: "cover",
    width: "100%",
  },
};

const postItemStyles: SxProps = {
  ".MuiTypography-root": {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 2,
    maxWidth: "25ch",
  },
};
