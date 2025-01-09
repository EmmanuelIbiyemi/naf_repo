import { Box, Button, Typography } from "@mui/material";
import { Home, ErrorOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setPageName } from "../../store/app.slice";

const NotFound = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageName("Page Not Found"));
  }, []);

  return (
    <Box
      sx={{
        paddingInline: "2rem",
        display: "grid",
        placeContent: "center",
        padding: "5rem 7rem",
        textAlign: "center",
      }}
    >
      <Box sx={{ marginBottom: "2rem" }}>
        <ErrorOutline
          sx={{
            fontSize: "5rem",
            color: "primary.main",
            marginBottom: "1rem",
          }}
        />
        <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
          404 - Page Not Found
        </Typography>
        <Typography
          sx={{ fontSize: "1.3rem", fontWeight: 300, marginTop: ".5rem" }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;