import { Box, SxProps } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../../assets/homeIcon";
import SettingsIcon from "../../assets/settingsIcon";
import { ElementType } from "react";
import ClipBoardIcon from "../../assets/clipboardIcon";
import { ChevronRight } from "@mui/icons-material";
import ViewBoard from "../../assets/ViewBoard";
import ReportsIcon from "../../assets/reportsIcon";
import LiveClassIcon from "../../assets/liveClassIcon";
import GraduationScroll from "../../assets/graduation-scroll";

type NavLink = {
  content: string;
  icon: ElementType;
  link: string;
  children?: NavLink[];
};
const navLinks: NavLink[] = [
  { content: "Dashboard", icon: HomeIcon, link: "/student/dashboard" },
  { content: "Overview", icon: ViewBoard, link: "/student/overview" },
  { content: "Courses", icon: ClipBoardIcon, link: "/student/courses" },
  { content: "CBT", icon: GraduationScroll, link: "/student/cbt" },
  { content: "Results", icon: ReportsIcon, link: "/student/results" },
  { content: "Live Class", icon: LiveClassIcon, link: "/student/live-class" },
  { content: "Settings", icon: SettingsIcon, link: "/student/settings" },
];

const SideBar = () => {
  const location = useLocation();

const isCurrentPage = (navLink: NavLink) => {
  const currentPath = location.pathname.toLowerCase();
  const navLinkPath = navLink.link.toLowerCase();

  // Check if the current page matches exactly or is a subdirectory of the link
    if (currentPath === navLinkPath || currentPath.startsWith(`${navLinkPath}/`)) {
      return true;
    }


  // Check for child links
  if (navLink.children) {
    return navLink.children.some((child) => isCurrentChildLink(child));
  }

  return false;
};


  const isCurrentChildLink = (childLink: NavLink) => {
    return location.pathname === childLink.link;
  };

  return (
    <Box className="sidebar" sx={sideBarStyles}>
      <img
        src={import.meta.env.VITE_LOGO}
        alt=""
        width={80}
        style={{ display: "block", marginInline: "auto" }}
      />
      <Box sx={navLinkStyles}>
        {navLinks.map((item) => (
          <Box key={`navlink-${item.content + 1}`}>
            <Link
              className={isCurrentPage(item) ? "active" : ""}
              to={item.link}
            >
              <item.icon
                color={isCurrentPage(item) ? "rgba(2, 54, 120, 1)" : "#fff"}
              />
              {item.content}
            </Link>
            {isCurrentPage(item) && item.children ? (
              <Box sx={childLinkStyles}>
                {item.children.map((child) => (
                  <Link
                    key={`child-link-${child.content}`}
                    to={child.link}
                    className={isCurrentChildLink(child) ? "active" : ""}
                  >
                    <ChevronRight /> {child.content}
                  </Link>
                ))}
              </Box>
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SideBar;

const sideBarStyles: SxProps = {
  bgcolor: "primary.main",
  color: "primary.contrastText",
  padding: "2rem",
  position: "fixed",
  height: "100vh",
  top: 0,
  overflow: "scroll",
  width: "280px",
  zIndex: 100,

  "&::-webkit-scrollbar": {
    display: "none",
  },
};

const navLinkStyles: SxProps = {
  display: "grid",
  gap: "1rem",
  marginTop: "3rem",

  a: {
    alignItems: "center",
    borderRadius: "var(--border-radius)",
    display: "flex",
    gap: ".7rem",
    padding: "1rem",
    transition: ".2s",
  },

  img: {
    height: "1.4rem",
  },

  "a.active": {
    bgcolor: "primary.contrastText",
    color: "primary.main",
  },
};

const childLinkStyles: SxProps = {
  bgcolor: "rgba(3, 105, 161, 1)",
  marginTop: "1rem",
  a: {
    borderRadius: 0,
  },
  ".active": {
    bgcolor: "rgba(255, 255, 255, 0.9)",
  },
};
