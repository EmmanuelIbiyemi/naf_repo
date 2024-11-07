import React from "react";
import { Box, Button } from "@mui/material";

interface Question {
  id: string;
}

interface QuestionSummaryGridProps {
  questions: Question[];
  answers: { [key: string]: boolean };
  onQuestionClick: (questionId: string) => void;
}

const QuestionSummaryGrid: React.FC<QuestionSummaryGridProps> = ({
  questions,
  answers,
  onQuestionClick,
}) => {
  const getButtonColor = (questionId: string) => {
    if (answers[questionId]) {
      return "success.light";
    }
    return "grey.300";
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
        gap: 0,
      }}
    >
      {questions.map((question, index) => (
        <Button
          key={question.id}
          variant="contained"
          onClick={() => onQuestionClick(question.id)}
          sx={{
            width: "100%",
            minWidth: 35,
            maxWidth: 40,
            height: 30,
            p: 0,
            gap: 0,
            bgcolor: getButtonColor(question.id),
            color: answers[question.id] ? "white" : "text.primary",
            "&:hover": {
              bgcolor: answers[question.id] ? "success.main" : "grey.400",
            },
          }}
        >
          {index + 1}
        </Button>
      ))}
    </Box>
  );
};

export default QuestionSummaryGrid;
