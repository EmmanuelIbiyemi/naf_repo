import { Notifications } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  Typography,
  Badge,
} from "@mui/material";
import { selectPageName } from "../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  logout,
  selectCurrentRefreshToken,
  selectCurrentUser,
} from "../../store/auth.slice";
import { useNavigate } from "react-router-dom";
import { MouseEvent, useState } from "react";
import NotificationMenu from "../AnnouncementDropdown"; // Adjust the import path as needed
import { useLogoutMutation } from "../../store/api/auth.api";

const Header = () => {
  const pageName = useAppSelector(selectPageName);
  const user = useAppSelector(selectCurrentUser);
  const refreshToken = useAppSelector(selectCurrentRefreshToken);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutUserApi] = useLogoutMutation();

  const [mainPage, subPage] = pageName.split("/");
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);

  const profileOpen = Boolean(profileAnchorEl);

  const handleProfileClick = (event: MouseEvent<HTMLDivElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (user?.role === "admin") navigate("/settings/posttype/announcement");
    else setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const logoutUser = async () => {
    handleProfileClose();
    try {
      await logoutUserApi({
        refresh_token:
          refreshToken || localStorage.getItem("refresh_token") || undefined,
      }).unwrap();
    } catch (error) {
      // Silently continue; local cleanup below handles UI state
      console.error("Failed to notify server about logout", error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <Box className="header" sx={headerStyles}>
      <Typography
        component="h1"
        sx={{
          color: "rgba(85, 85, 85, 1)",
          fontSize: "1.7rem",
          fontWeight: "500 !important",
        }}
      >
        {mainPage}
        {subPage && (
          <Typography
            component="span"
            sx={{
              fontSize: "0.7em",
              fontWeight: "100 !important",
              marginLeft: "0.2em",
            }}
          >
            / {subPage}
          </Typography>
        )}
      </Typography>
      <Box sx={actionsStyles}>
        <Box>
          <IconButton onClick={handleNotificationClick}>
            {user?.role !== "admin" ? (
              <Badge color="error" variant="dot">
                <Notifications />
              </Badge>
            ) : (
              <Notifications />
            )}
          </IconButton>
        </Box>
        <Box sx={flexStyles}>
          <Box
            sx={{
              textAlign: "right",
              ".MuiTypography-root": { fontWeight: "500 !important" },
            }}
          >
            <Typography
              sx={usernameStyles}
            >{`${user?.first_name} ${user?.last_name}`}</Typography>
            <Typography
              sx={{
                color: "rgba(160, 152, 174, 1)",
                letterSpacing: 0.1,
                textTransform: "capitalize",
              }}
            >
              {user?.role || "Admin"}
            </Typography>
          </Box>
          <Box
            className="has_bg_image"
            sx={profileImageStyles}
            onClick={handleProfileClick}
          >
            <img className="bg" src={user?.photo} alt="" />
          </Box>
          <Menu
            anchorEl={profileAnchorEl}
            open={profileOpen}
            onClose={handleProfileClose}
          >
            <Typography sx={{ padding: ".8rem 1rem" }}>
              {user?.email}
            </Typography>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      <NotificationMenu
        anchorEl={notificationAnchorEl}
        onClose={handleNotificationClose}
        userRole={user?.role}
      />
    </Box>
  );
};

export default Header;

const flexStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  gap: "1rem",
};

const headerStyles: SxProps = {
  ...flexStyles,
  borderBottom: "1px solid rgba(204, 204, 204, 1)",
  gridArea: "header",
  justifyContent: "space-between",
  paddingInline: "var(--padding)",
  "@media print": {
    display: "none",
  },
};

const usernameStyles: SxProps = {
  letterSpacing: 0.1,
  textTransform: "uppercase",
  maxWidth: "9ch",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const actionsStyles: SxProps = {
  ...flexStyles,
  gap: "2rem",
  ".MuiIconButton-root": {
    bgcolor: "#fff",
    borderRadius: "100%",
    svg: { fontSize: "1.7rem" },
  },
};

const profileImageStyles: SxProps = {
  bgcolor: "primary.main",
  height: "50px",
  width: "50px",
  borderRadius: "100%",
  overflow: "hidden",
  cursor: "pointer",
};
