import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Quiz, ArrowForward } from "@mui/icons-material";
import EmptyState from "../../../components/EmptyState";
import { useAppSelector } from "../../../store/hooks";
import { selectCurrentUser } from "../../../store/auth.slice";
import { useGetParticipantQuery } from "../../../store/api/participants.api";
import QuizModal from "./components/QuizModal";
import { CourseBaseType } from "../../../types/courses";

const CourseCBTList = ({ courses }: {courses: CourseBaseType[]}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseBaseType | null>(null);

  if (!courses?.length) {
    return (
      <EmptyState
        title="No courses registered"
        subTitle="Register for courses to access CBT tests from instructors."
      />
    );
  }

  return (
    <>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {courses.map((course: CourseBaseType, index: number) => (
          <React.Fragment key={course.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setSelectedCourse(course)}
                sx={{
                  py: 2,
                  "&:hover": {
                    bgcolor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemIcon>
                  <Quiz color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={course.name}
                  secondary={`${course.code}: ${course.name}`}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
                {/* {course.activeCBTs > 0 && (
                  <Chip
                    label={`${course.activeCBTs} Active`}
                    color="primary"
                    size="small"
                    sx={{ mr: 2 }}
                  />
                )} */}
                <ArrowForward sx={{ color: "text.secondary" }} />
              </ListItemButton>
            </ListItem>
            {index < courses.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>

      <QuizModal
        open={Boolean(selectedCourse)}
        onClose={() => setSelectedCourse(null)}
        courseId={selectedCourse?.id}
        courseTitle={selectedCourse?.name}
      />
    </>
  );
};

const CourseCBT = () => {
  const user = useAppSelector(selectCurrentUser);
  const participantId = (user?.id || 0);
  const {
    data: participantData,
    isLoading,
    error,
  } = useGetParticipantQuery(participantId);

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
          subTitle="There was a problem loading your CBT information. Please try again later."
        />
      </Box>
    );
  }

  const { data: participant } = participantData;

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography variant="h2" sx={sectionTitleStyle}>
        Course CBT Tests
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        Access computer-based tests and assessments for your registered courses
      </Typography>

      <Card sx={{ bgcolor: "#fff", borderRadius: "var(--border-radius)" }}>
        <CardContent>
          <CourseCBTList courses={participant.courses} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default CourseCBT;

const sectionTitleStyle = {
  fontSize: "1.5rem",
  fontWeight: 500,
  marginBottom: "1.5rem",
};
