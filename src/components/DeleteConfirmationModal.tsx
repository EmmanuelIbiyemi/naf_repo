import CustomModal from "./CustomModal";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import unhappyEmoji from "../assets/unhappy-emoji.svg";
import { Close, Info } from "@mui/icons-material";

type Props = {
  open: boolean;
  close: () => void;
  title: string;
  subTitle: string;
  infoText: string;
  actions: {
    proceed: () => void;
  };
  buttonText?: string;
};

const DeleteConfirmationModal = ({
  actions,
  close,
  infoText,
  open,
  subTitle,
  title,
  buttonText,
}: Props) => {
  return (
    <CustomModal close={close} open={open}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <img src={unhappyEmoji} alt="" />
        <IconButton onClick={close}>
          <Close />
        </IconButton>
      </Box>
      <Box sx={{ display: "grid", gap: ".8rem" }}>
        <Typography variant="h4">{title}</Typography>
        <Typography>{subTitle}</Typography>
        {infoText ? (
          <Alert severity="info" icon={<Info />}>
            {infoText}
          </Alert>
        ) : null}
      </Box>
      <Box>
        <LoadingButton
          onClick={() => {
            actions.proceed();
            close();
          }}
          sx={{ width: "100%" }}
          type="submit"
          variant="contained"
        >
          {buttonText ? buttonText : "Yes, delete it"}
        </LoadingButton>
      </Box>
    </CustomModal>
  );
};

export default DeleteConfirmationModal;
