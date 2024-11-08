import { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { selectAnnouncement } from "../../../store/announcement.slice";
import PostList from "./posts/PostList";
import EmptyState from "../../../components/EmptyState";

const Announcements = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Announcement"));
  }, [dispatch]);

  const navigate = useNavigate();
  const forms = useAppSelector(selectAnnouncement);

  console.log(forms);
  return (
    <Box sx={{ bgcolor: "#F5F5F5", minHeight: "100vh", py: 3 }}>
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "8px",
          mx: "auto",
          maxWidth: "95%",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                fontSize: "1.5rem",
                lineHeight: "40.32px",
                color: "#474747",
              }}
            >
              Announcements
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "1rem",
                color: "#9A9A9A",
                lineHeight: "20.16px",
                fontWeight: 300,
              }}
            >
              List of posts that have been created and shared in the school
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate(`add`)}>
            Create New Post
          </Button>
        </Box>

        <Box sx={{ marginTop: "2em" }}>
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
    </Box>
  );
};

export default Announcements;
