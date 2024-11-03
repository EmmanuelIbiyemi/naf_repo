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
import { useNavigate } from "react-router-dom";

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
  const [shareNote, { isLoading: isSharingNote }] = useShareNoteMutation();
  const [shareQuiz, { isLoading: isSharingQuiz }] = useShareQuizMutation();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    handleClose();
    navigate(-1);
  };

  interface FormValues {
    participants: number[];
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      participants: [],
    },
    validationSchema: yup.object({
      participants: yup
        .array()
        .of(yup.number())
        .min(1, "At least one participant is required")
        .required("At least one participant is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (noteId) {
          // For notes, use the original participant id
          await shareNote({
            note_id: noteId,
            participants: values.participants.map((id) => ({ id })),
          }).unwrap();
          handleOpenSuccessModal();
        } else if (quizId) {
          // For quizzes, use user_id from participants
          console.log();
          await shareQuiz({
            quiz_id: quizId,
            participants: values.participants
              .map((id) => {
                return id;
              })
              .filter((id) => id !== null),
          }).unwrap();
          handleOpenSuccessModal();
        } else {
          console.log("Shared with: ", values.participants);
          navigate("/instructor/posts");
        }
      } catch (error) {
        console.error("Share failed:", error);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
      setSearchTerm("");
    }
  }, [open]);

  const handleToggleUser = (id: number, user_id: number) => {
    const currentParticipants = formik.values.participants;
    const participantId = noteId ? id : user_id;
    console.log(participantId);

    const updatedParticipants = currentParticipants.includes(participantId)
      ? currentParticipants.filter((pid) => pid !== participantId)
      : [...currentParticipants, participantId];

    formik.setFieldValue("participants", updatedParticipants);
  };

  const handleSelectAll = () => {
    const allUserIds = participants.map((user) => user.user_id);
    const newSelection =
      formik.values.participants.length === participants.length
        ? []
        : allUserIds;
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
            slotProps={{
              input: {
                startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              },
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2">Select All</Typography>
            <Checkbox
              checked={
                formik.values.participants.length === participants.length
              }
              onChange={handleSelectAll}
            />
          </Box>

          <List sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
            {filteredUsers.map((user) => (
              <ListItem
                key={user.id}
                dense
                onClick={() => handleToggleUser(user.id, user.user_id)}
                sx={{ cursor: "pointer" }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={formik.values.participants.includes(user.user_id)}
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
                isSharingNote ||
                isSharingQuiz ||
                formik.values.participants.length === 0
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
