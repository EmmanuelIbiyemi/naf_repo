import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { BlockType } from "../../../../../types/blocks";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";

type CalloutItem = {
  label: string;
  value: string;
  icon?: string;
};

type CalloutButton = {
  label: string;
  link: string;
  variant?: "filled" | "outlined";
};

type CalloutConfig = {
  items?: CalloutItem[];
  buttons?: CalloutButton[];
};

const parseConfig = (content: string): CalloutConfig => {
  if (!content) return {};
  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const CalloutPanelBlock = ({
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
  const [config, setConfig] = useState<CalloutConfig>({});

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

  const syncConfig = (nextConfig: CalloutConfig) => {
    setConfig(nextConfig);
    updateBlock({ ...element, content: JSON.stringify(nextConfig) });
  };

  const items = config.items || [];
  const buttons = config.buttons || [];

  const addItem = () => {
    syncConfig({
      ...config,
      items: [...items, { label: "", value: "", icon: "" }],
    });
  };

  const addButton = () => {
    syncConfig({
      ...config,
      buttons: [...buttons, { label: "", link: "", variant: "filled" }],
    });
  };

  const updateItem = (index: number, field: keyof CalloutItem, value: string) => {
    const nextItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    syncConfig({ ...config, items: nextItems });
  };

  const updateButton = (index: number, field: keyof CalloutButton, value: string) => {
    const nextButtons = buttons.map((button, i) =>
      i === index ? { ...button, [field]: value } : button
    );
    syncConfig({ ...config, buttons: nextButtons });
  };

  const removeItem = (index: number) => {
    syncConfig({ ...config, items: items.filter((_, i) => i !== index) });
  };

  const removeButton = (index: number) => {
    syncConfig({ ...config, buttons: buttons.filter((_, i) => i !== index) });
  };

  const itemCount = useMemo(() => items.length, [items]);
  const buttonCount = useMemo(() => buttons.length, [buttons]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography variant="h5">Callout Panel</Typography>
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

        <Box sx={{ display: "grid", gap: "0.75rem" }}>
          {items.map((item, itemIndex) => (
            <Box
              key={`callout-item-${itemIndex}`}
              sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "0.75rem" }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2">Item {itemIndex + 1}</Typography>
                <Button size="small" color="error" onClick={() => removeItem(itemIndex)}>
                  Remove
                </Button>
              </Box>
              <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
                <TextField
                  label="Label"
                  value={item.label}
                  onChange={(e) => updateItem(itemIndex, "label", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Value"
                  value={item.value}
                  onChange={(e) => updateItem(itemIndex, "value", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Box>
              <TextField
                label="Icon (emoji or short text)"
                value={item.icon || ""}
                onChange={(e) => updateItem(itemIndex, "icon", e.target.value)}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={addItem}>
            Add Item ({itemCount})
          </Button>
        </Box>

        <Box sx={{ display: "grid", gap: "0.75rem" }}>
          {buttons.map((button, buttonIndex) => (
            <Box
              key={`callout-button-${buttonIndex}`}
              sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "0.75rem" }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2">Button {buttonIndex + 1}</Typography>
                <Button size="small" color="error" onClick={() => removeButton(buttonIndex)}>
                  Remove
                </Button>
              </Box>
              <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
                <TextField
                  label="Label"
                  value={button.label}
                  onChange={(e) => updateButton(buttonIndex, "label", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Link"
                  value={button.link}
                  onChange={(e) => updateButton(buttonIndex, "link", e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              </Box>
              <TextField
                label="Variant (filled or outlined)"
                value={button.variant || "filled"}
                onChange={(e) => updateButton(buttonIndex, "variant", e.target.value)}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={addButton}>
            Add Button ({buttonCount})
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CalloutPanelBlock;
