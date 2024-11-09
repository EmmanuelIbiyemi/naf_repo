import {
  Add,
  Assignment,
  BusinessCenter,
  Groups,
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
    navigate("/settings");
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
          Welcome to your ATSTC dashboard
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
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
    link: "/users",
  },
  {
    id: 2,
    icon: <Assignment />,
    title: "Manage Courses",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
    link: "/academics",
  },
  {
    id: 3,
    icon: <BusinessCenter />,
    title: "Add Instructors",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
    link: "/instructors",
  },
  {
    id: 4,
    icon: <Inventory />,
    title: "View Applications",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
    link: "/applicants",
  },
  {
    id: 5,
    icon: <Groups />,
    title: "Add Students",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
    link: "/users/students",
  },
];
