import { Box, SxProps, Typography } from "@mui/material";
import SadFaceIcon from "../assets/sadFaceIcon";

type Props = {
  title: string;
  subTitle: string;
};

const EmptyState = ({ title, subTitle }: Props) => {
  return (
    <Box sx={containerStyles}>
      <Box sx={{ display: "grid", gap: ".5rem", justifyItems: "center" }}>
        <Box sx={sadFaceStyles} className="empty_state">
          <SadFaceIcon />
        </Box>
        <Typography variant="h5" sx={{ fontSize: "1.6rem" }}>
          {title}
        </Typography>
        <Typography>{subTitle}</Typography>
      </Box>
    </Box>
  );
};

export default EmptyState;

const containerStyles: SxProps = {
  display: "grid",
  minHeight: "60vh",
  placeItems: "center",
  placeContent: "center",
};
const sadFaceStyles: SxProps = {
  bgcolor: "rgba(2, 54, 120, 0.5)",
  borderRadius: "100%",
  display: "grid",
  height: "130px",
  marginBottom: "3rem",
  placeItems: "center",
  width: "130px",
  svg: {
    color: "#fff",
    fontSize: "80px",
  },
};
