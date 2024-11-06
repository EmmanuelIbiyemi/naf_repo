import { Box, SxProps } from "@mui/material";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type NavLink = {
  content: string;
  link: string;
  children?: NavLink[];
};

const SettingsSideBar = () => {
  const location = useLocation();
  const [navLinks] = useState<NavLink[]>([
    { content: "Media Library", link: "/settings" },
    { content: "Posts", link: "/settings/posts" },
    { content: "Pages", link: "/settings/pages" },
    { content: "Navigation", link: "/settings/navigation" },
    { content: "Footer", link: "/settings/footer" },
    // { content: "Home Page", link: "/settings/page/home" },
    // { content: "About Page", link: "/settings/page/about" },
    // { content: "Updates Page", link: "/settings/page/updates" },
    // { content: "Courses Page", link: "/settings/page/courses" },
  ]);

  const isCurrentPage = (navLink: NavLink) => {
    if (location.pathname === navLink.link) return true;
    return false;
  };

  return (
    <Box sx={sidebarStyles}>
      {navLinks.map((item) => (
        <Box key={`navlink-${item.content + 1}`} sx={navLinkStyles}>
          <Link className={isCurrentPage(item) ? "active" : ""} to={item.link}>
            {item.content}
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default SettingsSideBar;

const sidebarStyles: SxProps = {
  bgcolor: "#fff",
  borderRight: "1px solid rgba(204, 204, 204, 0.5)",
  height: "100vh",
  position: "sticky",
  top: 0,
};

const navLinkStyles: SxProps = {
  a: {
    display: "block",
    paddingBlock: "1.4rem",
    paddingLeft: "1rem",

    "&.active": {
      bgcolor: "rgba(204, 204, 204, 0.3)",
      borderLeft: "5px solid rgba(2, 54, 120, 1)",
    },
  },
};
