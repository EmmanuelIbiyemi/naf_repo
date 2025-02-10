import { useState } from "react";
import { useGetAnnouncementsQuery } from "../../../store/api/posts.api";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import { Post } from "../../../types/announcements";

const AnnouncementsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAnnouncementsQuery("announcement");

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h5">Loading announcements...</Typography>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Typography variant="h5">
          Error loading announcements. Please try again later.
        </Typography>
      </Box>
    );
  }

  // Now TypeScript knows data is defined and has the correct type
  const { post, pagination } = data;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Announcements
      </Typography>

      <Grid container spacing={3}>
        {post.map((announcement: Post) => (
          <Grid item xs={12} sm={6} md={4} key={announcement.id}>
            <Card>
              <CardHeader title={announcement.title} />
              <CardContent>
                <Typography variant="body1">{announcement.date}</Typography>
                {announcement.blocks.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    {announcement.blocks.map((block) => {
                    if (block.type === 'text') {
                      return (
                      <Typography
                        key={block.id}
                        variant="body2"
                        color="text.secondary"
                        sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        }}
                      >
                        {block.content}
                      </Typography>
                      );
                    }
                    return null;
                    })[0]}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination
          count={pagination.pages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default AnnouncementsPage;
