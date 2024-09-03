import { Box, Button, Container, SxProps, Typography } from "@mui/material";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Login = () => {
  const containerStyles: SxProps = {
    paddingBlock: "1rem",
    bgcolor: "primary.main",
    color: "primary.contrastText",
    "p,button": {
      color: "inherit",
    },
    ".MuiTypography-root": {
      fontWeight: "600",
      fontSize: "1.6rem",
    },
    ".MuiButton-root": {
      fontSize: "1.2rem",
    },
  };

  return (
    <Box sx={containerStyles}>
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{ alignItems: "center", display: "flex", gap: "1rem" }}
        >
          <img src={logo} alt="logo" height={80} />
          <Typography>
            Nigerian Air Force
            <br />
            College of Nursing Sciences
          </Typography>
        </Link>
        <Button>Admin login</Button>
      </Container>
    </Box>
  );
};

export default Login;
