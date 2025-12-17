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
          Welcome to your {import.meta.env.VITE_SCHOOL_ACRONYM} dashboard
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
          gap: "1rem",
          gridTemplateColumns: "repeat(3, 1fr)",
          marginTop: "3rem",
        }}
      >
        {cards.map((card) => (
          <Link
            to={card.link}
            key={`dashboard-card-${card.id}`}
            style={{ textDecoration: "none" }}
          >
            <Box sx={cardStyles}>
              <Box className="icon">{card.icon}</Box>
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 500, color: "text.primary" }}>
                {card.title}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <Button variant="contained" onClick={handleManageSite}>
          Manage website
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;

const cardStyles: SxProps = {
  alignItems: "center",
  bgcolor: "#fff",
  borderRadius: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  padding: "1.5rem 1rem",
  textAlign: "center",
  transition: "all 0.2s ease-in-out",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    transform: "translateY(-2px)",
  },
  ".icon": {
    bgcolor: "rgba(239, 243, 250, 1)",
    borderRadius: "12px",
    color: "primary.main",
    padding: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& svg": {
      fontSize: "1.5rem",
    },
  },
};

const cards = [
  { id: 1, icon: <Add />, title: "Add Admins", link: "/users" },
  { id: 2, icon: <Assignment />, title: "Manage Courses", link: "/academics" },
  { id: 3, icon: <BusinessCenter />, title: "Add Instructors", link: "/users/lecturers" },
  { id: 4, icon: <Inventory />, title: "View Applications", link: "/applicants" },
  { id: 5, icon: <Groups />, title: "Add Students", link: "/users/students" },
  { id: 6, icon: <History />, title: "Activity Logs", link: "/activity-logs" },
];
