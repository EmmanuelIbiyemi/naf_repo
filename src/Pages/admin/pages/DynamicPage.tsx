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
  useUpdatePostMutation,
} from "../../../store/api/posts.api";
import { PostType, PostCreateType } from "../../../types/posts";
import MediaLibraryModal from "../media/MediaLibraryModal";
import { postElements } from "./elements/post-elements";
import { BlockType, MediaType } from "../../../types/blocks";
import LoadingScreen from "../../../components/LoadingScreen";
import { pageElements } from "./elements/page-elements";
import { navElements } from "./elements/navigation-elements";
import { footerElements } from "./elements/footer-elements";
import { Close } from "@mui/icons-material";

const PostPage = () => {
  const { resource_type, post_id } = useParams();
  const navigate = useNavigate();
  const [getPost, postState] = useGetPostMMutation();
  const [addPost] = useAddPostMutation();
  const [updatePost, updateState] = useUpdatePostMutation();
  const [post, setPost] = useState<PostType | null>(null);
  const [media, setMedia] = useState({
    url: "",
    type: "image",
    modal: false,
  });

  const addBlock = useCallback((type: string) => {
    setPost((prev) => {
      const blocks: PostType["blocks"] = prev?.blocks ? [...prev.blocks] : [];

      const content = postElements.find((el) => el.type === type)?.name ?? "";
      const newBlock: BlockType = {
        id: (blocks[blocks.length - 1]?.id ?? 0) + 1,
        content: content,
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
    const categories = [resource_type || ""];

    if (resource_type == "page") categories.push(post.title);

    const payload: PostCreateType = {
      ...post,
      blocks: post?.blocks || [],
      featured_image: media.url,
      categories: categories,
      tags: categories,
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
  }, [post, updatePost, addPost, getPost]);

  const handleBack = useCallback(() => {
    navigate(`/settings/posttype/${resource_type}`);
  }, [navigate]);

  const getSidebar = () => {
    const sidebars = {
      page: pageElements,
      posts: postElements,
      navigation: navElements,
      footer: footerElements,
    };
    const sidebar = sidebars[resource_type as keyof typeof sidebars];
    if (sidebar) return sidebar;
    return sidebars.posts;
  };

  const handleOpenModal = (type: string) => {
    setMedia((prev) => ({ ...prev, modal: true, mediaType: type }));
  };
  const handleCloseModal = () =>
    setMedia((prev) => ({ ...prev, modal: false }));

  const handleSelectFeaturedImage = (media: MediaType) => {
    setMedia((prev) => ({ ...prev, url: media.url }));
    handleCloseModal();
  };

  useEffect(() => {
    if (post_id && !post?.id) {
      getPost(+post_id).then((res) => {
        if (res.data?.post) setPost(res.data?.post);
      });
    } else if (post?.id && !post_id) {
      getPost(post?.id).then((res) => {
        if (res.data?.post) setPost(res.data.post);
      });
    }
  }, [post_id, post?.id, media]);

  if (!resource_type) navigate(-1);

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
            <IconButton>
              <Close />
            </IconButton>
          </Box>
          <MediaLibraryModal
            selectMedia={handleSelectFeaturedImage}
            mediaType={media.type}
          />
        </Box>
      </Dialog>
      {updateState.isLoading || postState.isLoading ? <LoadingScreen /> : null}
      <Box sx={{ paddingBottom: "2rem" }}>
        <Box sx={headerStyles}>
          <Button onClick={handleBack}>Back</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
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
  position: "sticky",
  top: 0,
  minHeight: "50%",
};

const sidebarContentStyles: SxProps = {
  bgcolor: "#fff",
  borderLeft: "1px solid rgba(204, 204, 204, 0.5)",

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
  },
};
