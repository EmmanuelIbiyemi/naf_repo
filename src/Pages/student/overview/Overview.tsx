import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  SxProps,
  CircularProgress,
} from "@mui/material";
import {
  Book,
  School,
  CalendarMonth,
  Grade,
} from "@mui/icons-material";
import EmptyState from "../../../components/EmptyState";
import { useGetParticipantQuery } from '../../../store/api/participants.api';
import { useAppSelector } from '../../../store/hooks';
import { selectCurrentUser } from '../../../store/auth.slice';

interface OverviewCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  primary?: boolean;
}

const OverviewCard = ({ icon, label, value, primary }: OverviewCardProps) => (
  <Card
    sx={{
      ...cardStyle,
      bgcolor: primary ? "primary.main" : "#fff",
      color: primary ? "#fff" : "text.primary",
    }}
  >
    <CardContent sx={cardContentStyle}>
      <Box sx={iconContainerStyle}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography sx={{
          fontSize: "0.875rem",
          color: primary ? "rgba(255,255,255,0.8)" : "text.secondary",
          mb: 0.5
        }}>
          {label}
        </Typography>
        <Typography sx={{
          fontSize: "1.5rem",
          fontWeight: 500
        }}>
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const Overview = () => {
  // Assuming we're getting the participant ID from somewhere (e.g., context, route params)
  const user = useAppSelector(selectCurrentUser);
  const participantId = user.id; // Replace with actual ID source
  const { data: participantData, isLoading, error } = useGetParticipantQuery(participantId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !participantData) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <EmptyState
          title="Error loading data"
          subTitle="There was a problem loading your information. Please try again later."
        />
      </Box>
    );
  }

  const { data: participant } = participantData;

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h2" sx={sectionTitleStyle}>
        Overview
      </Typography>

      {/* Stats Cards */}
      <Box sx={statsContainerStyle}>
        <OverviewCard
          icon={<Book />}
          label="Registered Courses"
          value={participant.courses?.length || 0}
          primary
        />
        <OverviewCard
          icon={<School />}
          label="Level"
          value={participant.level || "N/A"}
        />
        <OverviewCard
          icon={<CalendarMonth />}
          label="Semester"
          value={1} // Replace with actual semester data if available
        />
        <OverviewCard
          icon={<Grade />}
          label="CGPA"
          value="N/A" // Replace with actual CGPA if available
        />
      </Box>

      {/* Shared Notes Section */}
      <Typography variant="h2" sx={{ ...sectionTitleStyle, mt: 4 }}>
        Shared Notes
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Access your course materials and shared resources
      </Typography>

      {/* Empty State */}
      <Card sx={{ bgcolor: "#fff", borderRadius: "var(--border-radius)" }}>
        <CardContent>
          <EmptyState
            title="No shared notes available"
            subTitle="Information will appear here after an admin has assigned them to you."
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Overview;

// Styles
const sectionTitleStyle: SxProps = {
  fontSize: "1.5rem",
  fontWeight: 500,
  marginBottom: "1.5rem",
};

const statsContainerStyle: SxProps = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "1fr 1fr",
    md: "repeat(4, 1fr)",
  },
  gap: "1rem",
};

const cardStyle: SxProps = {
  borderRadius: "var(--border-radius)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
};

const cardContentStyle: SxProps = {
  display: "flex",
  alignItems: "start",
  gap: "1rem",
  padding: "1rem !important",
};

const iconContainerStyle: SxProps = {
  bgcolor: "rgba(255,255,255,0.1)",
  borderRadius: "4px",
  padding: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};