import { useMemo, useState } from "react";
import { useGetAnnouncementsQuery } from "../store/api/posts.api";
import {
  Box,
  Menu,
  Typography,
  MenuItem,
  Divider,
  IconButton,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Post } from "../types/announcements";
import { useLocation, useNavigate } from "react-router-dom";

interface NotificationMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  userRole?: string;
}

const NotificationMenu = ({
  anchorEl,
  onClose,
  userRole,
}: NotificationMenuProps) => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const open = Boolean(anchorEl);

  const shouldFetch = useMemo(
    () => location.pathname.toLowerCase().includes("dashboard"),
    [location.pathname]
  );

  const { data, isLoading, isError } = useGetAnnouncementsQuery("announcement", {
    skip: !shouldFetch,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleAnnouncementClick = (announcement: Post) => {
    onClose();
    if (userRole === "admin") {
      navigate(`/settings/posttype/announcement/${announcement.id}`);
    } else if (userRole === "instructor") {
      navigate(`/instructor/announcements/${announcement.id}`);
    } else if (userRole === "participant") {
      navigate(`/student/announcements/${announcement.id}`);
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: "400px",
          maxHeight: "500px",
          width: "100%",
          mt: 1.5,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
          Notifications
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      {!shouldFetch ? (
        <MenuItem disabled>
          <Typography color="text.secondary">
            Announcements load on dashboard/announcement pages.
          </Typography>
        </MenuItem>
      ) : isLoading ? (
        <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={24} />
        </Box>
      ) : isError || !data ? (
        <MenuItem disabled>
          <Typography color="error">Error loading notifications</Typography>
        </MenuItem>
      ) : (
        <Box>
          {data.post.length === 0 ? (
            <MenuItem disabled>
              <Typography>No notifications</Typography>
            </MenuItem>
          ) : (
            data.post.map((announcement: Post) => (
              <MenuItem
                key={announcement.id}
                onClick={() => handleAnnouncementClick(announcement)}
                sx={{
                  whiteSpace: "normal",
                  py: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    {announcement.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    {announcement.date}
                  </Typography>
                    {announcement?.blocks?.map((block) => {
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
                </Box>
              </MenuItem>
            ))
          )}

          {data.pagination.pages > 1 && (
            <Box
              sx={{
                p: 1.5,
                display: "flex",
                justifyContent: "center",
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Pagination
                count={data.pagination.pages}
                page={page}
                onChange={handlePageChange}
                size="small"
                color="primary"
              />
            </Box>
          )}
        </Box>
      )}
    </Menu>
  );
};

export default NotificationMenu;
