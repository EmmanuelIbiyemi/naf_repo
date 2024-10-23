import React from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Step4ContentProps, TestFormData } from "./testformtypes";

const Step4Content: React.FC<Step4ContentProps> = ({ formData, onSubmit }) => {
  const location = useLocation();
  const stateFormData = location.state?.formData as TestFormData | undefined;

  const mergedFormData: TestFormData = {
    ...formData,
    ...stateFormData,
    questions: [
      ...(formData.questions || []),
      ...(stateFormData?.questions || []),
    ],
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review and Confirm
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Subject" secondary={mergedFormData.subject} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Total Questions"
            secondary={mergedFormData.totalQuestions}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Passing Percentage"
            secondary={`${mergedFormData.passingPercentage}%`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Schedule Date"
            secondary={mergedFormData.scheduleDate}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Expiration Date"
            secondary={mergedFormData.expirationDate}
          />
        </ListItem>
        <ListItem>
          <ListItemText primary="Type" secondary={mergedFormData.type} />
        </ListItem>
      </List>
      <Typography variant="subtitle1" gutterBottom>
        Total Questions: {mergedFormData.questions?.length || 0}
      </Typography>
      <Button
        variant="contained"
        onClick={() => onSubmit(mergedFormData)}
        fullWidth
      >
        Create Test
      </Button>
    </Box>
  );
};

export default Step4Content;
