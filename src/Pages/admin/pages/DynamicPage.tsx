import {
  Box,
  Button,
  Dialog,
  IconButton,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import PageBuilder from "./components/DynamicPostBuilder";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddPostMutation,
  useGetPostMMutation,
  useGetPostQuery,
  useUpdatePostMutation,
} from "../../../store/api/posts.api";
import { PostType, PostCreateType } from "../../../types/posts";
import MediaLibraryModal from "../media/MediaLibraryModal";
import { elements } from "./elements/post-elements";
import { BlockType, MediaType } from "../../../types/blocks";
import LoadingScreen from "../../../components/LoadingScreen";
import { Close, Save as SaveIcon } from "@mui/icons-material";
import { setPageLoading } from "../../../store/app.slice";
import { useAppDispatch } from "../../../store/hooks";

const PostPage = () => {
  const { resource_type, post_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [getPost, postState] = useGetPostMMutation();
  const { data: postt, isFetching } = useGetPostQuery(+(post_id || 0), {
    skip: !post_id,
  });
  const [addPost] = useAddPostMutation();
  const [updatePost, updateState] = useUpdatePostMutation();
  const [post, setPost] = useState<PostType | null>(null);
  const [media, setMedia] = useState({
    url: "",
    type: "image",
    modal: false,
  });
  const [categories, setCategories] = useState("");

  useEffect(() => {
    if (post?.categories) {
      setCategories(post.categories.map((category) => category.name.toLowerCase()).join(', '));
    }
  }, [post]);

  const addBlock = useCallback((type: string) => {
    setPost((prev) => {
      const blocks: PostType["blocks"] = prev?.blocks ? [...prev.blocks] : [];

      const newBlock: BlockType = {
        id: 0,
        randomId: Math.random().toString(36).substring(2, 15),
        content: "",
        type,
        caption: "",
        link: "",
        media: [],
        position: blocks.length + 1,
        title: "",
      };

      return {
        ...prev,
        blocks: [...blocks, newBlock],
        title: prev?.title ?? "",
      };
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!post || !post?.title) return;
    const initialCategories = categories.split(',').map(cat => cat.trim().toLowerCase()).filter(Boolean);
    const additionalCategories = [
      ...(resource_type === "page" ? [post.title.toLowerCase()] : []),
      ...(resource_type ? [resource_type.toLowerCase()] : [])
    ];
    const categoriesArray = [...new Set([...initialCategories, ...additionalCategories])];

    const payload: PostCreateType = {
      ...post,
      blocks: post?.blocks || [],
      featured_image: post.featured_image || media.url,
      categories: categoriesArray,
      tags: categoriesArray,
    };

    try {
      if (post.id) {
        const response = await updatePost(payload).unwrap();
        setPost(response.post);
      } else {
        const response = await addPost(payload).unwrap();
        setPost(response.post);
        navigate(`/settings/posttype/${resource_type}/${response.post.id}`);
      }
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  }, [post, updatePost, addPost, getPost, categories]);

  const handleBack = useCallback(() => {
    navigate(`/settings/posttype/${resource_type}`);
  }, [navigate]);

  const getSidebar = () => {
    return elements;
  };

  const handleOpenModal = (type: string) => {
    setMedia((prev) => ({ ...prev, modal: true, mediaType: type }));
  };
  const handleCloseModal = () =>
    setMedia((prev) => ({ ...prev, modal: false }));

  const handleSelectFeaturedImage = (media: MediaType) => {
    setMedia((prev) => ({ ...prev, url: media.url }));
    // Also update the post state so the featured image persists
    setPost((prev) => (prev ? { ...prev, featured_image: media.url } : prev));
    handleCloseModal();
  };

  useEffect(() => {
    if (postt?.post) {
      const updatedBlocks = postt.post.blocks.map((block) => ({
        ...block,
        randomId: block.randomId || Math.random().toString(36).substring(2, 15),
      }));
      setPost({ ...postt.post, blocks: updatedBlocks });
    }
  }, [postt]);

  useEffect(() => {
    if (isFetching) dispatch(setPageLoading(true));
    else dispatch(setPageLoading(false));
  }, [isFetching]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl (or Command on Mac) + S
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSave]);
  

  if (!resource_type) navigate(-1);

  function setPostDate(value: string): void {
    setPost((prev) => (prev ? { ...prev, date: value } : prev));
  }

  return (
    <Box sx={contentStyles}>
      <Dialog
        open={media.modal}
        onClose={handleCloseModal}
        scroll="body"
        sx={{
          ".MuiPaper-root": { maxWidth: "100% !important" },
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            width: "min(100vw, 1000px)",
          }}
        >
          <Box sx={{ padding: "1rem 1rem 0 0", textAlign: "end" }}>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Box>
          <MediaLibraryModal
            key="modal-1"
            selectMedia={handleSelectFeaturedImage}
            mediaType={media.type}
          />
        </Box>
      </Dialog>
      {updateState.isLoading || postState.isLoading ? <LoadingScreen /> : null}
      <Box sx={{ paddingBottom: "2rem" }}>
        <Box sx={headerStyles}>
          <Button onClick={handleBack}>Back</Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <label htmlFor="">Name</label>
          <TextField
            variant="outlined"
            value={post?.title || ""}
            onChange={(e) =>
              setPost((prev) =>
                prev
                  ? { ...prev, title: e.target.value }
                  : { title: e.target.value, blocks: [] }
              )
            }
          />
          {post?.categories?.find((cat) => cat.name == "posts") ? (
            <>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <label htmlFor="">Featured Image</label>

                <Button
                  variant="outlined"
                  onClick={() => handleOpenModal("featured")}
                >
                  Choose Featured Image
                </Button>
              </Box>
              <Box
                className="has_bg_image"
                sx={{
                  height: "150px",
                  borderRadius: "var(--border-radius)",
                  overflow: "hidden",
                }}
              >
                {media.url || post.featured_image ? (
                  <img
                    src={media.url || post.featured_image}
                    alt=""
                    className="bg"
                  />
                ) : (
                  <img
                    src="https://fakeimg.pl/600x200?text=No+Featured+Image"
                    alt=""
                    className="bg"
                  />
                )}
              </Box>
            </>
          ) : null}
          {resource_type === "posts" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <label htmlFor="">Categories</label>
              <TextField
                variant="outlined"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
              />
            </Box>
          )}
          {resource_type === "posts" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <label htmlFor="">Post Date</label>
              <TextField
                type="datetime-local"
                variant="outlined"
                value={post?.date || ""}
                onChange={(e) => setPostDate(e.target.value)}
              />
            </Box>
          )}
        </Box>
        <Box sx={blockContainerStyles}>
          {post && (
            <PageBuilder
              page={post}
              setPage={(newPost) => {
                if (typeof newPost === "function") {
                  setPost((prev) => {
                    if (!prev) return prev;
                    return newPost(prev);
                  });
                } else {
                  setPost(newPost);
                }
              }}
            />
          )}
          <IconButton
            aria-label="save"
            onClick={handleSave}
            sx={floatingButtonStyles}
          >
            <SaveIcon titleAccess="Save Changes" />
          </IconButton>
        </Box>
      </Box>
      <Box sx={sidebarContentStyles}>
        <Box>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Blocks
          </Typography>
          <Box sx={elementSideBar}>
            {getSidebar().map((el, i) => (
              <Button key={el.id + "-" + i} onClick={() => addBlock(el.type)}>
                <el.icon />
                <span>{el.name}</span>
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostPage;

const contentStyles: SxProps = {
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "1fr 300px",
  paddingInline: "2rem 0rem",
  height: "100%",
};

const headerStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  paddingBlock: "1rem",
};

const blockContainerStyles: SxProps = {
  bgcolor: "#fff",
  border: "1px solid rgba(204, 204, 204, 0.5)",
  borderRadius: "var(--border-radius)",
  position: "relative",
  minHeight: "50%",
  padding: "1rem",
};

const sidebarContentStyles: SxProps = {
  bgcolor: "#fff",
  borderLeft: "1px solid rgba(204, 204, 204, 0.5)",
  maxHeight: "100vh", // Set a maximum height
  overflowY: "auto", // Enable vertical scrolling

  ">div": { position: "sticky", top: 0, padding: "1rem" },
};

const elementSideBar: SxProps = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "1fr 1fr",
  gridAutoRows: "100px",

  button: {
    bgcolor: "rgba(245, 245, 245, 1)",
    color: "inherit",
    display: "grid",
    placeContent: "center",
    placeItems: "center",
    fontSize: "0.675rem",
  },
};

const floatingButtonStyles: SxProps = {
  position: "absolute",
  bottom: "20px",
  right: "20px",
  zIndex: 1000,
  backgroundColor: "primary.main",
  color: "#fff",
  "&:hover": {
    backgroundColor: "primary.dark",
  },
};
