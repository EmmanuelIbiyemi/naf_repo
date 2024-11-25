import {
  Box,
  Button,
  Typography,
  Modal,
  Stack,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import { AccessTime, Assignment, Close } from "@mui/icons-material";
import { QuizzesResponse } from "../../../../types/quizzes";

interface QuizInfoModalProps {
  quiz?: QuizzesResponse["data"][0];
  open: boolean;
  onClose: () => void;
  onStart: () => void;
}

const QuizInfoModal = ({
  quiz,
  open,
  onClose,
  onStart,
}: QuizInfoModalProps) => {
  if (!quiz) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 500,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          sx={{ position: "absolute", right: 8, top: 8 }}
          onClick={onClose}
        >
          <Close />
        </IconButton>

        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {quiz.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {quiz.instructions}
            </Typography>
          </Box>

          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTime color="primary" />
              <Typography>Duration: {quiz.time_allowed} minutes</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment color="primary" />
              <Typography>Total Score: {quiz.id} points</Typography>
            </Box>
          </Stack>

          <Alert severity="warning">
            <AlertTitle>Instructions</AlertTitle>
            {quiz.instructions}
          </Alert>

          <Button variant="contained" size="large" fullWidth onClick={onStart}>
            Start Quiz
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default QuizInfoModal;
