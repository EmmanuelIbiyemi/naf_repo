import { Box, Button, SxProps, Typography } from "@mui/material";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import PostItem from "./PageItem";
import SuccessModal from "../../../../components/SuccessModal";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import { useDeletePostMutation } from "../../../../store/api/posts.api";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  selectKeyword,
  setKeyword,
  setPageLoading,
} from "../../../../store/app.slice";
import EmptyState from "../../../../components/EmptyState";
import { useGetPostByCategoryQuery } from "../../../../store/api/posts.api";
import { useNavigate, useParams } from "react-router-dom";
import { PostType } from "../../../../types/posts";
import CustomPagination from "../../../../components/CustomPagination";
import { Pagination } from "../../../../types/pagination";
import { Search } from "@mui/icons-material";

const PostTypeItemList = () => {
  const { resource_type } = useParams();
  const dispatch = useAppDispatch();
  const keyword = useAppSelector(selectKeyword);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    per_page: 10,
  });
  const {
    data: posts,
    isError: allError,
    isFetching,
  } = useGetPostByCategoryQuery({
    ...pagination,
    tag: resource_type as string,
    search_term: keyword,
  });
  const [deletePost] = useDeletePostMutation();
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
    delete: false,
  });
  const [selectedPost, setSelectedPost] = useState<PostType>();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSearch = async (event: KeyboardEvent) => {
    if (event.key == "Enter")
      dispatch(setKeyword((event.target as HTMLInputElement).value));
  };

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching]);

  useEffect(() => {
    // clear search field on page change
    if (resource_type) {
      dispatch(setKeyword(""));
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [resource_type]);

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

        <Box sx={{ alignItems: "center", display: "flex", gap: "1rem" }}>
          <Box sx={searchFieldStyles}>
            <Search />
            <input
              ref={inputRef}
              name="keyword"
              placeholder="Search..."
              onKeyDown={handleSearch}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate(`/settings/posttype/${resource_type}/add`)}
          >
            Add {resource_type}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          ...TabStyles,
          display: "block",
        }}
      >
        {posts?.post.length ? (
          <>
            {posts?.post?.map((post) => (
              <PostItem
                key={`postitem-${post.id}`}
                post={post}
                deleteItem={() => handleDeleteAction(post)}
              />
            ))}
            <CustomPagination
              count={Math.ceil(
                posts?.pagination.total / posts?.pagination.per_page
              )}
              page={posts?.pagination.page}
              handleChangePage={(_, page) => {
                setPagination({ per_page: posts?.pagination.per_page, page });
              }}
              startIndex={
                posts?.pagination.per_page * (posts?.pagination.page - 1) + 1
              }
              endIndex={posts?.pagination.per_page * posts?.pagination.page}
              totalNumber={posts?.pagination.total}
            />
          </>
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

const fieldStyles: SxProps = {
  bgcolor: "#fff",
  border: "1px solid rgba(204, 204, 204, 0.6)",
  display: "inline-flex",

  "input, select": {
    border: "none",
    borderRadius: "var(--border-radius)",
    padding: ".8rem",
  },

  svg: {
    color: "rgba(138, 138, 138, 1)",
  },
};

const searchFieldStyles: SxProps = {
  ...fieldStyles,
  alignItems: "center",
  paddingInline: ".8rem",

  input: {
    outline: "none",
    width: "300px",
  },
};
