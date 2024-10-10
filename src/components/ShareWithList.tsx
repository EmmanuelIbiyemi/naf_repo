import { useState } from "react";
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

type ShareWithListProps = {
  open: boolean;
  handleClose: () => void;
  handleSelectedRecipients: (recipients: number[]) => void;
};

const ShareWithList = ({
  open,
  handleClose,
  handleSelectedRecipients,
}: ShareWithListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const users = [
    { id: 1, name: "Eloise Lokin" },
    { id: 2, name: "Lloyd Renner" },
    { id: 3, name: "Camille Spoer" },
    { id: 4, name: "Nick Pfeffer" },
    { id: 5, name: "Paula Grant" },
    { id: 6, name: "William Kilback" },
    { id: 7, name: "Manon Halvonor" },
  ];

  const handleToggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
            checked={selectedUsers.length === users.length}
            onChange={() =>
              setSelectedUsers(
                selectedUsers.length === users.length
                  ? []
                  : users.map((u) => u.id)
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
              <ListItemText primary={user.name} />
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
            onClick={() => {
              handleSelectedRecipients(selectedUsers);
              handleClose();
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareWithList;
