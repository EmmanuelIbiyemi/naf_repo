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
        <Button onClick={close}>Cancel</Button>
        <Button
          onClick={() => {
            actions.proceed();
            close();
          }}
        >
          {buttonText ? buttonText : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
