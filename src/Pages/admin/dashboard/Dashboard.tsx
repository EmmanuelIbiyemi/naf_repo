import {
  Add,
  Assignment,
  BusinessCenter,
  Groups,
  History,
  Inventory,
} from "@mui/icons-material";
import { Box, Button, SxProps, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { useEffect } from "react";
import { selectCurrentUser } from "../../../store/auth.slice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(setPageName("Dashboard"));
  }, []);

  const navigate = useNavigate();

  const handleManageSite = () => {
    navigate("/settings/posttype/page");
  };

  return (
    <Box
      sx={{
        paddingInline: "2rem",
        display: "grid",
        placeContent: "center",
        padding: "5rem 7rem",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
      <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
        Welcome to your{" "}
        {import.meta.env.VITE_SCHOOL_ACRONYM}{" "}
        dashboard
      </Typography>
        <Typography
          sx={{ fontSize: "1.3rem", fontWeight: 300, marginTop: ".5rem" }}
        >
          {user?.first_name + " " + user?.last_name}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: "1.4rem",
          gridTemplateColumns: "1fr 1fr",
          marginTop: "3rem",
        }}
      >
        {cards.map((card) => (
          <Link to={card.link} key={`dashboard-card-${card.id}`}>
            <Box sx={cardStyles}>
              <Box className="icon">{card.icon}</Box>
              <Box>
                <Typography sx={{ fontSize: "1.4rem" }}>
                  {card.title}
                </Typography>
                <Typography
                  sx={{ fontWeight: 300, marginTop: "1rem", maxWidth: "60ch" }}
                >
                  {card.description}
                </Typography>
              </Box>
            </Box>
          </Link>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "end", marginTop: "1rem" }}>
        <Button variant="contained" onClick={handleManageSite}>
          Manage website
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;

const cardStyles: SxProps = {
  alignItems: "start",
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  display: "flex",
  gap: "1rem",
  padding: "1rem",

  ".icon": {
    bgcolor: "rgba(239, 243, 250, 1)",
    borderRadius: "var(--border-radius)",
    color: "primary.main",
    padding: ".35rem .5rem",
  },
};

const cards = [
  {
    id: 1,
    icon: <Add />,
    title: "Add other admins",
    description:
      "Assign and manage additional administrators to oversee and maintain system operations effectively.",
    link: "/users",
  },
  {
    id: 2,
    icon: <Assignment />,
    title: "Manage Courses",
    description:
      "Create, update, and organize courses for seamless learning. Ensure all content is up-to-date and accessible.",
    link: "/academics",
  },
  {
    id: 3,
    icon: <BusinessCenter />,
    title: "Add Instructors",
    description:
      "Add new instructors to the platform and assign them to specific courses or roles as needed.",
    link: "/users/lecturers",
  },
  {
    id: 4,
    icon: <Inventory />,
    title: "View Applications",
    description:
      "Review and process applications submitted by students or instructors. Approve or reject applications with ease.",
    link: "/applicants",
  },
  {
    id: 5,
    icon: <Groups />,
    title: "Add Students",
    description:
      "Enroll students into the system, assign them to courses, and ensure they have access to the resources they need.",
    link: "/users/students",
  },
  {
    id: 6,
    icon: <History />,
    title: "Activity Logs",
    description:
      "View and monitor all system activities. Track user actions, changes, and events across the platform.",
    link: "/activity-logs",
  },
];
