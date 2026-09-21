import { useState, useEffect, useRef, useCallback } from "react";
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
  const onTimeUpRef = useRef(onTimeUp);
  const onTickRef = useRef(onTick);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
    onTickRef.current = onTick;
  }, [onTimeUp, onTick]);

  const handleTick = useCallback(() => {
    setTimeLeft((prevTime) => {
      const newTime = prevTime - 1;
      if (newTime <= 0) {
        onTimeUpRef.current();
        return 0;
      }
      onTickRef.current(newTime);
      return newTime;
    });
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      return;
    }

    timerRef.current = setInterval(handleTick, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [handleTick]); // Only depend on handleTick, not timeLeft

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
