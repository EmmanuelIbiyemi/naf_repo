import { Box, SxProps } from "@mui/material";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import HomeIcon from "../../assets/homeIcon";
import ChartIcon from "../../assets/chartIcon";
import InstructorIcon from "../../assets/instructorIcon";
import BankIcon from "../../assets/bankIcon";
import SettingsIcon from "../../assets/settingsIcon";
import { useState } from "react";

const navLinks = [
  { content: "Dashboard", icon: HomeIcon, link: "/" },
  { content: "Participants", icon: ChartIcon, link: "/" },
  { content: "Instructors", icon: InstructorIcon, link: "/" },
  { content: "Application", icon: BankIcon, link: "/" },
  { content: "Settings", icon: SettingsIcon, link: "/" },
];

const SideBar = () => {
  const [active, setActive] = useState(0);
  const handleSetActive = (id: number) => {
    setActive(id);
  };

  return (
    <Box sx={sideBarStyles}>
      <img
        src={logo}
        alt=""
        width={80}
        style={{ display: "block", marginInline: "auto" }}
      />
      <Box sx={navLinkStyles}>
        {navLinks.map((item, i) => (
          <Link
            onClick={() => handleSetActive(i)}
            className={active == i ? "active" : ""}
            to={item.link}
          >
            <item.icon color={active == i ? "rgba(2, 54, 120, 1)" : "#fff"} />
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
  gridArea: "sidebar",
  padding: "2rem",
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
