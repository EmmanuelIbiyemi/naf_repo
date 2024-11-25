import CustomModal from "./CustomModal";
import { Alert, Box, IconButton, Typography } from "@mui/material";
import happyEmoji from "../assets/happy-emoji.svg";
import { Close, Info } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

type Props = {
  open: boolean;
  close: () => void;
  title: string;
  subTitle: string;
  infoText: string;
};

const SuccessModal = ({ close, infoText, open, subTitle, title }: Props) => {
  return (
    <CustomModal close={close} open={open}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <img src={happyEmoji} alt="" />
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
          sx={{ width: "100%" }}
          onClick={close}
          type="submit"
          variant="contained"
        >
          Continue
        </LoadingButton>
      </Box>
    </CustomModal>
  );
};

export default SuccessModal;
