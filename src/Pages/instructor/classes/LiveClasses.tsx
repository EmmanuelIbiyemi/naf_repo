import { Box, Grid2, SxProps, Tab } from "@mui/material";
import EmptyState from "../../../components/EmptyState";
import { SyntheticEvent, useRef, useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { setPageName } from "../../../store/app.slice";
import InstructorPageHeader from "../../../components/layout/InstructorPageHeader";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LiveClassCard from "./LiveClassCard";
import CreateClassModal from "./CreateClassModal";

const LiveClasses = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenCreateModal = () => setOpenModal(true);
  const handleCloseCreateModal = () => setOpenModal(false);

  // set page name
  const dispatch = useAppDispatch();
  dispatch(setPageName("Live Classes"));

  const [tab, setTab] = useState("1");
  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Box ref={containerRef} className="content-container">
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
          {scheduledClasses.length ? (
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
                    {scheduledClasses.map((item) => (
                      <Grid2
                        size={4}
                        sx={{
                          border: "1px solid #CCCCCC",
                          padding: "1em",
                          borderRadius: "10px",
                          // width: "100%",
                          backgroundColor:
                            item.status === "Ongoing"
                              ? "#FFECEC"
                              : item.status === "Not Started"
                              ? "transparent"
                              : "#ECFFEE",
                        }}
                        key={item.id}
                      >
                        <LiveClassCard
                          title={item.title}
                          batchNo={item.batchNo}
                          date={item.date}
                          time={item.time}
                          status={item.status}
                          btnAction={() => console.log("Joineed")}
                        />
                      </Grid2>
                    ))}
                  </Grid2>
                </TabPanel>
                <TabPanel value="2" sx={TabStyles}>
                  <Grid2 container spacing={2}>
                    {endedClasses.map((item) => (
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
                          title={item.title}
                          batchNo={item.batchNo}
                          date={item.date}
                          time={item.time}
                          status={item.status}
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

const scheduledClasses = [
  {
    id: 1,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Ongoing",
  },
  {
    id: 2,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Ongoing",
  },
  {
    id: 3,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Starting in 60 Minutes",
  },
  {
    id: 4,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
  {
    id: 5,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
  {
    id: 6,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
  {
    id: 7,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
  {
    id: 8,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
  {
    id: 9,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
  {
    id: 10,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
  {
    id: 11,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
];

const endedClasses = [
  {
    id: 1,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Ended",
  },
  {
    id: 2,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Ended",
  },

  {
    id: 4,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Ended",
  },
  {
    id: 5,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Ended",
  },
  {
    id: 6,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Ended",
  },
  {
    id: 7,
    title: "How to Make an Array and it’s Types in C++",
    batchNo: "3CO - JVY",
    date: "03 Jan 2023",
    time: "12:40 P:M",
    status: "Not Started",
  },
];
export default LiveClasses;
