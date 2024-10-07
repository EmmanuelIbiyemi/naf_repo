import { Box } from "@mui/material";
import { setPageName } from "../../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import PageHeader from "../../../components/PageHeader";
import EmptyState from "../../../components/EmptyState";
import { useNavigate } from "react-router-dom";
import PostList from "./components/PostList";
import { selectPosts, setCurrentPost } from "../../../store/posts.slice";
import { useEffect } from "react";

const PostPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Posts"));
  }, []);

  const navigate = useNavigate();
  const forms = useAppSelector(selectPosts);

  const action = () => {
    dispatch(setCurrentPost(undefined));
    navigate("/posts/add");
  };

  return (
    <Box className="content-container">
      <PageHeader
        button={{
          action: action,
          text: "Create",
        }}
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        {forms.length ? (
          <PostList />
        ) : (
          <EmptyState
            title="Oops! There’s nothing here!"
            subTitle="Posts will appear here after you add them."
          />
        )}
      </Box>
    </Box>
  );
};

export default PostPage;
