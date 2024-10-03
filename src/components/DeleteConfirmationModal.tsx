import CustomModal from "./CustomModal";
import { Alert, Box, Button, IconButton, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import unhappyEmoji from "../assets/unhappy-emoji.svg";
import formStyles from "./form/form.module.scss";
import { Close, Info } from "@mui/icons-material";

type Props = {
  open: boolean;
  close: () => void;
  title: string;
  subTitle: string;
  infoText: string;
  actions: {
    undo: () => void;
    proceed: () => void;
  };
};

const DeleteConfirmationModal = ({
  actions,
  close,
  infoText,
  open,
  subTitle,
  title,
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
        <IconButton>
          <Close />
        </IconButton>
      </Box>
      <Typography variant="h4" dangerouslySetInnerHTML={{ __html: title }} />
      <Typography dangerouslySetInnerHTML={{ __html: subTitle }} />
      {infoText ? (
        <Alert severity="info" icon={<Info />}>
          {infoText}
        </Alert>
      ) : null}
      <Box className={formStyles.btn_group}>
        <Button
          onClick={() => {
            actions.undo();
            close();
          }}
          className={formStyles.cancel_btn}
          variant="contained"
        >
          Cancel
        </Button>
        <LoadingButton
          onClick={() => {
            actions.proceed();
            close();
          }}
          className={formStyles.submit_btn}
          type="submit"
          variant="contained"
        >
          Yes, delete it
        </LoadingButton>
      </Box>
    </CustomModal>
  );
};

export default DeleteConfirmationModal;
