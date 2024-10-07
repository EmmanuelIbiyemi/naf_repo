import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Checkbox, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { PostType } from "../../../../types/posts";
import {
  removePost,
  selectCurrentPost,
  selectPosts,
  setCurrentPost,
} from "../../../../store/posts.slice";

const PostList = () => {
  const posts = useAppSelector(selectPosts);
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector(selectCurrentPost);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = (post: PostType) => {
    dispatch(setCurrentPost(post));
    setOpenModal(true);
  };

  const handleDelete = (id: number) => {
    dispatch(removePost(id));
  };

  const handleEditForm = (post: PostType) => {
    dispatch(setCurrentPost(post));
    navigate("/posts/add");
  };

  return (
    <TableContainer>
      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedPost) handleDelete(selectedPost.id);
            console.log("proceed");
          },
          undo: () => {
            console.log("cancel");
          },
        }}
        close={() => setOpenModal(false)}
        infoText=""
        open={openModal}
        subTitle={`Are you sure you want to delete Post <strong>“${selectedPost?.title}”</strong>? You can’t undo this action.`}
        title="Delete Post?"
      />

      <Table sx={{ minWidth: 650 }}>
        <TableBody>
          {posts.map((post) => (
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PostList;
