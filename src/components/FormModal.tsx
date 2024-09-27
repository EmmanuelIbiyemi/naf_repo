import { Box, Dialog, DialogProps, SxProps } from "@mui/material";
import IdontknowIcon from "../assets/idontknowIcon";
import { PropsWithChildren } from "react";

type Props = {
  open: boolean;
  close: () => void;
} & PropsWithChildren &
  DialogProps;

const FormModal = ({ open, close, children, ...rest }: Props) => {
  return (
    <Dialog open={open} onClose={close} scroll="body" {...rest}>
      <Box sx={modalContentStyles}>
        <IdontknowIcon />
        {children}
      </Box>
    </Dialog>
  );
};

export default FormModal;

const modalContentStyles: SxProps = {
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  display: "grid",
  padding: "2rem 5rem 3rem",
  placeItems: "center",
  width: "50vw",
};
