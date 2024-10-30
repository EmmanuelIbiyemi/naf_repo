import {
  School,
  CreditCard,
  AssignmentTurnedIn,
  Description,
} from "@mui/icons-material";
import { Box, Button, SxProps, Typography, Avatar } from "@mui/material";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { useEffect } from "react";
import { Link } from "react-router-dom"
const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageName("Dashboard"));
  },);


  return (
    <Box sx={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
        <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
          Welcome to your NAFCONS dashboard
        </Typography>
        <Typography
          sx={{ fontSize: "1.1rem", fontWeight: 300, marginTop: ".5rem", color: "text.secondary" }}
        >
          Amina Rabiu Mustapha
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 400px" },
          gap: "2rem",
        }}
      >
        {/* Left Side - Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {cards.map((card) => (
            <Box
              key={`dashboard-card-${card.id}`}
              sx={{
                ...cardStyles,
                "&:hover": {
                  boxShadow: 3,
                  transition: "box-shadow 0.3s ease-in-out",
                },
              }}
            >
              <Box className="icon">{card.icon}</Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                  {card.title}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 300,
                    marginTop: ".5rem",
                    color: "text.secondary",
                    fontSize: "0.9rem",
                  }}
                >
                  {card.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Right Side - Profile Card */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "var(--border-radius)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 1,
          }}
        >
          <Avatar
            sx={{
              width: 128,
              height: 128,
              marginBottom: "1rem",
            }}
          />
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 500 }}>
            Amina Rabiu Mustapha
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
            NAFCONS/17/CSC/2020
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.9rem", mt: 0.5 }}>
            Full Time • Computer Science • 300 Level
          </Typography>
          <Link to={"/student/settings"}>
            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: "1.5rem" }}
            >
              Profile Settings
            </Button>
          </Link>
          
        </Box>
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
  boxShadow: 1,

  ".icon": {
    bgcolor: "rgba(239, 243, 250, 1)",
    borderRadius: "var(--border-radius)",
    color: "primary.main",
    padding: ".5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

const cards = [
  {
    id: 1,
    icon: <School />,
    title: "Course Enrollment",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
  },
  {
    id: 2,
    icon: <CreditCard />,
    title: "Pay Fees",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
  },
  {
    id: 3,
    icon: <AssignmentTurnedIn />,
    title: "Check Result",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
  },
  {
    id: 4,
    icon: <Description />,
    title: "View Applications",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they'll appear on your site!",
  },
];