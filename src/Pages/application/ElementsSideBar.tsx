import { Box, Button, SxProps, Typography } from "@mui/material";
import { formElements } from "./elements";

const ElementsSideBar = () => {
  return (
    <Box
      sx={{
        borderRight: "1px solid rgba(229, 229, 229, 1)",
        bgcolor: "rgba(249, 250, 251, 1)",
        padding: "1rem var(--padding)",
      }}
    >
      <Typography variant="h5">Form Elements</Typography>
      <Box sx={elementContainerStyles}>
        {formElements.map((el) => (
          <Button key={el.text} onClick={el.action}>
            <img src={el.image} alt="" /> <span>{el.text}</span>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default ElementsSideBar;

const elementContainerStyles: SxProps = {
  marginTop: "2rem",
  button: {
    border: "none",
    borderRadius: 0,
    borderBottom: "1px solid rgba(204, 204, 204, 0.4)",
    color: "inherit",
    display: "flex",
    gap: "1.3rem",
    justifyContent: "start",
    padding: "1rem .7rem",
    width: "100%",
  },
};
