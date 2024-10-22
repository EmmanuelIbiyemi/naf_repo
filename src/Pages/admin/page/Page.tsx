import { Box, Button, SxProps, Typography } from "@mui/material";
import { PageType } from "../../../types/pages";
import { useEffect, useState } from "react";
import PageBuilder from "./components/PageBuilder";
import {
  Article,
  Badge,
  Height,
  HMobiledata,
  Image,
  LocalParking,
  MilitaryTech,
  Newspaper,
  SmartDisplay,
  Timeline,
  ViewCarousel,
} from "@mui/icons-material";

const elements = [
  { id: 1, name: "Banner", type: "banner", icon: ViewCarousel },
  { id: 2, name: "History", type: "history", icon: Timeline },
  { id: 3, name: "Courses", type: "courses", icon: Article },
  { id: 5, name: "News", type: "news", icon: Newspaper },
  { id: 6, name: "Image", type: "image", icon: Image },
  { id: 7, name: "Video", type: "video", icon: SmartDisplay },
  { id: 8, name: "Heading", type: "heading", icon: HMobiledata },
  { id: 9, name: "Text", type: "text", icon: LocalParking },
  // { id: 10, name: "Title", type: "title", icon: Title },
  // { id: 11, name: "Sub Title", type: "subtitle", icon: LocalParking },
  { id: 12, name: "Commandants", type: "commandants", icon: MilitaryTech },
  { id: 13, name: "Staffs", type: "staffs", icon: Badge },
  { id: 14, name: "Big space", type: "big space", icon: Height },
  { id: 15, name: "Small space", type: "small space", icon: Height },
];

const Page = () => {
  //   const { name } = useParams();
  //   console.log(name);
  const [page, setPage] = useState<PageType>({
    id: 1,
    elements: [],
    title: "about",
  });

  const addElement = (type: string) => {
    setPage((prev) => {
      const els = [...prev.elements];
      els.push({
        id: prev.elements.length + 1,
        content: elements.find((el) => el.type === type)?.name as string,
        type,
      });
      return { ...prev, elements: els };
    });
  };

  const handleClick = (type: string) => {
    addElement(type);
  };

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <Box sx={contentStyles} className="hide_scrollbar">
      <Box className="hide_scrollbar">
        <Box sx={headerStyles}>
          <Button onClick={() => {}}>Back</Button>
          <Button variant="contained" onClick={() => {}}>
            Save Changes
          </Button>
        </Box>
        <Box
          sx={{
            bgcolor: "#fff",
            height: "calc(100% - 78px)",
            border: "1px solid rgba(204, 204, 204, 0.5)",
            borderRadius: "var(--border-radius)",
          }}
          className="hide_scrollbar"
        >
          <PageBuilder page={page} setPage={setPage} />
        </Box>
      </Box>
      <Box sx={sidebarContentStyles} className="hide_scrollbar">
        <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
          Blocks
        </Typography>
        <Box sx={elementSideBar}>
          {elements.map((el, i) => (
            <Button
              onClick={() => handleClick(el.type)}
              key={`element-${el.id}-${i}`}
            >
              <el.icon />
              <span>{el.name}</span>
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Page;

const contentStyles: SxProps = {
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "1fr 300px",
  paddingInline: "2rem 0rem",
  height: "100%",
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem",
};

const sidebarContentStyles: SxProps = {
  bgcolor: "#fff",
  borderLeft: "1px solid rgba(204, 204, 204, 0.5)",
  padding: "1rem",
  maxHeight: "100%",
};

const elementSideBar: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "1fr 1fr",
  gridAutoRows: "100px",
  height: "100vh",

  button: {
    bgcolor: "rgba(245, 245, 245, 1)",
    color: "inherit",
    display: "grid",
    placeContent: "center",
    placeItems: "center",
  },
};
