import { Box, SxProps } from "@mui/material";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type NavLink = {
  content: string;
  link: string;
  children?: NavLink[];
};

const UsersSideBar = () => {
  const location = useLocation();
  const [navLinks] = useState<NavLink[]>([
    { content: "Admins", link: "/users" },
    { content: "Lecturers", link: "/users/lecturers" },
    { content: "Students", link: "/users/students" },
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

export default UsersSideBar;

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
