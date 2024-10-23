import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Modal,
  Typography,
  TextField,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import linkIcon from "../assets/linkIcon.svg";
import { ParticipantData } from "../types/participants";
import { useFormik } from "formik";
import * as yup from "yup";
import { useShareNoteMutation } from "../store/api/notes.api";
import SuccessModal from "./SuccessModal";
import { useShareQuizMutation } from "../store/api/quizzes.api";

type ShareWithListProps = {
  open: boolean;
  handleClose: () => void;
  noteId?: number | null;
  quizId?: number | null;
  participants: ParticipantData[];
};

const ShareWithList = ({
  open,
  handleClose,
  noteId,
  quizId,
  participants,
}: ShareWithListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [shareNote, { isLoading: isSharingNote }] = useShareNoteMutation();
  const [shareQuiz, { isLoading: isSharingQuiz }] = useShareQuizMutation();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      setSearchTerm("");
    }
  }, [open]);

  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      participants: [],
    },
    validationSchema: yup.object({
      participants: yup
        .array()
        .min(1, "At least one participant is required")
        .required("At least one participant is required"),
    }),
    onSubmit: async () => {
      try {
        if (noteId) {
          // For notes, keep the original format with objects containing id
          await shareNote({
            note_id: noteId,
            participants: selectedUsers.map((id) => ({ id })),
          }).unwrap();
          handleOpenSuccessModal();
        }
        if (quizId) {
          // For quizzes, just send the array of ids
          await shareQuiz({
            quiz_id: quizId,
            participants: selectedUsers, // This will send just the array of numbers
          }).unwrap();
          handleOpenSuccessModal();
        }
      } catch (error) {
        console.error("Share failed:", error);
      }
    },
  });

  const handleToggleUser = (userId: number) => {
    const updatedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];

    setSelectedUsers(updatedUsers);
    formik.setFieldValue("participants", updatedUsers);
  };

  const handleSelectAll = () => {
    const allUserIds = participants.map((user) => user.id);
    const newSelection =
      selectedUsers.length === participants.length ? [] : allUserIds;
    setSelectedUsers(newSelection);
    formik.setFieldValue("participants", newSelection);
  };

  const filteredUsers = participants.filter((user) => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

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
          component="form"
          onSubmit={formik.handleSubmit}
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
                <img src={linkIcon} style={{ width: "100%" }} alt="Share" />
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

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2">Select All</Typography>
            <Checkbox
              checked={selectedUsers.length === participants.length}
              onChange={handleSelectAll}
            />
          </Box>

          <List sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
            {filteredUsers.map((user) => (
              <ListItem
                key={user.id}
                dense
                onClick={() => handleToggleUser(user.id)}
                sx={{ cursor: "pointer" }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedUsers.includes(user.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                />
              </ListItem>
            ))}
          </List>

          {formik.touched.participants && formik.errors.participants && (
            <Typography color="error" sx={{ mb: 2 }}>
              {formik.errors.participants}
            </Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="text" onClick={handleClose}>
              Undo
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={
                isSharingNote || isSharingQuiz || selectedUsers.length === 0
              }
              type="submit"
            >
              {isSharingNote || isSharingQuiz ? "Sharing..." : "Continue"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <SuccessModal
        actions={{
          proceed: () => {
            console.log("proceed");
          },
          undo: () => {
            console.log("undo");
          },
        }}
        close={handleCloseSuccessModal}
        infoText=""
        open={openSuccessModal}
        subTitle={`You have successfully shared a ${
          noteId ? "note" : "quiz"
        } to your students`}
        title="Successful"
      />
    </>
  );
};

export default ShareWithList;
