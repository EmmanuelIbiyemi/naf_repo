import {
  Box,
  Button,
  Dialog,
  DialogProps,
  SxProps,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { CBTSubjectType } from "../../../../types/subjects";
import PlusIcon from "../../../../assets/plusIcon";

type Props = {
  open: boolean;
  close: () => void;
} & DialogProps;

const HostCBTModal = ({ open, close, ...rest }: Props) => {
  const [subjects] = useState<CBTSubjectType[]>([
    {
      id: 1,
      name: "Subject 1",
      questions: [
        {
          id: 1,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
        {
          id: 2,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
        {
          id: 3,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
      ],
    },
    {
      id: 2,
      name: "Subject 1",
      questions: [
        {
          id: 1,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
        {
          id: 2,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
        {
          id: 3,
          options: ["option 1", "option 2", "option 3", "option 4"],
          question: "What is the meaning of life ?",
          answer: "option 1",
        },
      ],
    },
  ]);

  const handleSelect = (event: MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event;
    if (currentTarget.style.border) currentTarget.style.border = "";
    else currentTarget.style.border = "2px solid rgba(3, 105, 161, 1)";
  };

  return (
    <Dialog open={open} onClose={close} scroll="body" {...rest}>
      <Box sx={modalContentStyles}>
        <Typography variant="h5">Host Test</Typography>
        <Typography>Select 4 subject combinations to continue</Typography>
        <Box sx={cardsContainerStyles}>
          {subjects.map((sb) => (
            <Button key={sb.name} sx={cardStyles} onClick={handleSelect}>
              <PlusIcon />
              <Typography>{sb.name}</Typography>
              <Typography>{sb.questions.length} Questions</Typography>
            </Button>
          ))}
        </Box>
        <Typography sx={{ color: "rgba(229, 72, 77, 1)", marginTop: "1rem" }}>
          You can select only a maximum of 4 subjects that total to 100
          questions.
        </Typography>
        <Box sx={buttonGroupStyles}>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={close} variant="contained">
            Host
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default HostCBTModal;

const modalContentStyles: SxProps = {
  bgcolor: "rgba(245, 245, 245, 1)",
  borderRadius: "var(--border-radius)",
  display: "grid",
  padding: "2rem 5rem 3rem",
  placeItems: "center",
  width: "50vw",
};

const cardsContainerStyles: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "1fr 1fr 1fr",
  marginTop: "3rem",
  textAlign: "center",
  width: "100%",
};

const cardStyles: SxProps = {
  bgcolor: "#fff",
  border: "2px solid transparent",
  borderRadius: "var(--border-radius)",
  display: "block",
  padding: "2rem !important",
};

const buttonGroupStyles: SxProps = {
  display: "flex",
  gap: "3rem",
  marginTop: "2rem",

  button: {
    height: "50px",
    width: "140px",
  },
};
