import { Box, CircularProgress } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.5)",
        display: "grid",
        height: "100%",
        left: 0,
        placeItems: "center",
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen;
