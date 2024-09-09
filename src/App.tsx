import { Box, SxProps } from "@mui/material";
import "./App.scss";
import SideBar from "./components/layout/SideBar";
import Header from "./components/layout/Header";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Box sx={layoutStyles}>
      <SideBar />
      <Header />
      <Outlet />
    </Box>
  );
}

export default App;

const layoutStyles: SxProps = {
  display: "grid",
  gridTemplateAreas: `
  "sidebar header"
  "sidebar main"
  `,
  gridTemplateColumns: "280px 1fr",
  gridTemplateRows: "100px 1fr",
  minHeight: "100vh",
  ">*": {
    border: "1px solid #000",
  },
};
