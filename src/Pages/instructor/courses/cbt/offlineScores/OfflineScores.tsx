import {
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
// import { useNavigate } from "react-router-dom";
import OfflineScoresList from "./OfflineScoresList";
import { useGetCoursesQuery } from "../../../../../store/api/courses.api";
import AddScoresModal from "./AddScoresModal";

const OfflineScores = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = React.useState("");
  const [openAddModal, setOpenAddModal] = React.useState(false);
  const { data: courses, isLoading } = useGetCoursesQuery(null);

  const handleClose = () => setOpenAddModal(false);
  const handleOpen = () => setOpenAddModal(true);

  const handleChange = (event: SelectChangeEvent) => {
    setCourse(event.target.value);
  };
  //   const navigate = useNavigate();

  return (
    <Box ref={containerRef} className="content-container">
      {isLoading && <LinearProgress />}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                fontSize: "1.5rem",
                lineHeight: "40.32px",
                marginBottom: ".2em",
              }}
            >
              Manage Offline Scores
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "1rem",
                color: "#9A9A9A",
                lineHeight: "20.16px",
                fontWeight: 300,
              }}
            >
              Easily add, edit, and track scores for offline activities,
              ensuring accurate performance records.
            </Typography>
            <Box
              sx={{
                display: "flex",
                // alignItems: "center",
                gap: 3,
                marginTop: "1em",
                flexDirection: "column",
              }}
            >
              <Typography variant="body2" sx={{}}>
                Select Course
              </Typography>
              <Select
                value={course}
                label="course"
                onChange={handleChange}
                sx={{ width: "50%" }}
                disabled={isLoading}
              >
                <MenuItem defaultValue="">
                  <em>None</em>
                </MenuItem>
                {courses?.data.map((item) => (
                  <MenuItem value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              // width: "40%",
            }}
          >
            <Button
              // sx={{}}
              onClick={handleOpen}
              variant="contained"
              disabled={isLoading}
            >
              Add New Scores
            </Button>
          </Box>
        </Box>
        <Box sx={{ margin: "2em 0" }}>
          <OfflineScoresList />
        </Box>
        <AddScoresModal
          open={openAddModal}
          handleClose={handleClose}
          coursesList={courses}
        />
      </Box>
    </Box>
  );
};

export default OfflineScores;
