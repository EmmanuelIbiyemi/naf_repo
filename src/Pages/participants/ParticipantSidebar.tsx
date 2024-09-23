import {
  Box,
  Button,
  Divider,
  Drawer,
  SxProps,
  Typography,
} from "@mui/material";
import { ParticipantType } from "../../types/participants";
import participantImg from "/images/participant.png";
import { Mail } from "@mui/icons-material";
import formStyles from "../../components/form/form.module.scss";
import { LoadingButton } from "@mui/lab";

type Props = {
  open: boolean;
  participant: ParticipantType;
  toggleDrawer: (state: boolean) => void;
  openEditModal: () => void;
};

const ParticipantSidebar = ({
  open,
  participant,
  toggleDrawer,
  openEditModal,
}: Props) => {
  return (
    <Drawer open={open} onClose={() => toggleDrawer(false)} anchor="right">
      <Box sx={sideBarStyles}>
        <Box>
          <Typography variant="h5">Preview Infomation</Typography>
        </Box>
        <Divider sx={{ marginBottom: "1.5rem", marginTop: "1rem" }} />
        <Box sx={{ alignItems: "center", display: "flex", gap: "1rem" }}>
          <Box>
            <img src={participantImg} alt="" />
          </Box>
          <Box>
            <Typography variant="h6">
              {participant?.first_name} {participant?.last_name}
            </Typography>
            <Typography
              sx={{ alignItems: "center", display: "flex", gap: ".5rem" }}
            >
              <Mail
                sx={{ color: "rgba(179, 179, 179, 1)", fontSize: "1.2rem" }}
              />{" "}
              {participant?.email}
            </Typography>
          </Box>
        </Box>
        <Box sx={infoSectionStyles}>
          <Typography
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            Personal Information
          </Typography>
          <Typography>
            <span>First Name</span>
            <span>{participant?.first_name}</span>
          </Typography>
          <Typography>
            <span>Last Name</span>
            <span>{participant?.last_name}</span>
          </Typography>
          <Typography>
            <span>Phone Number</span>
            <span>{participant?.phone_number}</span>
          </Typography>
        </Box>
        <Box sx={infoSectionStyles}>
          <Typography
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            Course Enrolled
          </Typography>
          {participant?.courses?.map((c) => (
            <Box key={c.name}>
              <Box>
                <Typography>{c.name}</Typography>
                <Typography>{c.instructor}</Typography>
              </Box>
              <span>Fees paid</span>
            </Box>
          ))}
        </Box>
        <Box className={formStyles.btn_group} sx={{ marginTop: "2rem" }}>
          <Button
            onClick={() => toggleDrawer(false)}
            className={formStyles.cancel_btn}
            variant="contained"
          >
            Cancel
          </Button>
          <LoadingButton
            onClick={() => {
              toggleDrawer(false);
              openEditModal();
            }}
            className={formStyles.submit_btn}
            type="submit"
            variant="contained"
          >
            Edit
          </LoadingButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ParticipantSidebar;

const sideBarStyles: SxProps = {
  height: "100%",
  padding: "1.5rem",
  width: "35vw",

  p: {
    margin: 0,
  },
};

const infoSectionStyles: SxProps = {
  marginTop: "2rem",
  ".MuiTypography-root": {
    display: "flex",
    justifyContent: "space-between",
    padding: ".4rem 1rem",
  },
};
