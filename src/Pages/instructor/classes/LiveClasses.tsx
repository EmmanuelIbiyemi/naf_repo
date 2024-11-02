import { Box, Grid2, LinearProgress, SxProps, Tab } from "@mui/material";
import EmptyState from "../../../components/EmptyState";
import { SyntheticEvent, useRef, useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import InstructorPageHeader from "../../../components/layout/InstructorPageHeader";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LiveClassCard from "./LiveClassCard";
import CreateClassModal from "./CreateClassModal";
import { useGetLiveClassesQuery } from "../../../store/api/classes.api";
import { useGetCurrentSessionQuery } from "../../../store/api/sessions.api";
import { useGetCurrentSemesterQuery } from "../../../store/api/semesters.api";

const LiveClasses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenCreateModal = () => setOpenModal(true);
  const handleCloseCreateModal = () => setOpenModal(false);
  const { data: currentSession, isLoading: isGettingSession } =
    useGetCurrentSessionQuery(null);
  const { data: currentSemester, isLoading: isGettingSemester } =
    useGetCurrentSemesterQuery(null);
  const currentSemesterString = currentSemester?.data.name;
  const currentSessionString = currentSession?.data.name;

  const { data: scheduledClasses, isLoading } = useGetLiveClassesQuery({
    courseId: 17,
    semester: currentSemesterString,
    session: currentSessionString,
  });

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Live Classes"));

  const [tab, setTab] = useState("1");
  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Box ref={containerRef} className="content-container">
      {isLoading ||
        isGettingSemester ||
        (isGettingSession && <LinearProgress />)}
      <InstructorPageHeader
        additionalButton={{
          action: handleOpenCreateModal,
          text: "Create New Class",
        }}
        heading={"Live Classes"}
        subHeading={
          "List of classes that have been created and shared in the school"
        }
      />
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "var(--border-radius)",
          marginInline: "var(--padding)",
          padding: "var(--padding)",
        }}
      >
        <Box sx={{ backgroundColor: "#fff" }}>
          {scheduledClasses?.data.length ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <TabContext value={tab}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                  >
                    <Tab label="Scheduled Classes" value="1" />
                    <Tab label="Class History" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1" sx={TabStyles}>
                  <Grid2 container spacing={2}>
                    {scheduledClasses?.data.map((item) => (
                      <Grid2
                        size={4}
                        sx={{
                          border: "1px solid #CCCCCC",
                          padding: "1em",
                          borderRadius: "10px",
                          // width: "100%",
                          backgroundColor:
                            item.meeting.status === "ongoing"
                              ? "#FFECEC"
                              : item.meeting.status === "waiting"
                              ? "transparent"
                              : "#ECFFEE",
                        }}
                        key={item.id}
                      >
                        <LiveClassCard
                          title={item.topic}
                          date={item.updated_at}
                          time={item.start_time}
                          status={item.meeting.status}
                          btnAction={() => console.log("Joineed")}
                        />
                      </Grid2>
                    ))}
                  </Grid2>
                </TabPanel>
                <TabPanel value="2" sx={TabStyles}>
                  <Grid2 container spacing={2}>
                    {scheduledClasses.data
                      .filter((item) => item.meeting.status === "ended")
                      .map((item) => (
                        <Grid2
                          size={4}
                          sx={{
                            border: "1px solid #CCCCCC",
                            padding: "1em",
                            borderRadius: "10px",
                            // width: "100%",
                            backgroundColor: "transparent",
                          }}
                          key={item.id}
                        >
                          <LiveClassCard
                            title={item.topic}
                            date={item.updated_at}
                            time={item.start_time}
                            status={item.meeting.status}
                            btnAction={() => console.log("Joineed")}
                          />
                        </Grid2>
                      ))}
                  </Grid2>
                </TabPanel>
              </TabContext>
            </Box>
          ) : (
            <EmptyState
              title="Oops! There’s nothing here!"
              subTitle="Forms will appear here after you add them in your school."
            />
          )}
        </Box>
      </Box>
      <CreateClassModal open={openModal} handleClose={handleCloseCreateModal} />
    </Box>
  );
};

const TabStyles: SxProps = {
  // display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(4,1fr)",
  // paddingInline: "0 !important",
  width: "100%",
  backgroundColor: "#fff",
};

export default LiveClasses;
