import {
  Box,
  Button,
  Dialog,
  IconButton,
  InputAdornment,
  SxProps,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { Close, Save as SaveIcon, Search } from "@mui/icons-material";
import { setPageLoading } from "../../../store/app.slice";
import { useAppDispatch } from "../../../store/hooks";
import BlockStyleFields from "./components/postblocks/BlockStyleFields";
import BlockEditorPanel from "./components/BlockEditorPanel";
import BlockTypeSelector from "./components/BlockTypeSelector";

const PostPage = () => {
  const { resource_type, post_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: postt, isFetching } = useGetPostQuery(+(post_id || 0), {
    skip: !post_id,
  });
  const [addPost] = useAddPostMutation();
  const [updatePost, updateState] = useUpdatePostMutation();
  const [, postState] = useGetPostMMutation();
  const [post, setPost] = useState<PostType | null>(null);
  const [media, setMedia] = useState({
    url: "",
    type: "image",
    modal: false,
  });
  const [categories, setCategories] = useState("");
  const [blockSearch, setBlockSearch] = useState("");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [menuLocations, setMenuLocations] = useState({
    header: false,
    footer: false,
    mobile: false,
    social: false,
  });
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const settingsPanelRef = useRef<HTMLDivElement | null>(null);

  const normalizeBlocks = useCallback(
    (blocks: BlockType[], prevBlocks?: BlockType[]) => {
      const prevById = new Map<number, BlockType>();
      const prevByRandomId = new Map<string, BlockType>();

      if (prevBlocks) {
        prevBlocks.forEach((block) => {
          if (block.id) prevById.set(block.id, block);
          if (block.randomId) prevByRandomId.set(block.randomId, block);
        });
      }

      const seen = new Set<string>();
      return blocks.reduce<BlockType[]>((acc, block, index) => {
        let randomId = block.randomId;

        if (!randomId && block.id) {
          const prev = prevById.get(block.id);
          if (prev?.randomId) randomId = prev.randomId;
        }

        if (!randomId) {
          randomId = Math.random().toString(36).substring(2, 15);
        }

        const key = block.id ? `id-${block.id}` : `rid-${randomId}`;
        if (seen.has(key)) return acc;
        seen.add(key);

        acc.push({
          ...block,
          randomId,
          position: block.position ?? index + 1,
        });

        return acc;
      }, []);
    },
    []
  );

  // Wrapper to provide a type-safe setPage for child components that expect PostType
  const handleSetPost: React.Dispatch<React.SetStateAction<PostType>> = (action) => {
    setPost((prev) => {
      if (prev === null) return prev;
      return typeof action === 'function' ? action(prev) : action;
    });
  };

  const selectedBlockIndex = post?.blocks.findIndex(
    (block) => block.randomId === selectedBlockId
  );
  const selectedBlock =
    selectedBlockIndex !== undefined && selectedBlockIndex >= 0
      ? post?.blocks[selectedBlockIndex]
      : null;
  const isRowBlock =
    selectedBlock?.settings?.layout === "row" && selectedBlock?.settings?.rowId;

  useEffect(() => {
    if (post?.categories) {
      setCategories(post.categories.map((category) => category.name.toLowerCase()).join(', '));
    }
  }, [post]);

  useEffect(() => {
    if (resource_type !== "navigation" || !post?.categories) return;
    const postCategories = post.categories.map((category) => category.name.toLowerCase());
    setMenuLocations({
      header: postCategories.includes("header"),
      footer: postCategories.includes("footer"),
      mobile: postCategories.includes("mobile"),
      social: postCategories.includes("social"),
    });
  }, [post, resource_type]);

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
        settings: type === "row" ? {
          layout: "row",
          rowId: Math.random().toString(36).substring(2, 15),
          columnWidth: "1/2",
        } : {},
        title: "",
      };

      return {
        ...prev,
        blocks: [...blocks, newBlock],
        title: prev?.title ?? "",
      };
    });
  }, []);

  const buildPayload = useCallback(
    (nextBlocks?: BlockType[]): PostCreateType | null => {
      if (!post || !post?.title) return null;
      const initialCategories = categories
        .split(',')
        .map((cat) => cat.trim().toLowerCase())
        .filter(Boolean);
      const resourceTag = resource_type?.toLowerCase();
      let categoriesArray = [];

      if (resourceTag === "navigation") {
        const nonMenuCategories = initialCategories.filter(
          (cat) => !["header", "footer", "mobile", "social", "navigation"].includes(cat)
        );
        const checkedLocations = Object.entries(menuLocations)
          .filter(([, checked]) => checked)
          .map(([category]) => category);
        categoriesArray = [
          ...new Set([...nonMenuCategories, ...checkedLocations, "navigation"]),
        ];
      } else {
        const additionalCategories = [
          ...(resource_type === "page" ? [post.title.toLowerCase()] : []),
          ...(resource_type ? [resource_type.toLowerCase()] : []),
        ];
        categoriesArray = [...new Set([...initialCategories, ...additionalCategories])];
      }

      const normalizedBlocks = (nextBlocks || post?.blocks || []).map(
        (block, index) => ({
          ...block,
          position: index + 1,
        })
      );

      return {
        ...post,
        blocks: normalizedBlocks,
        featured_image: post.featured_image || media.url,
        categories: categoriesArray,
        tags: categoriesArray,
      };
    },
    [post, categories, menuLocations, resource_type, media.url]
  );

  const handleSave = useCallback(async () => {
    const payload = buildPayload();
    if (!payload) return;

    dispatch(setPageLoading(true));
    try {
      if (post?.id) {
        const response = await updatePost(payload).unwrap();
        setPost((prev) => ({
          ...response.post,
          blocks: normalizeBlocks(response.post.blocks || [], prev?.blocks),
        }));
      } else {
        const response = await addPost(payload).unwrap();
        setPost((prev) => ({
          ...response.post,
          blocks: normalizeBlocks(response.post.blocks || [], prev?.blocks),
        }));
        navigate(`/settings/posttype/${resource_type}/${response.post.id}`);
      }
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      dispatch(setPageLoading(false));
    }
  }, [
    post,
    updatePost,
    addPost,
    buildPayload,
    resource_type,
    navigate,
    dispatch,
    normalizeBlocks,
  ]);

  const handleAutoSaveBlocks = useCallback(
    async (nextBlocks: BlockType[]) => {
      if (!post?.id) return;
      const payload = buildPayload(nextBlocks);
      if (!payload) return;

      dispatch(setPageLoading(true));
      try {
        await updatePost(payload).unwrap();
      } catch (error) {
        console.error("Failed to auto-save block order:", error);
      } finally {
        dispatch(setPageLoading(false));
      }
    },
    [post?.id, buildPayload, updatePost, dispatch]
  );

  const handleBack = useCallback(() => {
    navigate(`/settings/posttype/${resource_type}`);
  }, [navigate]);

  const getSidebar = () => {
    return elements;
  };
  const filteredElements = getSidebar().filter((el) =>
    el.name.toLowerCase().includes(blockSearch.toLowerCase())
  );

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
      setPost((prev) => ({
        ...postt.post,
        blocks: normalizeBlocks(postt.post.blocks || [], prev?.blocks),
      }));
    }
  }, [postt, normalizeBlocks]);

  useEffect(() => {
    if (!selectedBlockId && post?.blocks?.length) {
      setSelectedBlockId(post.blocks[0].randomId || null);
    }
  }, [post, selectedBlockId]);



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
      <Box sx={{ paddingBottom: "2rem" }}>
        <Box sx={headerStyles}>
          <Button onClick={handleBack}>Back</Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Typography variant="subtitle2" color="text.secondary">
              Draft
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={updateState.isLoading || postState.isLoading}
            >
              Save
            </Button>
          </Box>
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
          {resource_type === "navigation" && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1rem",
                bgcolor: "background.paper",
                padding: "1rem",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle1">Menu Location</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={menuLocations.header}
                    onChange={(e) =>
                      setMenuLocations((prev) => ({
                        ...prev,
                        header: e.target.checked,
                      }))
                    }
                  />
                }
                label="Header Menu"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={menuLocations.footer}
                    onChange={(e) =>
                      setMenuLocations((prev) => ({
                        ...prev,
                        footer: e.target.checked,
                      }))
                    }
                  />
                }
                label="Footer Menu"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={menuLocations.mobile}
                    onChange={(e) =>
                      setMenuLocations((prev) => ({
                        ...prev,
                        mobile: e.target.checked,
                      }))
                    }
                  />
                }
                label="Mobile Menu"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={menuLocations.social}
                    onChange={(e) =>
                      setMenuLocations((prev) => ({
                        ...prev,
                        social: e.target.checked,
                      }))
                    }
                  />
                }
                label="Social Menu"
              />
            </Box>
          )}
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
              selectedBlockId={selectedBlockId}
              onSelectBlock={(block) => setSelectedBlockId(block.randomId || null)}
              onReorder={handleAutoSaveBlocks}
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
      <Box sx={sidebarContentStyles} ref={sidebarRef}>
        <Box>
          <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
            Blocks
          </Typography>
          <TextField
            placeholder="Search blocks"
            size="small"
            value={blockSearch}
            onChange={(e) => setBlockSearch(e.target.value)}
            sx={{ marginBottom: "1rem" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={elementListStyles}>
            <Box sx={elementSideBar}>
              {filteredElements.map((el, i) => (
                <Button key={el.id + "-" + i} onClick={() => addBlock(el.type)}>
                  <el.icon />
                  <span>{el.name}</span>
                </Button>
              ))}
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Scroll to see more blocks.
          </Typography>
        </Box>
      </Box>
      {selectedBlock && (
        <Box sx={floatingSettingsPanelStyles} ref={settingsPanelRef}>
          <Box sx={{ padding: "1rem", backgroundColor: "#fff", height: "100%" }}>
            <Typography variant="subtitle2" sx={{ marginBottom: "0.75rem" }}>
              Editing: {selectedBlock.type}
            </Typography>
            {post ? (
              isRowBlock ? (
                <BlockEditorPanel
                  block={selectedBlock}
                  index={selectedBlockIndex ?? 0}
                  page={post}
                  setPage={handleSetPost}
                  showAppearance
                />
              ) : (
                <Box sx={{ display: "grid", gap: "1rem" }}>
                  <BlockTypeSelector block={selectedBlock} setPage={handleSetPost} />
                  <BlockStyleFields
                    block={selectedBlock}
                    blocks={post.blocks}
                    setPage={handleSetPost}
                  />
                </Box>
              )
            ) : null}
          </Box>
        </Box>
      )}
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

const elementListStyles: SxProps = {
  maxHeight: "340px",
  overflowY: "auto",
  paddingRight: "0.5rem",
  scrollbarGutter: "stable",
};

const floatingSettingsPanelStyles: SxProps = {
  position: "fixed",
  top: "26rem",
  right: "0",
  width: "300px",
  maxHeight: "calc(100vh - 26rem)",
  bgcolor: "#fff",
  border: "1px solid rgba(204, 204, 204, 0.5)",
  borderLeft: "1px solid rgba(204, 204, 204, 0.5)",
  boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.08)",
  zIndex: 999,
  overflowY: "auto",
  animation: "slideInRight 0.2s ease-out",
  "@keyframes slideInRight": {
    from: {
      opacity: 0,
      transform: "translateX(20px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
};
