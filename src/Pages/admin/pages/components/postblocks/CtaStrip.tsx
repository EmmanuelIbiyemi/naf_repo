import { Box, TextField, Typography, Select, MenuItem, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import { BlockType } from "../../../../../types/blocks";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";

type CtaButton = {
  label: string;
  link: string;
};

type CtaConfig = {
  primary?: CtaButton;
  secondary?: CtaButton;
  layout?: "row" | "column";
};

const parseConfig = (content: string): CtaConfig => {
  if (!content) return {};
  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const CtaStripBlock = ({
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
  const [config, setConfig] = useState<CtaConfig>({});

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

  const handlePositionChange = (position: number, randomId: string | null | undefined) => {
    const foundBlock = page.blocks.find((block) => block.randomId === randomId);
    if (foundBlock) {
      updateBlock({ ...foundBlock, position });
    }
  };

  const syncConfig = (nextConfig: CtaConfig) => {
    setConfig(nextConfig);
    updateBlock({ ...element, content: JSON.stringify(nextConfig) });
  };

  const updatePrimary = (field: keyof CtaButton, value: string) => {
    syncConfig({
      ...config,
      primary: { ...config.primary, [field]: value } as CtaButton,
    });
  };

  const updateSecondary = (field: keyof CtaButton, value: string) => {
    syncConfig({
      ...config,
      secondary: { ...config.secondary, [field]: value } as CtaButton,
    });
  };

  const updateLayout = (value: "row" | "column") => {
    syncConfig({ ...config, layout: value });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography variant="h5">CTA Strip</Typography>
        <ActionButtons block={element} setPage={setPage} />
      </Box>
      <Box sx={{ display: "grid", gap: "0.75rem" }}>
        <TextField
          label="Heading"
          value={element.title || ""}
          onChange={(e) => updateBlock({ ...element, title: e.target.value })}
          fullWidth
        />
        <TextField
          label="Supporting text"
          value={element.caption || ""}
          onChange={(e) => updateBlock({ ...element, caption: e.target.value })}
          fullWidth
          multiline
          rows={2}
        />
        <FormControl fullWidth>
          <Select
            value={config.layout || "row"}
            onChange={(e) => updateLayout(e.target.value as "row" | "column")}
          >
            <MenuItem value="row">Buttons horizontal</MenuItem>
            <MenuItem value="column">Buttons vertical</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
          <TextField
            label="Primary button label"
            value={config.primary?.label || ""}
            onChange={(e) => updatePrimary("label", e.target.value)}
            fullWidth
          />
          <TextField
            label="Primary button link"
            value={config.primary?.link || ""}
            onChange={(e) => updatePrimary("link", e.target.value)}
            fullWidth
          />
        </Box>
        <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
          <TextField
            label="Secondary button label"
            value={config.secondary?.label || ""}
            onChange={(e) => updateSecondary("label", e.target.value)}
            fullWidth
          />
          <TextField
            label="Secondary button link"
            value={config.secondary?.link || ""}
            onChange={(e) => updateSecondary("link", e.target.value)}
            fullWidth
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CtaStripBlock;
