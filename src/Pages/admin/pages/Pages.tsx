import { Box, Button, SxProps, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PostItem from "./components/PageItem";
import SuccessModal from "../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import { useDeletePostMutation } from "../../../store/api/posts.api";
import { useAppDispatch } from "../../../store/hooks";
import { setPageLoading } from "../../../store/app.slice";
import EmptyState from "../../../components/EmptyState";
import { useGetPostByCategoryQuery } from "../../../store/api/posts.api";
import { useNavigate } from "react-router-dom";
import { PostType } from "../../../types/posts";

const Pages = () => {
  const dispatch = useAppDispatch();
  const { data: pages, isError: allError } = useGetPostByCategoryQuery("page");
  const [deletePost] = useDeletePostMutation();
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
    delete: false,
  });
  const [selectedPost, setSelectedPost] = useState<PostType>();
  const navigate = useNavigate();

  const handleOpenModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: true }));
  };

  const handleCloseModal = (type: string) => {
    setOpenModal((prev) => ({ ...prev, [type]: false }));
  };

  const handleDeletePost = async (id: number) => {
    dispatch(setPageLoading(true));
    try {
      await deletePost(id).unwrap();
    } catch (error) {
      console.log(error);
    }
    handleOpenModal("success");
    dispatch(setPageLoading(false));
  };

  const handleDeleteAction = (media: PostType) => {
    handleOpenModal("delete");
    setSelectedPost(media);
  };

  useEffect(() => {
    console.log(pages);
  }, [pages]);

  return (
    <Box sx={contentStyles}>
      <SuccessModal
        close={() => {
          handleCloseModal("success");
        }}
        infoText=""
        open={openModal.success}
        subTitle={`Page successfully deleted`}
        title="Updates Successful"
      />

      <DeleteConfirmationModal
        actions={{
          proceed: () => {
            if (selectedPost) handleDeletePost(selectedPost.id as number);
            console.log("proceed");
          },
        }}
        close={() => handleCloseModal("delete")}
        infoText=""
        open={openModal.delete}
        subTitle={`Are you sure you want to delete media ? You can’t undo this action.`}
        title="Delete Page?"
      />

      <Box sx={headerStyles}>
        <Typography variant="h5">Pages</Typography>
        <Button variant="contained" onClick={() => navigate("/settings/post")}>
          Add Page
        </Button>
      </Box>

      <Box
        sx={{
          ...TabStyles,
          display: "block",
        }}
      >
        {pages?.post.length ? (
          pages?.post?.map((page) => (
            <PostItem
              key={`postitem-${page.id}`}
              post={page}
              deleteItem={() => handleDeleteAction(page)}
            />
          ))
        ) : (
          <EmptyState
            title={allError ? "Could Not Fetch Pages" : "No Pages yet"}
            subTitle="Pages will appear here after you add them in your school."
          />
        )}
      </Box>
    </Box>
  );
};

export default Pages;

const contentStyles: SxProps = {
  paddingInline: "2rem",
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem 2rem",
  position: "relative",
  zIndex: 1,
};

const TabStyles: SxProps = {
  bgcolor: "#fff",
  borderRadius: "var(--border-radius)",
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(4,1fr)",
  padding: "2rem",
};
