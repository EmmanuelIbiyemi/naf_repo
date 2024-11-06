import { Box, Checkbox, IconButton, SxProps, Typography } from "@mui/material";
import DeleteIcon from "../../../../assets/deleteIcon";
import { PostType } from "../../../../types/posts";
import { Edit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

type Props = {
  post: PostType;
  deleteItem: () => void;
};
const PostItem = ({ post, deleteItem }: Props) => {
  const navigate = useNavigate();
  const { resource_type } = useParams();

  return (
    <Box sx={postItemStyles}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: ".8rem",
          height: "3em",
        }}
      >
        <Checkbox />
        <Typography
          sx={{ fontWeight: "500 !important", textTransform: "capitalize" }}
        >
          {post.title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifySelf: "end" }}>
        <IconButton
          onClick={() =>
            navigate(`/settings/posttype/${resource_type}/${post.id}`)
          }
        >
          <Edit sx={{ color: "rgba(170, 170, 170, 1)" }} />
        </IconButton>
        <IconButton onClick={deleteItem}>
          <DeleteIcon color="rgba(170, 170, 170, 1)" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PostItem;

const postItemStyles: SxProps = {
  borderBottom: "1px solid rgba(170, 170, 170, .5)",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: ".8rem",

  "&:last-child": {
    borderColor: "transparent",
  },
};
