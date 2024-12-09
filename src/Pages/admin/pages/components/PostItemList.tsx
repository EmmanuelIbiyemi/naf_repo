import { Box, Button, Checkbox, SxProps, Typography } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
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
import { Delete, Search } from "@mui/icons-material";

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
  const [deletePost, deleteState] = useDeletePostMutation();
  const [openModal, setOpenModal] = useState({
    add: false,
    success: false,
    delete: false,
    bulkDelete: false,
  });
  const [selectedPost, setSelectedPost] = useState<PostType>();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);

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

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (posts?.post.length && event.target.checked)
      setDeleteIds(posts.post.map((fac) => fac.id as number));
    else setDeleteIds([]);
  };

  const handleSelect = (
    event: ChangeEvent<HTMLInputElement>,
    postId: number
  ) => {
    const newIds = deleteIds.filter((id) => id != postId);
    setDeleteIds(event.target.checked ? [...newIds, postId] : newIds);
  };

  const handleBulkDelete = async () => {
    for (const id of deleteIds)
      try {
        await deletePost(id).unwrap();
        setDeleteIds([]);
      } catch (error) {
        console.log(error);
      }
  };

  const handleOpenDeleteModal = (media: PostType) => {
    handleOpenModal("delete");
    setSelectedPost(media);
  };

  const handleSearch = async (event: KeyboardEvent) => {
    if (event.key == "Enter")
      dispatch(setKeyword((event.target as HTMLInputElement).value));
  };

  useEffect(() => {
    if (isFetching && !allError) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching, allError]);

  useEffect(() => {
    // clear search field on page change
    if (resource_type) {
      dispatch(setKeyword(""));
      if (inputRef.current) inputRef.current.value = "";
    }

    if (!posts?.post.length && (pagination.page as number) > 1)
      setPagination((prev) => ({
        ...prev,
        page: (pagination.page as number) - 1,
      }));
  }, [resource_type, deleteState]);

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

      <DeleteConfirmationModal
        actions={{
          proceed: () => handleBulkDelete(),
        }}
        close={() => handleCloseModal("bulkDelete")}
        infoText="You can’t undo this action."
        open={openModal.bulkDelete}
        subTitle={`Are you sure you want to delete ${deleteIds.length} ${resource_type} ?`}
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
        {/* Bulk delete */}
        <Box sx={{ display: "flex", gap: "1rem" }}>
          <Checkbox
            onChange={handleSelectAll}
            checked={posts?.post?.length == deleteIds.length}
          />
          {deleteIds.length ? (
            <Button
              variant="contained"
              color="error"
              onClick={() =>
                setOpenModal((prev) => ({ ...prev, bulkDelete: true }))
              }
            >
              <Delete sx={{ marginRight: ".3rem" }} />
              Delete selected
            </Button>
          ) : null}
        </Box>
        {posts?.post.length ? (
          <>
            {posts?.post?.map((post) => (
              <PostItem
                key={`postitem-${post.id}`}
                post={post}
                deleteItem={() => handleOpenDeleteModal(post)}
                handleSelect={handleSelect}
                deleteIds={deleteIds}
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
