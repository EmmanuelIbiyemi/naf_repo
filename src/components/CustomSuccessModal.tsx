import { Box, Button, Modal, Typography } from "@mui/material";
// import SuccessIcon from "../assets/icons/deleted-modal.svg";
// import { FilledButton } from "./styled/styledButtons";

type Props = {
  open: boolean;
  handleClose: () => void;
  message: string;
  viewButton: boolean;
  handleClickView?: () => void;
};

const CustomSuccessModal = ({
  open,
  handleClose,
  message,
  handleClickView,
}: Props) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "2.5em",
          borderRadius: "24px",
          width: { xs: "90%", sm: "80%", md: "55vw" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* <Box sx={{ width: "7.5em" }}>
            <img src={SuccessIcon} alt="" style={{ width: "100%" }} />
          </Box> */}
          <Typography
            variant="h4"
            sx={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "#1E1E1E",
              marginTop: "1em",
            }}
          >
            Success
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: ".9rem",
              fontWeight: 400,
              color: "#95969D",
              marginTop: ".8em",
            }}
          >
            {message}
          </Typography>
          <Button sx={{ width: "240px", mt: 3 }} onClick={handleClickView}>
            View
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomSuccessModal;
