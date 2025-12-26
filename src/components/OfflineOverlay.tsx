import { WifiOff } from "@mui/icons-material";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

type OfflineOverlayProps = {
  open: boolean;
  onRetry?: () => void;
};

const OfflineOverlay = ({ open, onRetry }: OfflineOverlayProps) => {
  if (!open) return null;

  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 2200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        background:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1), transparent 25%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.08), transparent 30%), rgba(12, 18, 31, 0.55)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 3,
          padding: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <WifiOff color="error" sx={{ fontSize: 32 }} />
            <Typography variant="h6" fontWeight={700}>
              You are offline
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            We could not reach the server. Check your connection and try again.
            Your current page is paused to prevent errors until you are back
            online.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
            width="100%"
          >
            <Button
              variant="contained"
              onClick={handleRetry}
              fullWidth
              color="primary"
            >
              Retry connection
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => window.location.reload()}
              fullWidth
            >
              Reload when online
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            We will restore the page automatically once a connection is
            available.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default OfflineOverlay;
