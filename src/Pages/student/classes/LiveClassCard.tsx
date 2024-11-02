import { AccessTime, CalendarToday } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

type LiveClassProps = {
  title: string;
  batchNo: string;
  date: string;
  time: string;
  status: string;
  btnAction: () => void;
};

const LiveClassCard = ({
  title,
  batchNo,
  date,
  time,
  status,
  btnAction,
}: LiveClassProps) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContentL: "center",
          alignItems: "start",
          gap: 1.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontSize: "1.5rem", lineHeight: "30.24px" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#989898",
            fontSize: ".9rem",
            padding: ".6em ",
            border: "1px solid #D3D3D3",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
          }}
        >
          Batch {batchNo}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              color: "#989898",
            }}
          >
            <CalendarToday />
            <Typography
              variant="body2"
              sx={{ color: "#989898", fontSize: ".9rem" }}
            >
              {date}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              color: "#989898",
            }}
          >
            <AccessTime />
            <Typography
              variant="body2"
              sx={{ color: "#989898", fontSize: ".9rem" }}
            >
              {time}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color:
              status === "Ongoing"
                ? "#F12222"
                : status === "Not Started"
                ? "#9E9E9Et"
                : "#0CC740",
            fontSize: ".9rem",
            padding: ".6em ",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            backgroundColor:
              status === "Ongoing"
                ? "#FFDDDD"
                : status === "Not Started"
                ? "#F1F1F1"
                : "#DDFFE7",
          }}
        >
          Status {status}
        </Typography>
      </Box>
      <Button
        variant="contained"
        disabled={status === "Not Started"}
        sx={{
          width: "100%",
          backgroundColor: "#141414",
          marginTop: "1em",
        }}
        onClick={btnAction}
      >
        Join now
      </Button>
    </Box>
  );
};

export default LiveClassCard;
