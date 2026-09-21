import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type Props = {
  open: boolean;
  close: () => void;
  title: string;
  subTitle: string;
  infoText?: string;
};

const SuccessModal = ({ close, infoText, open, subTitle, title }: Props) => {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {subTitle}
          {infoText && <>{infoText}</>}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} autoFocus>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
