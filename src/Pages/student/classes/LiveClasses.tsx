import { Box, Grid2, Grid, SxProps, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import EmptyState from "../../../components/EmptyState";
import LiveClassCard from "./LiveClassCard";
import { useGetLiveClassesQuery } from "../../../store/api/liveClass.api";
import dayjs from "dayjs";

const LiveClasses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState("1");

  // Set page name
  useEffect(() => {
    dispatch(setPageName("Live Classes"));
  }, [dispatch]);

  // Fetch live classes
  const { data: liveClasses, isLoading } = useGetLiveClassesQuery({
    course_id: "1", // You might want to make this dynamic
    semester: "First Semester",
    session: "2023/2024"
  });

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };



  // Process live classes data
  const processClassStatus = (liveClass: any) => {
    const startTime = dayjs(liveClass.start_time);
    const now = dayjs();
    const diffMinutes = startTime.diff(now, 'minute');

    if (diffMinutes < 0) return "Completed";
    if (diffMinutes === 0) return "Ongoing";
    if (diffMinutes <= 60) return `Starting in ${diffMinutes} Minutes`;
    return "Not Started";
  };

  return (
    <Box ref={containerRef} className="content-container">
      <Box sx={{
        bgcolor: "#fff",
        borderRadius: "var(--border-radius)",
        marginInline: "var(--padding)",
        padding: "var(--padding)",
      }}>
        <Box sx={{ backgroundColor: "#fff" }}>
          

          {isLoading ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>Loading...</Box>
          ) : liveClasses?.data?.length ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <TabContext value={tab}>
                <Box>
                  <TabList onChange={handleChange} aria-label="live classes tabs">
                    <Tab label="Scheduled Classes" value="1" />
                    <Tab label="Class History" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" sx={TabStyles}>
                  <Grid2 container spacing={2}>
                    {liveClasses.data.map((item) => {
                      const status = processClassStatus(item);
                      return (
                        <Grid
                          key={item.id}
                          xs={12} sm={6} md={4}
                          sx={{
                            border: "1px solid #CCCCCC",
                            padding: "1em",
                            borderRadius: "10px",
                            backgroundColor: status === "Ongoing" 
                              ? "#FFECEC" 
                              : status === "Not Started" 
                              ? "transparent" 
                              : "#ECFFEE",
                          }}
                        >
                          <LiveClassCard
                            title={item.topic}
                            batchNo={`Course ID: ${item.course_id}`}
                            date={dayjs(item.start_time).format("DD MMM YYYY")}
                            time={dayjs(item.start_time).format("hh:mm A")}
                            status={status}
                            btnAction={() => window.open(item.meeting?.join_url, '_blank')}
                          />
                        </Grid>
                      );
                    })}
                  </Grid2>
                </TabPanel>
                <TabPanel value="2" sx={TabStyles}>
                  <Grid2 container spacing={2}>
                    {liveClasses.data
                      .filter(item => processClassStatus(item) === "Completed")
                      .map((item) => (
                        <Grid
                          key={item.id}
                          xs={12} sm={6} md={4}
                          sx={{
                            border: "1px solid #CCCCCC",
                            padding: "1em",
                            borderRadius: "10px",
                          }}
                        >
                          <LiveClassCard
                            title={item.topic}
                            batchNo={`Course ID: ${item.course_id}`}
                            date={dayjs(item.start_time).format("DD MMM YYYY")}
                            time={dayjs(item.start_time).format("hh:mm A")}
                            status="Completed"
                            btnAction={() => {}}
                          />
                        </Grid>
                      ))}
                  </Grid2>
                </TabPanel>
              </TabContext>
            </Box>
          ) : (
            <EmptyState
              title="No Live Classes Available"
              subTitle="Wait for an instructor to create a class."
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

const TabStyles: SxProps = {
  gap: "1rem",
  width: "100%",
  backgroundColor: "#fff",
};

export default LiveClasses;