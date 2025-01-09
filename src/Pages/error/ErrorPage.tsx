import { Box, Button, Typography } from "@mui/material";
import { Home, Refresh, ErrorOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { setPageName } from "../../store/app.slice";

interface ErrorPageProps {
  code?: number;
  message?: string;
  details?: string;
}

const ErrorPage = ({ 
  code = 500, 
  message = "An unexpected error occurred", 
  details = "We're working to fix the issue. Please try again later."
}: ErrorPageProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setPageName("Error"));
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
            color: "error.main",
            marginBottom: "1rem",
          }}
        />
        <Typography variant="h1" sx={{ fontSize: "2rem", fontWeight: 500 }}>
          {code} - {message}
        </Typography>
        <Typography
          sx={{ fontSize: "1.3rem", fontWeight: 300, marginTop: ".5rem" }}
        >
          {details}
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: "flex", 
          gap: "1rem",
          justifyContent: "center", 
          marginTop: "2rem" 
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
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

export default ErrorPage;