import { AccessTime, CalendarToday } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";

type LiveClassProps = {
  title: string;
  date: string;
  time: string;
  status: string;
  btnAction: () => void;
};

const formatDateTime = (dateTimeString: string) => {
  try {
    const date = new Date(dateTimeString);

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTime = `${hours}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;

    return {
      date: formattedDate,
      time: formattedTime,
      fullDateTime: `${formattedDate} ${formattedTime}`,
    };
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return {
      date: "",
      time: "",
      fullDateTime: "",
    };
  }
};

const LiveClassCard = ({
  title,
  date,
  time,
  status,
  btnAction,
}: LiveClassProps) => {
  const buttonEnabled = status === "Ongoing";

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
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
              {formatDateTime(date).date}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
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
              {formatDateTime(time).time}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: buttonEnabled ? "#0CC740" : "#9E9E9E",
            fontSize: ".9rem",
            padding: ".6em ",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            backgroundColor: buttonEnabled ? "#DDFFE7" : "#F1F1F1",
          }}
        >
          Status: {status}
        </Typography>
      </Box>
      <Button
        variant="contained"
        disabled={!buttonEnabled}
        sx={{ width: "100%", backgroundColor: "#141414", marginTop: "1em" }}
        onClick={btnAction}
      >
        {buttonEnabled ? "Join now" : status}
      </Button>
    </Box>
  );
};

export default LiveClassCard;
