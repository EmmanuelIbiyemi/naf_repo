import { Box, SxProps, Typography } from "@mui/material";
import { useRef } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import InstructorPageHeader from "../../../components/layout/InstructorPageHeader";
import {
  Assignment,
  BusinessCenter,
  Groups,
  Inventory,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Dashboard"));

  return (
    <Box ref={containerRef} className="content-container">
      <InstructorPageHeader
        additionalButton={{
          action: () => console.log("Hello"),
          text: "Export Report",
        }}
        heading={"Welcome Back, Amina"}
        subHeading={"Lorem ipsum dolor sit amet consectetur. Tdbks akd"}
      />
      <Box
        sx={{
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
    link: "",
    icon: <Inventory />,
    title: "View Course List",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
  {
    id: 2,
    link: "",
    icon: <Assignment />,
    title: "Manage CBT",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
  {
    id: 3,
    link: "classes",
    icon: <BusinessCenter />,
    title: "Schedule Live Classes",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
  {
    id: 4,
    link: "offline-scores",
    icon: <Inventory />,
    title: "Record Offline Scores",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
  {
    id: 5,
    link: "",
    icon: <Groups />,
    title: "Notes and Resources",
    description:
      "Create rich course content and coaching products for your students. When you give them a pricing plan, they’ll appear on your site!",
  },
];

export default Dashboard;
