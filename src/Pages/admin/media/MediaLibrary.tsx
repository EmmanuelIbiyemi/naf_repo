import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, SxProps, Tab, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import MediaItem from "./components/MediaItem";
import thumb1 from "/images/amphibious.png";
import thumb2 from "/images/image1.png";
import thumb3 from "/images/image2.png";

const MediaLibrary = () => {
  const [tab, setTab] = useState("1");
  const [mediaArray] = useState([1, 2, 3, 4, 5]);

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <Box sx={contentStyles}>
      <Box sx={headerStyles}>
        <Typography variant="h5">Media Library</Typography>
        <Button variant="contained">Add Media</Button>
      </Box>

      <Box sx={{ width: "100%", position: "relative" }}>
        <TabContext value={tab}>
          <Box>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="All Media" value="1" />
              <Tab label="Videos" value="2" />
              <Tab label="Images" value="3" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={TabStyles}>
            {mediaArray.map(() => (
              <MediaItem image={thumb1} />
            ))}
          </TabPanel>
          <TabPanel value="2" sx={TabStyles}>
            {mediaArray.map(() => (
              <MediaItem image={thumb2} />
            ))}
          </TabPanel>
          <TabPanel value="3" sx={TabStyles}>
            {mediaArray.map(() => (
              <MediaItem image={thumb3} />
            ))}
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default MediaLibrary;

const contentStyles: SxProps = {
  paddingInline: "2rem",
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem",
};

const TabStyles: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(4,1fr)",
  paddingInline: "0 !important",
  position: "absolute",
  width: "100%",
};
