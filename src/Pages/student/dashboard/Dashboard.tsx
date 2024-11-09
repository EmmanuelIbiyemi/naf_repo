import React, { useEffect } from "react";
import { School, AssignmentTurnedIn } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Avatar,
  SxProps,
  Theme,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import { useGetParticipantQuery } from "../../../store/api/participants.api";
import EmptyState from "../../../components/EmptyState";
import { selectCurrentUser } from "../../../store/auth.slice";

// Types
interface DashboardCard {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  // Assuming we're getting the participant ID from somewhere (e.g., context, route params)
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0; // Replace with actual ID source
  const {
    data: participantData,
    isLoading,
    error,
  } = useGetParticipantQuery(participantId);

  useEffect(() => {
    dispatch(setPageName("Dashboard"));
  }, [dispatch]);

  const cards: DashboardCard[] = [
    {
      id: 1,
      icon: <School />,
      title: "Course Enrollment",
      description: `View and manage your ${
        participantData?.data.courses?.length || 0
      } course enrollments`,
      link: "/student/courses",
    },
    {
      id: 3,
      icon: <AssignmentTurnedIn />,
      title: "Check Result",
      description: "View your academic performance and semester results",
      link: "/student/results",
    },
  ];

  if (isLoading) {
    return (
      <Box
        sx={{
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
          Welcome to your ATSTC Student dashboard
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
          gridTemplateColumns: { xs: "1fr", md: "1fr 400px" },
          gap: "2rem",
        }}
      >
        {/* Left Side - Cards */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {cards.map((card) => (
            <Link
              key={`dashboard-card-${card.id}`}
              to={card.link}
              style={{ textDecoration: "none" }}
            >
              <Box
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
            </Link>
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
          {participant.photo ? (
            <Avatar
              src={participant.photo}
              sx={{
                width: 128,
                height: 128,
                marginBottom: "1rem",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 128,
                height: 128,
                marginBottom: "1rem",
                bgcolor: "primary.main",
                fontSize: "3rem",
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
            sx={{ color: "text.secondary", fontSize: "0.9rem", mt: 0.5 }}
          >
            {participant.level?.program?.department?.name || "N/A"} •{" "}
            {participant.level?.name || "N/A"}
          </Typography>
          <Box sx={{ width: "100%", mt: 2 }}>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.9rem",
                mb: 1,
              }}
            >
              Contact Information
            </Typography>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Email: {participant.email}
            </Typography>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Phone: {participant.phone}
            </Typography>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Address: {participant.address}
            </Typography>
          </Box>
          <Link
            to="/student/settings"
            style={{ textDecoration: "none", width: "100%" }}
          >
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
  alignItems: "start",
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  display: "flex",
  gap: "1rem",
  padding: "1rem",
  boxShadow: 1,
  color: "text.primary",

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

export default Dashboard;
