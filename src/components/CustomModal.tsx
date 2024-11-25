import { Box, Modal, SxProps } from "@mui/material";
import { PropsWithChildren } from "react";

type Props = {
  open: boolean;
  close: () => void;
} & PropsWithChildren;

const CustomModal = ({ open, close, children }: Props) => {
  return (
    <Modal open={open} onClose={close}>
      <Box sx={modalContentStyles}>{children}</Box>
    </Modal>
  );
};

export default CustomModal;

const modalContentStyles: SxProps = {
  bgcolor: "rgba(248, 250, 252, 1)",
  borderRadius: "var(--border-radius)",
  display: "grid",
  gap: "2rem",
  left: "50%",
  position: "fixed",
  padding: "2.5rem 1.5rem",
  top: "50%",
  transform: "translate(-50%,-50%)",
  width: "30vw",
};
