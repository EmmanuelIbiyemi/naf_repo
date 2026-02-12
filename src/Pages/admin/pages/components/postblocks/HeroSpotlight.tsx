import {
  Box,
  Button,
  Dialog,
  IconButton,
  SxProps,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Close, CloudUploadOutlined } from "@mui/icons-material";
import { BlockType } from "../../../../../types/blocks";
import { PostCreateType, PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";
import { MediaType } from "../../../../../types/media";
import MediaLibraryModal from "../../../media/MediaLibraryModal";
import { useUpdatePostMutation } from "../../../../../store/api/posts.api";
import IconPicker from "../../../../../components/IconPicker";

type HeroAction = {
  label: string;
  link: string;
};

type HeroQuickLink = {
  title: string;
  description?: string;
  link?: string;
};

type HeroQuickAction = {
  title: string;
  description?: string;
  link?: string;
  icon?: string;
  tone?: "primary" | "success" | "neutral";
};

type HeroConfig = {
  badges?: string[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  quickLinks?: HeroQuickLink[];
  quickActions?: {
    title?: string;
    subtitle?: string;
    items?: HeroQuickAction[];
  };
};

const parseConfig = (content: string): HeroConfig => {
  if (!content) return {};
  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

type MediaState = {
  media: MediaType | null;
  modal: boolean;
};

const HeroSpotlightBlock = ({
  page,
  setPage,
  element,
  index,
}: {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
}) => {
  const [updatePost] = useUpdatePostMutation();
  const [config, setConfig] = useState<HeroConfig>({});
  const [activeBlock, setActiveBlock] = useState<BlockType>();
  const [mediaState, setMediaState] = useState<MediaState>({ media: null, modal: false });

  useEffect(() => {
    setConfig(parseConfig(element.content));
  }, [element.content]);

  useEffect(() => {
    handlePositionChange(index + 1, element.randomId);
  }, [index]);

  const updateBlock = (newBlock: BlockType) => {
    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((block) =>
        block.randomId === newBlock.randomId ? newBlock : block
      );
      return { ...prev, blocks: updatedBlocks };
    });
  };

  const syncConfig = (nextConfig: HeroConfig) => {
    setConfig(nextConfig);
    updateBlock({ ...element, content: JSON.stringify(nextConfig) });
  };

  const handlePositionChange = (position: number, randomId: string | null | undefined) => {
    const foundBlock = page.blocks.find((block) => block.randomId === randomId);
    if (foundBlock) {
      updateBlock({ ...foundBlock, position });
    }
  };

  const handleOpenModal = () => {
    setMediaState((prev) => ({ ...prev, modal: true }));
  };

  const handleCloseModal = () => setMediaState((prev) => ({ ...prev, modal: false }));

  const handleOpenMediaSelect = (block: BlockType) => {
    setActiveBlock(block);
    handleOpenModal();
  };

  const handleSelectImage = async (media: MediaType, blockId: number) => {
    if (page) {
      try {
        const blocks = page.blocks.map((b) => {
          if (b.id === blockId)
            return {
              ...b,
              media: [{ id: media.id }],
            };
          return b;
        });

        const payload: PostCreateType = {
          ...page,
          blocks: blocks,
          categories: page.categories?.map((cat) => cat.name),
          tags: page.tags?.map((cat) => cat.name),
        };

        updatePost(payload).unwrap();
      } catch (error) {
        console.log(error);
      }
      handleCloseModal();
    }
  };

  const badges = config.badges || [];
  const quickLinks = config.quickLinks || [];
  const quickActions = config.quickActions?.items || [];

  const addBadge = () => syncConfig({ ...config, badges: [...badges, ""] });
  const addQuickLink = () =>
    syncConfig({ ...config, quickLinks: [...quickLinks, { title: "", description: "", link: "" }] });
  const addQuickAction = () =>
    syncConfig({
      ...config,
      quickActions: {
        ...(config.quickActions || {}),
        items: [...quickActions, { title: "", description: "", link: "", icon: "", tone: "neutral" }],
      },
    });

  const updateBadge = (index: number, value: string) => {
    syncConfig({
      ...config,
      badges: badges.map((badge, i) => (i === index ? value : badge)),
    });
  };

  const updateQuickLink = (index: number, field: keyof HeroQuickLink, value: string) => {
    syncConfig({
      ...config,
      quickLinks: quickLinks.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    });
  };

  const updateQuickAction = (index: number, field: keyof HeroQuickAction, value: string) => {
    syncConfig({
      ...config,
      quickActions: {
        ...(config.quickActions || {}),
        items: quickActions.map((action, i) => (i === index ? { ...action, [field]: value } : action)),
      },
    });
  };

  const updateQuickActionsMeta = (field: "title" | "subtitle", value: string) => {
    syncConfig({
      ...config,
      quickActions: {
        ...(config.quickActions || {}),
        [field]: value,
      },
    });
  };

  const updateAction = (field: "primaryAction" | "secondaryAction", key: keyof HeroAction, value: string) => {
    syncConfig({
      ...config,
      [field]: { ...(config[field] || {}), [key]: value } as HeroAction,
    });
  };

  const removeBadge = (index: number) => {
    syncConfig({
      ...config,
      badges: badges.filter((_, i) => i !== index),
    });
  };

  const removeQuickLink = (index: number) => {
    syncConfig({
      ...config,
      quickLinks: quickLinks.filter((_, i) => i !== index),
    });
  };

  const removeQuickAction = (index: number) => {
    syncConfig({
      ...config,
      quickActions: {
        ...(config.quickActions || {}),
        items: quickActions.filter((_, i) => i !== index),
      },
    });
  };

  const badgeCount = useMemo(() => badges.length, [badges]);
  const quickLinkCount = useMemo(() => quickLinks.length, [quickLinks]);
  const quickActionCount = useMemo(() => quickActions.length, [quickActions]);

  return (
    <>
      <Dialog
        open={mediaState.modal}
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
            key="modal-hero-spotlight"
            selectMedia={(media) => handleSelectImage(media, activeBlock?.id as number)}
            mediaType="image"
          />
        </Box>
      </Dialog>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <Typography variant="h5">Hero Spotlight</Typography>
          <ActionButtons block={element} setPage={setPage} />
        </Box>

        <Box sx={{ display: "grid", gap: "0.75rem" }}>
          <TextField
            label="Headline"
            value={element.title || ""}
            onChange={(e) => updateBlock({ ...element, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Subheadline"
            value={element.caption || ""}
            onChange={(e) => updateBlock({ ...element, caption: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />

          <Box sx={imageEl}>
            <Box
              className="image_el dashed_border"
              onClick={() => handleOpenMediaSelect(element)}
            >
              {element.media?.length ? (
                <Box
                  className="hide_scrollbar"
                  sx={{
                    display: "flex",
                    gap: "10px",
                    height: "100%",
                    maxWidth: "550px",
                    overflow: "auto",
                    ">div": {
                      flexShrink: "0",
                      height: "100%",
                      width: "100px",
                    },
                  }}
                >
                  {element.media?.map((m) => (
                    <Box className="has_bg_image" key={`media-${m?.id}`}>
                      <img
                        className="bg"
                        src={(m as MediaType).url}
                        alt={(m as MediaType).name}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    width: "100%",
                  }}
                >
                  <CloudUploadOutlined /> Drag and drop your image here or browse
                </Box>
              )}
            </Box>
          </Box>

          <Typography variant="subtitle2">Badges</Typography>
          <Box sx={{ display: "grid", gap: "0.5rem" }}>
            {badges.map((badge, badgeIndex) => (
              <Box key={`badge-${badgeIndex}`} sx={{ display: "flex", gap: "0.5rem" }}>
                <TextField
                  label={`Badge ${badgeIndex + 1}`}
                  value={badge}
                  onChange={(e) => updateBadge(badgeIndex, e.target.value)}
                  fullWidth
                />
                <Button color="error" onClick={() => removeBadge(badgeIndex)}>
                  Remove
                </Button>
              </Box>
            ))}
            <Button variant="outlined" onClick={addBadge}>
              Add Badge ({badgeCount})
            </Button>
          </Box>

          <Typography variant="subtitle2">Primary action</Typography>
          <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
            <TextField
              label="Primary label"
              value={config.primaryAction?.label || ""}
              onChange={(e) => updateAction("primaryAction", "label", e.target.value)}
              fullWidth
            />
            <TextField
              label="Primary link"
              value={config.primaryAction?.link || ""}
              onChange={(e) => updateAction("primaryAction", "link", e.target.value)}
              fullWidth
            />
          </Box>

          <Typography variant="subtitle2">Secondary action</Typography>
          <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
            <TextField
              label="Secondary label"
              value={config.secondaryAction?.label || ""}
              onChange={(e) => updateAction("secondaryAction", "label", e.target.value)}
              fullWidth
            />
            <TextField
              label="Secondary link"
              value={config.secondaryAction?.link || ""}
              onChange={(e) => updateAction("secondaryAction", "link", e.target.value)}
              fullWidth
            />
          </Box>

          <Typography variant="subtitle2">Quick links</Typography>
          <Box sx={{ display: "grid", gap: "0.75rem" }}>
            {quickLinks.map((link, linkIndex) => (
              <Box key={`quick-link-${linkIndex}`} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "0.75rem" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle2">Link {linkIndex + 1}</Typography>
                  <Button size="small" color="error" onClick={() => removeQuickLink(linkIndex)}>
                    Remove
                  </Button>
                </Box>
                <TextField
                  label="Title"
                  value={link.title}
                  onChange={(e) => updateQuickLink(linkIndex, "title", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Description"
                  value={link.description || ""}
                  onChange={(e) => updateQuickLink(linkIndex, "description", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Link URL"
                  value={link.link || ""}
                  onChange={(e) => updateQuickLink(linkIndex, "link", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}
            <Button variant="outlined" onClick={addQuickLink}>
              Add Quick Link ({quickLinkCount})
            </Button>
          </Box>

          <Typography variant="subtitle2">Quick actions panel</Typography>
          <Box sx={{ display: "grid", gap: "0.75rem" }}>
            <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
              <TextField
                label="Panel title"
                value={config.quickActions?.title || ""}
                onChange={(e) => updateQuickActionsMeta("title", e.target.value)}
                fullWidth
              />
              <TextField
                label="Panel subtitle"
                value={config.quickActions?.subtitle || ""}
                onChange={(e) => updateQuickActionsMeta("subtitle", e.target.value)}
                fullWidth
              />
            </Box>
            {quickActions.map((action, actionIndex) => (
              <Box key={`quick-action-${actionIndex}`} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "0.75rem" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle2">Action {actionIndex + 1}</Typography>
                  <Button size="small" color="error" onClick={() => removeQuickAction(actionIndex)}>
                    Remove
                  </Button>
                </Box>
                <TextField
                  label="Title"
                  value={action.title}
                  onChange={(e) => updateQuickAction(actionIndex, "title", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Description"
                  value={action.description || ""}
                  onChange={(e) => updateQuickAction(actionIndex, "description", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Link URL"
                  value={action.link || ""}
                  onChange={(e) => updateQuickAction(actionIndex, "link", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
                <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
                  <IconPicker
                    label="Icon"
                    value={action.icon || ""}
                    onChange={(value) => updateQuickAction(actionIndex, "icon", value)}
                    fullWidth
                  />
                  <FormControl fullWidth sx={{ mt: 1 }}>
                    <Select
                      value={action.tone || "neutral"}
                      onChange={(e) => updateQuickAction(actionIndex, "tone", e.target.value)}
                    >
                      <MenuItem value="neutral">Neutral</MenuItem>
                      <MenuItem value="primary">Primary</MenuItem>
                      <MenuItem value="success">Success</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            ))}
            <Button variant="outlined" onClick={addQuickAction}>
              Add Quick Action ({quickActionCount})
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

const imageEl: SxProps = {
  alignItems: "center",
  padding: "1rem",
  ".image_el": {
    alignItems: "center",
    backgroundColor: "rgba(204, 204, 204, 0.3)",
    borderRadius: "var(--border-radius)",
    cursor: "pointer",
    display: "flex",
    gap: "1rem",
    height: "100px",
    padding: "1rem",
  },
};

export default HeroSpotlightBlock;
