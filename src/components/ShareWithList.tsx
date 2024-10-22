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
import { shareNoteInput } from "../types/notes";
import { useShareNoteMutation } from "../store/api/notes.api";
import SuccessModal from "./SuccessModal";
import { shareQuizInput } from "../types/quizzes";
import { useShareQuizMutation } from "../store/api/quizzes.api";

type ShareWithListProps = {
  open: boolean;
  handleClose: () => void;
  // handleSelectedRecipients: (recipients: number[]) => void;
  noteId?: number | null;
  quizId?: number | null;
  participants: ParticipantData[];
};

const ShareWithList = ({
  open,
  handleClose,
  // handleSelectedRecipients,
  noteId,
  quizId,
  participants,
}: ShareWithListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [shareNote, { isLoading: isSharingNote }] = useShareNoteMutation();
  const [shareQuiz, { isLoading: isSharingQuiz }] = useShareQuizMutation();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const handleOpenSuccessModal = () => setOpenSuccessModal(true);
  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
    handleClose();
  };
  const formik = useFormik<shareNoteInput | shareQuizInput>({
    initialValues: {
      note_id: noteId || 0,
      quiz_id: quizId || 0,
      participants: [],
    },
    validationSchema: yup.object({
      // note_id: yup.number(),
      participants: yup
        .array()
        .of(
          yup.object({
            id: yup.number().required(),
          })
        )
        .required("At least one participant is required"),
    }),
    onSubmit: async () => {
      try {
        console.log(noteId);
        console.log(quizId);
        if (noteId != null) {
          await shareNote({
            note_id: noteId,
            participants: formik.values.participants,
          }).unwrap();
        }
        if (quizId != null) {
          console.log({
            quiz_id: quizId,
            participants: formik.values.participants,
          });
          await shareQuiz({
            quiz_id: quizId,
            participants: formik.values.participants,
          }).unwrap();
          handleOpenSuccessModal();
        }
      } catch (error) {
        console.error(error);
      }
      console.log("submitted");
    },
  });

  useEffect(() => {
    formik.setFieldValue("note_id", noteId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  const handleToggleUser = (userId: number) => {
    const updatedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];

    setSelectedUsers(updatedUsers);
    formik.setFieldValue(
      "participants",
      updatedUsers.map((id) => ({ id }))
    );
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
              checked={selectedUsers.length === participants.length}
              onChange={() =>
                setSelectedUsers(
                  selectedUsers.length === participants.length
                    ? []
                    : participants.map((u) => u.id)
                )
              }
            />
          </Box>

          <List sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
            {filteredUsers.map((user) => (
              <ListItem
                key={user.id}
                dense
                //   button
                onClick={() => handleToggleUser(user.id)}
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
                  primary={`${user.first_name} ${user.first_name}`}
                />
              </ListItem>
            ))}
          </List>

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
              {isSharingNote || isSharingQuiz ? "Sharing" : "Continue"}
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
        close={() => {
          handleCloseSuccessModal();
        }}
        infoText=""
        open={openSuccessModal}
        subTitle={`You have successfully shared a new note to your students`}
        title="Successful"
      />
    </>
  );
};

export default ShareWithList;
