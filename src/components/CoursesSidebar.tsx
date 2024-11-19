import { Box, SxProps } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "@mui/icons-material";
import { CourseType } from "../types/courses";

type courseProps = {
  course: { data: CourseType } | undefined;
};

type NavLink = {
  content: string;
  link: string;
  children?: NavLink[];
};
const navLinks: NavLink[] = [
  // { content: "Course Details", link: "details" },
  { content: "Students", link: "students" },
  { content: "Notes", link: "notes" },
  { content: "CBT ", link: "cbt" },
];

const CoursesSidebar = ({ course }: courseProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrentPage = (navLink: NavLink) => {
    if (navLink.content.toLowerCase() !== "") {
      if (location.pathname === navLink.link) return true;
    } else {
      if (location.pathname === "/instructor") return true;
    }

    if (navLink.children) {
      return navLink.children.some((child) => isCurrentChildLink(child));
    }

    return false;
  };

  const isCurrentChildLink = (childLink: NavLink) => {
    return location.pathname === childLink.link;
  };

  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box className="sidebar" sx={sideBarStyles}>
        <Box sx={navLinkStyles}>
          {navLinks.map((item) => (
            <Box key={`navlink-${item.content + 1}`}>
              <Link
                className={
                  location.pathname.includes(`/${item.link}`) ? "active" : ""
                }
                to={item.link}
              >
                {item.content}
              </Link>
              {isCurrentPage(item) && item.children ? (
                <Box sx={childLinkStyles}>
                  {item.children.map((child) => (
                    <Box
                      className={isCurrentChildLink(child) ? "active" : ""}
                      onClick={() =>
                        navigate(child.link, { state: { course } })
                      }
                      sx={{ border: "1px solid red" }}
                    >
                      <ChevronRight /> {child.content}
                    </Box>
                  ))}
                </Box>
              ) : null}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CoursesSidebar;

const sideBarStyles: SxProps = {
  bgcolor: "#fff",
  color: "primary.contrastText",
  //   padding: "2rem",
  position: "sticky",
  height: "100vh",
  top: 100,
  left: 0,
  overflow: "scroll",
  // marginLeft: "280px",
  width: "220px",

  "&::-webkit-scrollbar": {
    display: "none",
  },
};

const navLinkStyles: SxProps = {
  display: "grid",
  // gap: "1rem",
  fontSize: "0.85rem",

  a: {
    alignItems: "center",
    // borderRadius: "var(--border-radius)",
    display: "flex",
    gap: ".7rem",
    padding: "1.5rem",
    transition: ".2s",
    color: "#000000",
  },

  img: {
    height: "1.4rem",
  },

  "a.active": {
    bgcolor: "#02367833",
    color: "#000000",
    borderLeft: "6px solid #023678",
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
