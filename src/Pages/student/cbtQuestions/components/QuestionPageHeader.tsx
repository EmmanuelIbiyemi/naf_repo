import { Box, Button, SxProps } from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = {
  button: {
    text: string;
    action: () => void;
  };
};

const QuestionPageHeader = ({ button }: Props) => {
  const navigate = useNavigate();

  return (
    <Box sx={headerStyles}>
      <Button
        variant="contained"
        sx={{
          bgcolor: "rgba(204, 204, 204, 1)",
          textTransform: "capitalize",
        }}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Button
        onClick={button.action}
        variant="contained"
        sx={{ textTransform: "capitalize" }}
      >
        {button.text}
      </Button>
    </Box>
  );
};

export default QuestionPageHeader;

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  padding: "var(--padding)",
};
