import { Box, SxProps, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import InstructorPageHeader from "../../../components/layout/InstructorPageHeader";
import {
  Assignment,
  BusinessCenter,
  Groups,
  Inventory,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../../../store/auth.slice";

const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector(selectCurrentUser);

  // set page name
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageName("Dashboard"));
  }, [dispatch]);

  return (
    <Box ref={containerRef} className="content-container">
      <InstructorPageHeader
        heading={`Welcome Back, ${user?.first_name}`}
        subHeading={"You are welcome to your dashboard!"}
      />
      <Box
        sx={{
          // bgcolor: "#fff",
          // bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: "1.4rem",
            gridTemplateColumns: "1fr 1fr",
            marginTop: "1rem",
            alignItems: "stretch",
          }}
        >
          {cards.map((card) => (
            <Link to={`${card.link}`} key={`dashboard-card-${card.id}`}>
              <Box sx={cardStyles}>
                <Box className="icon">{card.icon}</Box>
                <Box>
                  <Typography sx={{ fontSize: "1.4rem" }}>
                    {card.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 300,
                      marginTop: "1rem",
                      maxWidth: "60ch",
                      flexGrow: 1,
                    }}
                  >
                    {card.description}
                  </Typography>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const cardStyles: SxProps = {
  alignItems: "start",
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  display: "flex",
  gap: "1rem",
  padding: "1rem",
  height: "100%",

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
    link: "courses",
    icon: <Inventory />,
    title: "View Course List",
    description:
      "Access the list of courses assigned to you and manage them efficiently.",
  },
  {
    id: 2,
    link: "cbt",
    icon: <Assignment />,
    title: "Manage CBT",
    description:
      "Create and oversee computer-based tests for the courses assigned to you",
  },
  {
    id: 3,
    link: "classes",
    icon: <BusinessCenter />,
    title: "Schedule Live Classes",
    description: "Plan and schedule live classes for your assigned courses.",
  },
  {
    id: 4,
    link: "scores",
    icon: <Inventory />,
    title: "Record Scores",
    description:
      "Easily track and record offline scores, ensuring accurate performance monitoring even outside of online sessions.",
  },
  {
    id: 5,
    link: "notes",
    icon: <Groups />,
    title: "Notes and Resources",
    description:
      "Provide downloadable notes and resources to support your courses, giving students easy access to essential learning materials.",
  },
];

export default Dashboard;
