import { Box, Button, SxProps, Typography } from "@mui/material";

const Page = () => {
  return (
    <Box sx={contentStyles}>
      <Box sx={headerStyles}>
        <Typography variant="h5">Media Library</Typography>
        <Button variant="contained" onClick={() => {}}>
          Add Media
        </Button>
      </Box>
    </Box>
  );
};

export default Page;

const contentStyles: SxProps = {
  paddingInline: "2rem",
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem",
};
