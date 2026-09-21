import { Box, CircularProgress, Typography } from "@mui/material";
import { keyframes } from "@mui/material/styles";

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        alignItems: "center",
        background:
          "radial-gradient(circle at 15% 20%, rgba(0,102,195,0.15), transparent 28%), radial-gradient(circle at 85% 20%, rgba(2,54,120,0.25), transparent 28%), linear-gradient(120deg, rgba(4,44,92,1) 0%, rgba(2,54,120,0.9) 45%, rgba(0,102,195,0.85) 100%)",
        backgroundSize: "220% 220%",
        animation: `${gradientShift} 14s ease infinite`,
        display: "grid",
        inset: 0,
        minHeight: "100vh",
        padding: { xs: 2.5, sm: 3.5 },
        position: "fixed",
        width: "100%",
        zIndex: 1600,
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 70% 75%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 25% 80%, rgba(255,255,255,0.09), transparent 26%)",
          opacity: 0.7,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          backgroundColor: "rgba(255,255,255,0.92)",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.7)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.25), 0 10px 30px rgba(2,54,120,0.2)",
          width: "min(440px, 94vw)",
          padding: { xs: 3, sm: 4 },
          overflow: "hidden",
          backdropFilter: "blur(16px)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(0,102,195,0.12), rgba(2,54,120,0.12), rgba(0,102,195,0.08))",
            opacity: 0.65,
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />

        <Box sx={{ position: "relative", display: "flex", gap: 2 }}>
          <Box
            sx={{
              position: "relative",
              p: 1.5,
              borderRadius: "50%",
              background:
                "linear-gradient(145deg, rgba(2,54,120,0.15), rgba(0,102,195,0.12))",
              boxShadow: "0 12px 30px rgba(2,54,120,0.25)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: -7,
                borderRadius: "50%",
                border: "1px solid rgba(2,54,120,0.18)",
                animation: `${float} 3s ease-in-out infinite`,
              }}
            />
            <CircularProgress
              size={44}
              thickness={4.2}
              sx={{ color: "primary.main" }}
            />
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="text.primary"
            >
              One moment please
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 280 }}
            >
              We're lining up the next screen and syncing the latest updates.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: "relative", mt: 3, display: "grid", gap: 1.5 }}>
          <Box
            sx={{
              height: 8,
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(2,54,120,0.1), rgba(0,102,195,0.45), rgba(2,54,120,0.1))",
              backgroundSize: "200% 100%",
              animation: `${gradientShift} 2.8s linear infinite`,
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.08)",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Navigation is paused while we load. If this takes a while, please refresh or check your
            connection.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
