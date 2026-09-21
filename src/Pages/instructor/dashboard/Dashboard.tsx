import { Box, SxProps, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import InstructorPageHeader from "../../../components/layout/InstructorPageHeader";
import {
  Assignment,
  BusinessCenter,
  Groups,
  History,
  Inventory,
  MenuBook,
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
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(3, 1fr)",
            marginTop: "1rem",
          }}
        >
          {cards.map((card) => (
            <Link
              to={`${card.link}`}
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
      </Box>
    </Box>
  );
};

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
  { id: 1, link: "courses", icon: <Inventory />, title: "View Courses" },
  { id: 2, link: "cbt", icon: <Assignment />, title: "Manage CBT" },
  { id: 3, link: "classes", icon: <BusinessCenter />, title: "Live Classes" },
  { id: 4, link: "scores", icon: <Groups />, title: "Record Scores" },
  { id: 5, link: "notes", icon: <MenuBook />, title: "Notes & Resources" },
  { id: 6, link: "my-activity", icon: <History />, title: "My Activity" },
];

export default Dashboard;
