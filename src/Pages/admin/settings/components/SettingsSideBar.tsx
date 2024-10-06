import { Box, SxProps } from "@mui/material";
import { Link } from "react-router-dom";

type NavLink = {
  content: string;
  link: string;
  children?: NavLink[];
};

const navLinks: NavLink[] = [
  { content: "Media Library", link: "/settings" },
  { content: "About Page", link: "/settings/about" },
  { content: "Updates Page", link: "/settings/updates" },
  { content: "Courses Page", link: "/settings/courses" },
  { content: "Contact Page", link: "/settings/contact" },
];

const SettingsSideBar = () => {
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
  borderRight: "1px solid rgba(204, 204, 204, 0.5)",
  height: "100%",
  position: "sticky",
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
