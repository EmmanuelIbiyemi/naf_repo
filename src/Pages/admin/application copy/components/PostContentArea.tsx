import { Box, SxProps, Typography } from "@mui/material";
import cursorIcon from "../../../../assets/cursor.svg";
import { FocusEvent } from "react";
import { useDroppable } from "@dnd-kit/core";
import PostBuilder from "./PostBuilder";
import { PostType } from "../../../../types/posts";

type Props = {
  post: PostType;
  setPost: React.Dispatch<React.SetStateAction<PostType>>;
};

const PostContentArea = ({ post, setPost }: Props) => {
  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  const handleFormPropsChange = (e: FocusEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    if (target && target.id) {
      setPost((prev) => ({
        ...prev,
        [target.id]: target.textContent?.trim() || "",
      }));
    }
  };

  return (
    <Box sx={formContentContainerStyles}>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            <span
              id="title"
              contentEditable="true"
              onBlur={handleFormPropsChange}
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
          </Typography>
        </Box>
        <Box ref={setNodeRef} sx={{ position: "relative" }}>
          {post.elements.length ? (
            <Box sx={{ padding: "1.5rem" }}>
              <PostBuilder post={post} setPost={setPost} />
            </Box>
          ) : (
            <Box sx={emptyDropAreaStyles}>
              <Box className="dashed_border" sx={{ textAlign: "center" }}>
                <img src={cursorIcon} alt="" />
                <Box>
                  <Typography>
                    Drag your first element here from the left
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PostContentArea;

const formContentContainerStyles: SxProps = {
  display: "grid",
  padding: "2rem",
  placeItems: "center",
};

const dropContainerStyles: SxProps = {
  bgcolor: "#fff",
  display: "grid",
  gridTemplateRows: "80px 1fr 80px",
  width: "80%",
};

const emptyDropAreaStyles: SxProps = {
  display: "grid",
  paddingInline: "3rem",
  placeItems: "center",
  height: "50vh",

  ">div": {
    bgcolor: "rgba(204, 204, 204, 0.3)",
    borderRadius: "var(--border-radius)",
    padding: "2rem",
  },
};
