import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setPageName } from "../../../../store/app.slice";
import {
  selectAnnouncement,
  setCurrentAnnouncement,
} from "../../../../store/announcement.slice";
import PageHeader from "../../../../components/PageHeader";
import EmptyState from "../../../../components/EmptyState";
import PostList from "./PostList";

const PostPage = () => {
  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Posts"));
  }, [dispatch]);

  const navigate = useNavigate();
  const forms = useAppSelector(selectAnnouncement);

  const action = () => {
    dispatch(setCurrentAnnouncement(undefined));
    navigate("instructor/posts/add");
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
