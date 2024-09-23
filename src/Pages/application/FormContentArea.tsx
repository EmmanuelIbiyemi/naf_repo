import { Box, Button, SxProps, Typography } from "@mui/material";
import cursorIcon from "../../assets/cursor.svg";

const FormContentArea = () => {
  return (
    <Box sx={formContentContainerStyles}>
      <Box sx={dropContainerStyles}>
        <Box sx={{ padding: "1.5rem" }}>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            Untitled Form
          </Typography>
        </Box>
        <Box sx={dropAreaStyles}>
          <Box className="dashed_border" sx={{ textAlign: "center" }}>
            <img src={cursorIcon} alt="" />
            <Typography>Drag your first element here from the left</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button variant="contained">Submit Form</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FormContentArea;

const formContentContainerStyles: SxProps = {
  display: "grid",
  padding: "2rem",
  placeItems: "center",
};

const dropContainerStyles: SxProps = {
  bgcolor: "#fff",
  display: "grid",
  gridTemplateRows: "15% 1fr 15%",
  height: "80%",
  width: "80%",
};

const dropAreaStyles: SxProps = {
  borderBlock: "1px solid rgba(204, 204, 204, 0.4)",
  display: "grid",
  paddingInline: "3rem",
  placeItems: "center",

  ">div": {
    bgcolor: "rgba(204, 204, 204, 0.3)",
    borderRadius: "var(--border-radius)",
    padding: "2rem",
  },
};
