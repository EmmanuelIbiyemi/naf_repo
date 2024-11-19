import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from "@mui/material";
import {
  Book,
  School,
  CalendarMonth,
  Grade,
  Notes,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../../components/EmptyState";
import { useGetParticipantQuery } from "../../../store/api/participants.api";
import { useAppSelector } from "../../../store/hooks";
import { selectCurrentUser } from "../../../store/auth.slice";
import { CourseBaseType } from "../../../types/courses";
import { useGetCurrentSemesterQuery } from "../../../store/api/semesters.api";
import { useGetTranscriptQuery } from "../../../store/api/result.api";

interface OverviewCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  primary?: boolean;
}

interface CourseNotesListProps {
  courses: CourseBaseType[] | undefined;
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
      <Box sx={iconContainerStyle}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: primary ? "rgba(255,255,255,0.8)" : "text.secondary",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: 500,
          }}
        >
          {value}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const CourseNotesList: React.FC<CourseNotesListProps> = ({ courses }) => {
  const navigate = useNavigate();

  if (!courses?.length) {
    return (
      <EmptyState
        title="No courses registered"
        subTitle="Register for courses to access shared notes from instructors."
      />
    );
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {courses.map((course: CourseBaseType, index: number) => (
        <React.Fragment key={course.id}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate(`/student/courses/${course.id}/notes`)}
              sx={{
                py: 2,
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon>
                <Notes color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={course.name}
                secondary={`${course.code}: ${course.name}`}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
              <ArrowForward sx={{ color: "text.secondary" }} />
            </ListItemButton>
          </ListItem>
          {index < courses.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

const Overview = () => {
  const user = useAppSelector(selectCurrentUser);
  const participantId = user?.id || 0;
  const {
    data: participantData,
    isLoading,
    error,
  } = useGetParticipantQuery(participantId);

    const {
      data: currentSemester,
    } = useGetCurrentSemesterQuery(null);

        const { data: transcript } = useGetTranscriptQuery(participantId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !participantData) {
    return (
      <Box sx={{ padding: "2rem" }}>
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
          value={participant.level?.name || "N/A"}
        />
        <OverviewCard
          icon={<CalendarMonth />}
          label="Semester"
          value={currentSemester?.data.name || "N/A"}
        />
        <OverviewCard
          icon={<Grade />}
          label="CGPA"
          value={transcript?.data.cumulative_grade_point_average || "N/A"}
        />
      </Box>

      <Typography variant="h2" sx={{ ...sectionTitleStyle, mt: 4 }}>
        Course Notes
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Access course materials and resources shared by your instructors
      </Typography>

      <Card sx={{ bgcolor: "#fff", borderRadius: "var(--border-radius)" }}>
        <CardContent>
          <CourseNotesList courses={participant.courses} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Overview;

// Styles
const sectionTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: 500,
  marginBottom: "1.5rem",
};

const statsContainerStyle = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "1fr 1fr",
    md: "repeat(4, 1fr)",
  },
  gap: "1rem",
};

const cardStyle = {
  borderRadius: "var(--border-radius)",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
};

const cardContentStyle = {
  display: "flex",
  alignItems: "start",
  gap: "1rem",
  padding: "1rem !important",
};

const iconContainerStyle = {
  bgcolor: "rgba(255,255,255,0.1)",
  borderRadius: "4px",
  padding: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
