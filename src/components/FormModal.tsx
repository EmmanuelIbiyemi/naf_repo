import { Box, Modal, SxProps, Typography } from "@mui/material";
import IdontknowIcon from "../assets/idontknowIcon";
import { PropsWithChildren } from "react";

type Props = {
  open: boolean;
  close: () => void;
  name: string;
} & PropsWithChildren;

const FormModal = ({ open, close, name, children }: Props) => {
  return (
    <Modal open={open} onClose={close}>
      <Box sx={modalContentStyles}>
        <IdontknowIcon />
        <Typography variant="h5" component="h2" sx={{ marginTop: "1rem" }}>
          {name}
        </Typography>
        <Box sx={{ marginTop: "3rem", width: "100%" }}>{children}</Box>
      </Box>
    </Modal>
  );
};

export default FormModal;

const modalContentStyles: SxProps = {
  bgcolor: "#fff",
  display: "grid",
  left: "50%",
  position: "fixed",
  padding: "2rem 5rem 3rem",
  placeItems: "center",
  top: "50%",
  transform: "translate(-50%,-50%)",
  width: "50vw",
};
