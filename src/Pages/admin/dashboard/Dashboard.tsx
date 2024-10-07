import {
  Add,
  Assignment,
  BusinessCenter,
  Groups,
  Inventory,
  VolumeUp,
} from "@mui/icons-material";
import { Box, Button, SxProps, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  dispatch(setPageName("Dashboard"));

  const navigate = useNavigate();

  const handleManageSite = () => {
    navigate("posts");
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
          Welcome to your NAFCONS dashboard
        </Typography>
        <Typography
          sx={{ fontSize: "1.3rem", fontWeight: 300, marginTop: ".5rem" }}
        >
          Amina Rabiu Mustapha
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
          <Link to="/" key={`dashboard-card-${card.id}`}>
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
  },
  {
    id: 2,
    icon: <Assignment />,
    title: "Manage Courses",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
  {
    id: 3,
    icon: <BusinessCenter />,
    title: "Add Instructors",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
  {
    id: 4,
    icon: <Inventory />,
    title: "View Applications",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
  {
    id: 5,
    icon: <Groups />,
    title: "Add Students",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
  {
    id: 6,
    icon: <VolumeUp />,
    title: "Create Announcement",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
];
