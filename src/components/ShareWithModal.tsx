import { useState } from "react";
import { Modal, Box, IconButton, Typography, Button } from "@mui/material";
import { Close, East } from "@mui/icons-material";
import ShareWithList from "./ShareWithList";
import linkIcon from "../assets/linkIcon.svg";
import { ParticipantData } from "../types/participants";

type ShareWithModalProps = {
  open: boolean;
  handleClose: () => void;
  // handleSelectedRecipients: (recipients: number[]) => void;
  noteId: number | null;
  participants: ParticipantData[];
};

const ShareWithModal = ({
  open,
  handleClose,
  // handleSelectedRecipients,
  noteId,
  participants,
}: ShareWithModalProps) => {
  const [shareOption, setShareOption] = useState<string | null>(null);
  const [showShareWithList, setShowShareWithList] = useState(false);

  const handleOptionClick = (option: string) => {
    setShareOption(option);
  };

  const handleContinue = () => {
    if (shareOption === "selectedUsers" || shareOption === "byCourse") {
      setShowShareWithList(true);
      handleClose();
    } else {
      // Handle sharing with everyone
      console.log("Sharing with everyone");
      handleClose();
    }
  };

  const handleShareWithListClose = () => {
    setShowShareWithList(false);
    handleClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#F8FAFC",
            borderRadius: "10px",
            width: "30em",
            padding: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2em",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ width: "2.5em" }}>
                <img src={linkIcon} style={{ width: "100%" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{ fontSize: "1.5rem", color: "#0F172A" }}
              >
                Share With
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* <Button
              variant={shareOption === "everyone" ? "contained" : "outlined"}
              onClick={() => handleOptionClick("everyone")}
              sx={{
                padding: ".8rem",
                backgroundColor:
                  shareOption === "everyone" ? "#F0F9FF" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.4,
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: ".9rem", color: "#40454A" }}
                >
                  Everyone
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: ".6rem",
                    color: "#40454A",
                  }}
                >
                  Anyone with the link can view
                </Typography>
              </Box>
              <Box
                sx={{
                  border: "1px solid #0284C7",
                  width: "2.5em",
                  height: "2.5em",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  backgroundColor:
                    shareOption === "everyone" ? "#0284C7" : "#0284C733",
                }}
              >
                <East
                  sx={{
                    color: shareOption === "everyone" ? "#fff" : "#0284C7",
                  }}
                />
              </Box>
            </Button> */}

            <Button
              variant={
                shareOption === "selectedUsers" ? "contained" : "outlined"
              }
              onClick={() => handleOptionClick("selectedUsers")}
              sx={{
                padding: ".8rem",
                backgroundColor:
                  shareOption === "selectedUsers" ? "#F0F9FF" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.4,
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: ".9rem", color: "#40454A" }}
                >
                  Selected Users
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    //   ml: 1,
                    fontSize: ".6rem",
                    color: "#40454A",
                  }}
                >
                  Only selected people can view
                </Typography>
              </Box>
              <Box
                sx={{
                  border: "1px solid #0284C7",
                  width: "2.5em",
                  height: "2.5em",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  backgroundColor:
                    shareOption === "selectedUsers" ? "#0284C7" : "#0284C733",
                }}
              >
                <East
                  sx={{
                    color: shareOption === "selectedUsers" ? "#fff" : "#0284C7",
                  }}
                />
              </Box>
            </Button>

            <Button
              variant={shareOption === "byCourse" ? "contained" : "outlined"}
              onClick={() => handleOptionClick("byCourse")}
              sx={{
                padding: ".8rem",
                backgroundColor:
                  shareOption === "byCourse" ? "#F0F9FF" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 0.4,
              }}
            >
              <Box sx={{ textAlign: "left" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: ".9rem", color: "#40454A" }}
                >
                  By Course
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    //   ml: 1,
                    fontSize: ".6rem",
                    color: "#40454A",
                  }}
                >
                  Select recipients based on their course
                </Typography>
              </Box>
              <Box
                sx={{
                  border: "1px solid #0284C7",
                  width: "2.5em",
                  height: "2.5em",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "4px",
                  backgroundColor:
                    shareOption === "byCourse" ? "#0284C7" : "#0284C733",
                }}
              >
                <East
                  sx={{
                    color: shareOption === "byCourse" ? "#fff" : "#0284C7",
                  }}
                />
              </Box>
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="text" onClick={handleClose}>
              Undo
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleContinue}
              disabled={!shareOption}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Modal>

      <ShareWithList
        open={showShareWithList}
        handleClose={handleShareWithListClose}
        // handleSelectedRecipients={handleSelectedRecipients}
        noteId={noteId}
        participants={participants}
      />
    </>
  );
};

export default ShareWithModal;
