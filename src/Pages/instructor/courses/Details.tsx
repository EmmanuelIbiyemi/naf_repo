import { AccessTime, CalendarToday } from "@mui/icons-material";
import { Box, Button, Grid2, Typography } from "@mui/material";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Details = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <Box ref={containerRef} className="content-container">
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
          margin: "1em",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            // onClick={additionalButton.action}
            variant="contained"
            sx={{
              backgroundColor: "#CCCCCC",
              borderRadius: "6px",
              width: "10em",
              alignSelf: "end",
            }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 500,
                fontSize: "2rem",
                lineHeight: "40.32px",
                marginBottom: ".5em",
              }}
            >
              Articulate structure of C++ and Java in Semester 1
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: ".9rem",
                color: "#9A9A9A",
                lineHeight: "20.16px",
                fontWeight: 300,
              }}
            >
              Course: B.Tech Specialization in Health Informatics
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: ".9rem",
                color: "#9A9A9A",
                lineHeight: "20.16px",
                fontWeight: 300,
                margin: ".5em 0",
              }}
            >
              Subject: Network Engineering
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: ".9rem",
                color: "#9A9A9A",
                lineHeight: "20.16px",
                fontWeight: 300,
              }}
            >
              Students: 120
            </Typography>
          </Box>
        </Box>
        {/* Class schedule */}
        <Box sx={{ marginTop: "2em" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              fontSize: "1.5rem",
              lineHeight: "40.32px",
              marginBottom: ".5em",
              color: "#434343",
            }}
          >
            Class Schedule
          </Typography>
          <Box>
            <Grid2 container spacing={3}>
              {schedules.map((schedule) => (
                <Grid2 size={{ xs: 10, md: 4 }} key={schedule.id}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "#EDEDF5",
                        borderRadius: "5px",
                        padding: ".4em",
                      }}
                    >
                      <CalendarToday />
                      <Typography
                        variant="body2"
                        sx={{ color: "#3C3C3C", fontSize: ".9rem" }}
                      >
                        {schedule.date}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "#EDEDF5",
                        borderRadius: "5px",
                        padding: ".4em",
                      }}
                    >
                      <AccessTime />
                      <Typography
                        variant="body2"
                        sx={{ color: "#3C3C3C", fontSize: ".9rem" }}
                      >
                        {schedule.time}
                      </Typography>
                    </Box>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </Box>
        {/* Batches */}
        <Box sx={{ marginTop: "1.5em" }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              fontSize: "1.2rem",
              lineHeight: "40.32px",
              marginBottom: ".5em",
              color: "#434343",
            }}
          >
            Batches
          </Typography>
          <Grid2 container spacing={2}>
            {batches.map((batch) => (
              <Grid2 size={1.5} key={batch.id}>
                <Box
                  sx={{
                    border: "1px solid #D7D7D7",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: ".45em .8em",
                    borderRadius: "5px",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "#6A6A6A", fontSize: ".9rem" }}
                  >
                    {batch.batchNo}
                  </Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </Box>
    </Box>
  );
};

const schedules = [
  { id: 1, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 2, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 3, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 4, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 5, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 6, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 7, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 8, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 9, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 10, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 11, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
  { id: 12, date: "3-01-2023", time: "12:30 AM - 01:40 PM" },
];

const batches = [
  { id: 1, batchNo: "3CO - JVY" },
  { id: 2, batchNo: "3CO - JVY" },
  { id: 3, batchNo: "3CO - JVY" },
  { id: 4, batchNo: "3CO - JVY" },
  { id: 5, batchNo: "3CO - JVY" },
  { id: 6, batchNo: "3CO - JVY" },
  { id: 7, batchNo: "3CO - JVY" },
  { id: 8, batchNo: "3CO - JVY" },
  { id: 9, batchNo: "3CO - JVY" },
  { id: 10, batchNo: "3CO - JVY" },
];

export default Details;
