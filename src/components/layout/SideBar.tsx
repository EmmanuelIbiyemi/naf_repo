import { Box, SxProps } from "@mui/material";
import logo from "../../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "../../assets/homeIcon";
import ChartIcon from "../../assets/chartIcon";
import InstructorIcon from "../../assets/instructorIcon";
import BankIcon from "../../assets/bankIcon";
import SettingsIcon from "../../assets/settingsIcon";
import { ElementType } from "react";
import ClipBoardIcon from "../../assets/clipboardIcon";

type NavLink = {
  content: string;
  icon: ElementType;
  link: string;
};
const navLinks: NavLink[] = [
  { content: "Dashboard", icon: HomeIcon, link: "/" },
  { content: "Courses", icon: ClipBoardIcon, link: "/courses" },
  { content: "Participants", icon: ChartIcon, link: "/participants" },
  { content: "Instructors", icon: InstructorIcon, link: "/instructors" },
  { content: "Applications", icon: BankIcon, link: "/applicantions" },
  { content: "Settings", icon: SettingsIcon, link: "/settings" },
];

const SideBar = () => {
  const location = useLocation();
  const isCurrentPage = (navLink: NavLink) => {
    if (navLink.content.toLowerCase() != "dashboard")
      return location.pathname.includes(navLink.link);
    else return location.pathname == "/";
  };

  return (
    <Box className="sidebar" sx={sideBarStyles}>
      <img
        src={logo}
        alt=""
        width={80}
        style={{ display: "block", marginInline: "auto" }}
      />
      <Box sx={navLinkStyles}>
        {navLinks.map((item) => (
          <Link
            key={`navlink-${item.content + 1}`}
            className={isCurrentPage(item) ? "active" : ""}
            to={item.link}
          >
            <item.icon
              color={isCurrentPage(item) ? "rgba(2, 54, 120, 1)" : "#fff"}
            />
            {item.content}
          </Link>
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
  position: "sticky",
  height: "100vh",
  top: 0,
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
