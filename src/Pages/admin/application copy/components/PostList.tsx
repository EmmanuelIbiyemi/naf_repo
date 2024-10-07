import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
} from "@mui/material";
import {
  Delete,
  Drafts,
  Edit,
  Lock,
  MoreVert,
  Visibility,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { MouseEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { PostType } from "../../../../types/posts";
import {
  removePost,
  selectCurrentPost,
  selectPosts,
  setCurrentPost,
} from "../../../../store/posts.slice";

const PostList = () => {
  const forms = useAppSelector(selectPosts);
  const dispatch = useAppDispatch();
  const selectedForm = useAppSelector(selectCurrentPost);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  // Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (post: PostType) => {
    dispatch(setCurrentPost(post));
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    dispatch(removePost(id));
  };

  const handleEditForm = (post: PostType) => {
    dispatch(setCurrentPost(post));
    navigate("/applications/post");
  };

  const handleViewForm = (post: PostType) => {
    dispatch(setCurrentPost(post));
    navigate("/applications/applicants");
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedForm) handleDelete(selectedForm.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText="The students enrolled in this subject will get notified."
        open={openModal}
        subTitle={`Are you sure you want to delete subject <strong>“${selectedForm?.title}”</strong>? You can’t undo this action.`}
        title="Delete Course?"
      />

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>
          <Box sx={iconStyles}>
            <Drafts />
          </Box>
          Open Application
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Box sx={iconStyles}>
            <Lock />
          </Box>
          Close Application
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/applications/applicants");
          }}
        >
          <Box sx={iconStyles}>
            <Visibility />
          </Box>
          View Applied
        </MenuItem>
      </Menu>

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {forms.map((post) => (
            <TableRow
              key={post.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{ alignItems: "center", display: "flex", gap: "1rem" }}
              >
                <Checkbox />
                <Box>
                  <Button
                    variant="text"
                    onClick={() => handleViewForm(post)}
                    sx={{
                      textTransform: "capitalize",
                      border: "none !important",
                      padding: "0 !important",
                      display: "block !important",
                      textAlign: "left",
                    }}
                  >
                    {post.title}
                  </Button>
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleEditForm(post)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenModal(post)}>
                  <Delete />
                </IconButton>
                <IconButton onClick={handleClick}>
                  <MoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostList;

const iconStyles: SxProps = {
  border: "2px solid rgba(179, 179, 179, 1)",
  borderRadius: "100%",
  display: "grid",
  height: "25px",
  marginRight: ".5rem",
  placeItems: "center",
  width: "25px",

  svg: {
    fontSize: "18px",
    color: "rgba(179, 179, 179, 1)",
  },
};
