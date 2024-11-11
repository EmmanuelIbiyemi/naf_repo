import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import { AccessTime } from "@mui/icons-material";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  onTick: (timeLeft: number) => void;
}

const Timer = ({ duration, onTimeUp, onTick }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime >= 0) {
          onTick(newTime);
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, onTimeUp, onTick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "primary.main",
        py: 1,
      }}
    >
      <AccessTime fontSize="small" />
      <Typography variant="h6" component="span">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </Typography>
    </Box>
  );
};

export default Timer;
