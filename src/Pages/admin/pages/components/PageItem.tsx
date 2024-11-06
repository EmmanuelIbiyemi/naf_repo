import { Box, Checkbox, IconButton, SxProps, Typography } from "@mui/material";
import DeleteIcon from "../../../../assets/deleteIcon";
import { PostType } from "../../../../types/posts";
import { Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type Props = {
  page: PostType;
  deleteItem: () => void;
};
const PostItem = ({ page, deleteItem }: Props) => {
  const navigate = useNavigate();

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
          {page.title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifySelf: "end" }}>
        <IconButton
          onClick={() =>
            navigate(`/settings/page/${page.categories?.[0].name}`)
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
