import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import { BlockType } from "../../../../../types/blocks";
import { useEffect, useMemo, useState } from "react";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";

type FeatureItem = {
  title: string;
  description: string;
  icon?: string;
};

const parseItems = (content: string): FeatureItem[] => {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const FeatureGridBlock = ({ page, setPage, element, index }: {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
}) => {
  const [items, setItems] = useState<FeatureItem[]>([]);

  useEffect(() => {
    setItems(parseItems(element.content));
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

  const syncItems = (nextItems: FeatureItem[]) => {
    setItems(nextItems);
    const newBlock: BlockType = {
      ...element,
      content: JSON.stringify(nextItems),
    };
    updateBlock(newBlock);
  };

  const handlePositionChange = (
    position: number,
    randomId: string | null | undefined
  ) => {
    const foundBlock = page.blocks.find((block) => block.randomId === randomId);
    if (foundBlock) {
      updateBlock({ ...foundBlock, position });
    }
  };

  const handleTitleChange = (value: string) => {
    updateBlock({ ...element, title: value });
  };

  const handleCaptionChange = (value: string) => {
    updateBlock({ ...element, caption: value });
  };

  const handleItemChange = (index: number, field: keyof FeatureItem, value: string) => {
    const nextItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    syncItems(nextItems);
  };

  const handleAddItem = () => {
    syncItems([...items, { title: "", description: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    syncItems(items.filter((_, i) => i !== index));
  };

  const itemCount = useMemo(() => items.length, [items]);

  return (
    <Box key={`element-${element.id + index}`} className="element">
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography variant="h5">Feature Grid</Typography>
        <ActionButtons block={element} setPage={setPage} />
      </Box>
      <Box sx={{ display: "grid", gap: "1rem" }}>
        <FormControl fullWidth>
          <TextField
            label="Section heading"
            defaultValue={element.title}
            onBlur={(e) => handleTitleChange(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Intro text"
            defaultValue={element.caption}
            onBlur={(e) => handleCaptionChange(e.target.value)}
            multiline
            rows={2}
          />
        </FormControl>
        <Box sx={{ display: "grid", gap: "1rem" }}>
          {items.map((item, itemIndex) => (
            <Box
              key={`feature-item-${itemIndex}`}
              sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", padding: "0.75rem" }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="subtitle2">Item {itemIndex + 1}</Typography>
                <Button size="small" color="error" onClick={() => handleRemoveItem(itemIndex)}>
                  Remove
                </Button>
              </Box>
              <TextField
                label="Title"
                value={item.title}
                onChange={(e) => handleItemChange(itemIndex, "title", e.target.value)}
                fullWidth
                sx={{ mt: 1 }}
                inputProps={{ maxLength: 60 }}
                helperText={`${item.title.length}/60 characters`}
              />
              <TextField
                label="Icon (emoji or short text)"
                value={item.icon || ""}
                onChange={(e) => handleItemChange(itemIndex, "icon", e.target.value)}
                fullWidth
                sx={{ mt: 1 }}
              />
              <TextField
                label="Description"
                value={item.description}
                onChange={(e) => handleItemChange(itemIndex, "description", e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 1 }}
                inputProps={{ maxLength: 150 }}
                helperText={`${item.description.length}/150 characters (approximately 3 lines)`}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddItem}>
            Add Feature ({itemCount})
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FeatureGridBlock;
