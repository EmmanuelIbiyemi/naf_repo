import { Box, Checkbox, IconButton, SxProps, Typography } from "@mui/material";
import DeleteIcon from "../../../../assets/deleteIcon";
import { PostType } from "../../../../types/posts";
import { Edit, ContentCopy, DragIndicator, OpenInNew } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeEvent } from "react";
import { useAddPostMutation } from "../../../../store/api/posts.api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  post: PostType;
  deleteItem: () => void;
  handleSelect: (event: ChangeEvent<HTMLInputElement>, postId: number) => void;
  deleteIds: number[];
};

const PostItem = ({ post, deleteItem, handleSelect, deleteIds }: Props) => {
  const navigate = useNavigate();
  const { resource_type } = useParams();
  const [addPost] = useAddPostMutation();

  const landingBaseUrl =
    (import.meta.env.VITE_LANDING_URL as string | undefined)?.replace(/\/+$/, "") ||
    window.location.origin;
  const landingSlug = (post.slug || post.title || "").trim();
  const landingUrl = landingSlug
    ? `${landingBaseUrl}/${encodeURIComponent(landingSlug)}`
    : landingBaseUrl;
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id as number });

  const handleDuplicate = async () => {
    if (!post) return;

    const duplicatedPost = {
      ...post,
      id: undefined, // Ensure the ID is undefined to create a new post
      title: `${post.title} duplicate`,
      categories: post.categories?.map(category => category.name.toString()),
      tags: post.tags?.map(tag => tag.name.toString())
    };

    try {
      const response = await addPost(duplicatedPost).unwrap();
      navigate(`/settings/posttype/${resource_type}/${response.post.id}`);
    } catch (error) {
      console.error("Failed to duplicate post:", error);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePreview = () => {
    if (!landingSlug) return;
    window.open(landingUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Box ref={setNodeRef} style={style} sx={postItemStyles}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: ".8rem",
          height: "3em",
        }}
      >
        <Box
          {...attributes}
          {...listeners}
          sx={{
            cursor: "grab",
            display: "flex",
            alignItems: "center",
            "&:active": { cursor: "grabbing" },
          }}
        >
          <DragIndicator sx={{ color: "rgba(170, 170, 170, 1)" }} />
        </Box>
        <Checkbox
          onChange={(event) => handleSelect(event, post.id as number)}
          checked={deleteIds.includes(post.id as number)}
        />
        <Typography
          sx={{ fontWeight: "500 !important", textTransform: "capitalize" }}
        >
          {post.title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifySelf: "end" }}>
        {resource_type === "page" ? (
          <IconButton onClick={handlePreview} title="View on landing page">
            <OpenInNew sx={{ color: "rgba(170, 170, 170, 1)" }} />
          </IconButton>
        ) : null}
        <IconButton
          onClick={() =>
            navigate(`/settings/posttype/${resource_type}/${post.id}`)
          }
        >
          <Edit sx={{ color: "rgba(170, 170, 170, 1)" }} />
        </IconButton>
        <IconButton onClick={handleDuplicate}>
          <ContentCopy sx={{ color: "rgba(170, 170, 170, 1)" }} />
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
