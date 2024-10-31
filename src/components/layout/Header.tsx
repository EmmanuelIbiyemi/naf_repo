import { Help, Notifications } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  Typography,
} from "@mui/material";
import { selectPageName } from "../../store/app.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectCurrentUser } from "../../store/auth.slice";
import { useNavigate } from "react-router-dom";
import { MouseEvent, useState } from "react";

const Header = () => {
  const pageName = useAppSelector(selectPageName);
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [mainPage, subPage] = pageName.split("/");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutUser = () => {
    handleClose();
    dispatch(logout());
    navigate("/login");
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
              fontSize: "0.7em", // Make it smaller
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
          {user?.role === "instructor" ? (
            <IconButton onClick={() => navigate("/posts")}>
              <Notifications />
            </IconButton>
          ) : (
            <IconButton onClick={() => navigate("/instructor/post")}>
              <Notifications />
            </IconButton>
          )}
          <IconButton sx={{ marginLeft: ".9rem" }}>
            <Help />
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
            onClick={handleClick}
          >
            <img className="bg" src="" alt="" />
          </Box>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <Typography sx={{ padding: ".8rem 1rem" }}>
              {user?.email}
            </Typography>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
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
