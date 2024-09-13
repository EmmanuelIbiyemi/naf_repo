import { Box, Modal, SxProps } from "@mui/material";
import IdontknowIcon from "../assets/idontknowIcon";
import { PropsWithChildren } from "react";

type Props = {
  open: boolean;
  close: () => void;
} & PropsWithChildren;

const FormModal = ({ open, close, children }: Props) => {
  return (
    <Modal open={open} onClose={close}>
      <Box sx={modalContentStyles}>
        <IdontknowIcon />
        {children}
      </Box>
    </Modal>
  );
};

export default FormModal;

const modalContentStyles: SxProps = {
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  display: "grid",
  left: "50%",
  position: "fixed",
  padding: "2rem 5rem 3rem",
  placeItems: "center",
  top: "50%",
  transform: "translate(-50%,-50%)",
  width: "50vw",
};
