import React, { useEffect } from "react";
import { School, AssignmentTurnedIn, History, VideoLibrary } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Avatar,
  SxProps,
  Theme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName, setPageLoading } from "../../../store/app.slice";
import { useGetParticipantQuery } from "../../../store/api/participants.api";
import EmptyState from "../../../components/EmptyState";
import { selectCurrentUser } from "../../../store/auth.slice";

// Types
interface DashboardCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  link: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0;
  const {
    data: participantData,
    isLoading,
    error,
  } = useGetParticipantQuery(participantId);

  useEffect(() => {
    dispatch(setPageName("Dashboard"));
  }, [dispatch]);

  const cards: DashboardCard[] = [
    { id: 1, icon: <School />, title: "My Courses", link: "/student/courses" },
    { id: 2, icon: <AssignmentTurnedIn />, title: "Check Results", link: "/student/results" },
    { id: 3, icon: <VideoLibrary />, title: "Live Classes", link: "/student/live-class" },
    { id: 4, icon: <History />, title: "My Activity", link: "/student/my-activity" },
  ];

  useEffect(() => {
    if (isLoading) {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [isLoading, dispatch]);

  if (error || !participantData) {
    return (
      <Box sx={{ padding: "2rem" }}>
        <EmptyState
          title="Error loading dashboard"
          subTitle="There was a problem loading your information. Please try again later."
        />
      </Box>
    );
  }

  const participant = participantData.data;

  return (
    <Box sx={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
        <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
          Welcome to your {import.meta.env.VITE_SCHOOL_ACRONYM} dashboard
        </Typography>
        <Typography
          sx={{
            fontSize: "1.1rem",
            fontWeight: 300,
            marginTop: ".5rem",
            color: "text.secondary",
          }}
        >
          {participant.first_name} {participant.last_name}
        </Typography>
      </Box>

      {/* Main Content Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 350px" },
          gap: "2rem",
        }}
      >
        {/* Left Side - Cards */}
        <Box
          sx={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(2, 1fr)",
            alignContent: "start",
          }}
        >
          {cards.map((card) => (
            <Link
              key={`dashboard-card-${card.id}`}
              to={card.link}
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

        {/* Right Side - Profile Card */}
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {participant.photo ? (
            <Avatar
              src={participant.photo}
              sx={{
                width: 100,
                height: 100,
                marginBottom: "1rem",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 100,
                height: 100,
                marginBottom: "1rem",
                bgcolor: "primary.main",
                fontSize: "2.5rem",
              }}
            >
              {participant.first_name?.[0]}
              {participant.last_name?.[0]}
            </Avatar>
          )}
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 500 }}>
            {participant.first_name} {participant.last_name}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.9rem" }}>
            {participant.matric_number || "N/A"}
          </Typography>
          <Typography
            sx={{ color: "text.secondary", fontSize: "0.9rem", mt: 0.5, textAlign: "center" }}
          >
            {participant.level?.program?.department?.name || "N/A"} • {participant.level?.name || "N/A"}
          </Typography>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Typography sx={{ color: "text.secondary", fontSize: "0.85rem", mb: 1 }}>
              Contact Information
            </Typography>
            <Typography sx={{ fontSize: "0.85rem" }}>Email: {participant.email}</Typography>
            <Typography sx={{ fontSize: "0.85rem" }}>Phone: {participant.phone}</Typography>
          </Box>
          <Link to="/student/settings" style={{ textDecoration: "none", width: "100%" }}>
            <Button variant="contained" fullWidth sx={{ marginTop: "1.5rem" }}>
              Profile Settings
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

const cardStyles: SxProps<Theme> = {
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

export default Dashboard;
