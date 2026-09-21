// Types
interface Media {
  created_at: string;
  id: number;
  name: string;
  type: string;
  updated_at: string;
  url: string;
}

interface Block {
  caption?: string;
  content: string;
  id: number;
  link: string | null;
  media?: Media[];
  position: number;
  title: string | null;
  type: string;
}

interface Category {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
}

interface Tag {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
}

interface Post {
  blocks: Block[];
  categories: Category[];
  created_at: string;
  date: string;
  featured_image: string;
  id: number;
  slug: string;
  tags: Tag[];
  title: string;
  updated_at: string;
}

export interface AnnouncementResponse {
  message: string;
  post: Post;
}

import { useParams, useNavigate } from "react-router-dom";
import { useGetSingleAnnouncementQuery } from "../../../store/api/posts.api";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Chip,
  useTheme,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import {
  CalendarToday,
  Person,
  ArrowBack,
  AccessTime,
} from "@mui/icons-material";
import { format } from "date-fns";

const SingleAnnouncementPage = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetSingleAnnouncementQuery(Number(id));

  const announcement = response?.post;

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Skeleton variant="text" width={200} height={40} />
        <Box sx={{ mt: 3 }}>
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" />
          </Box>
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3 }}>
          Back
        </Button>
        <Alert severity="error">
          Error loading announcement. Please try again later.
          {error && "status" in error && (
            <Typography variant="caption" display="block">
              Error {error.status}: {JSON.stringify(error.data)}
            </Typography>
          )}
        </Alert>
      </Box>
    );
  }

  if (!announcement) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3 }}>
          Back
        </Button>
        <Alert severity="info">Announcement not found.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 3 }}>
        Back
      </Button>

      <Paper
        elevation={2}
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {announcement.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <Person />
              </Avatar>
              <Typography variant="body2">Admin</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {format(new Date(announcement.date), "MMMM dd, yyyy")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {format(new Date(announcement.date), "hh:mm a")}
              </Typography>
            </Box>
          </Box>

          {/* Tags */}
          {announcement.tags && announcement.tags.length > 0 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {announcement.tags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  sx={{
                    bgcolor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Content Section */}
        <Box
          sx={{
            "& > *:not(:last-child)": {
              mb: 2,
            },
          }}
        >
          {announcement?.blocks?.map((block) => (
            <Box key={block.id}>
              {block.type === 'heading' && (
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {block.content}
                </Typography>
              )}

              {block.type === 'text' && (
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {block.content}
                </Typography>
              )}

              {block.type === 'image' && block.media?.[0] && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={block.media[0].url}
                    alt={block.media[0].name}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                  {block.caption && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      {block.caption}
                    </Typography>
                  )}
                </Box>
              )}

              {block.type === 'video' && block.media?.[0] && (
                <Box sx={{ mt: 2 }}>
                  <video
                    controls
                    style={{ maxWidth: "100%", height: "auto" }}
                  >
                    <source src={block.media[0].url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {block.caption && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                      {block.caption}
                    </Typography>
                  )}
                </Box>
              )}

              {block.type === 'link' && (
                <Typography variant="body1">
                  <a 
                    href={block.link || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    {block.title || block.link}
                  </a>
                </Typography>
              )}

              {block.type === 'page' && block.link && (
                <Typography variant="body1">
                  <a 
                    href={block.link}
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    {block.title || 'View Page'}
                  </a>
                </Typography>
              )}

              {block.type === 'big_space' && (
                <Box sx={{ height: 48 }} />
              )}

              {block.type === 'small_space' && (
                <Box sx={{ height: 24 }} />
              )}
            </Box>
          ))}
        </Box>

        {/* Footer Section */}
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Last updated:{" "}
              {format(new Date(announcement.updated_at), "MMMM dd, yyyy")}
            </Typography>

            {announcement.categories && announcement.categories.length > 0 && (
              <Chip
                label={announcement.categories[0].name}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default SingleAnnouncementPage;
