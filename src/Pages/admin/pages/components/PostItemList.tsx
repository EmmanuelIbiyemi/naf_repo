import { Box, Button, SxProps, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PostItem from "./PageItem";
import SuccessModal from "../../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useDeletePostMutation } from "../../../../store/api/posts.api";
import { useAppDispatch } from "../../../../store/hooks";
import { setPageLoading } from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { useGetPostByCategoryQuery } from "../../../../store/api/posts.api";
import { useNavigate, useParams } from "react-router-dom";
import { PostType } from "../../../../types/posts";

const PostTypeItemList = () => {
  const { resource_type } = useParams();
  const dispatch = useAppDispatch();
  const {
    data: posts,
    isError: allError,
    isFetching,
  } = useGetPostByCategoryQuery(resource_type as string);
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
    if (isFetching) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching]);

  return (
    <Box sx={contentStyles}>
      <SuccessModal
        close={() => {
          handleCloseModal("success");
        }}
        infoText=""
        open={openModal.success}
        subTitle={`${resource_type} successfully deleted`}
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
        subTitle={`Are you sure you want to delete ${resource_type} ? You can’t undo this action.`}
        title={`Delete ${resource_type}?`}
      />

      <Box sx={headerStyles}>
        <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
          {resource_type}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(`/settings/posttype/${resource_type}/add`)}
        >
          Add {resource_type}
        </Button>
      </Box>

      <Box
        sx={{
          ...TabStyles,
          display: "block",
        }}
      >
        {posts?.post.length ? (
          posts?.post?.map((post) => (
            <PostItem
              key={`postitem-${post.id}`}
              post={post}
              deleteItem={() => handleDeleteAction(post)}
            />
          ))
        ) : (
          <EmptyState
            title={
              allError
                ? `Could Not Fetch ${resource_type}`
                : `No ${resource_type} yet`
            }
            subTitle={`${resource_type} will appear here after you add them in your school.`}
          />
        )}
      </Box>
    </Box>
  );
};

export default PostTypeItemList;

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
