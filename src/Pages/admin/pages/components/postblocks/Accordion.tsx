import { Box, Button, FormControl, TextField, Typography } from "@mui/material";
import { BlockType } from "../../../../../types/blocks";
import { useEffect, useState } from "react";
import { PostType } from "../../../../../types/posts";
import { ActionButtons } from ".././ActionButtons";

type AccordionItem = {
  title: string;
  content: string;
};

const parseItems = (content: string): AccordionItem[] => {
  if (!content) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const AccordionBlock = ({ page, setPage, element, index }: {
  page: PostType;
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
  element: BlockType;
  index: number;
}) => {
  const [items, setItems] = useState<AccordionItem[]>([]);

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

  const syncItems = (nextItems: AccordionItem[]) => {
    setItems(nextItems);
    updateBlock({ ...element, content: JSON.stringify(nextItems) });
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

  const handleItemChange = (index: number, field: keyof AccordionItem, value: string) => {
    const nextItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    syncItems(nextItems);
  };

  const handleAddItem = () => {
    syncItems([...items, { title: "", content: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    syncItems(items.filter((_, i) => i !== index));
  };

  return (
    <Box key={`element-${element.id + index}`} className="element">
      <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <Typography variant="h5">Accordion</Typography>
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
        <Box sx={{ display: "grid", gap: "1rem" }}>
          {items.map((item, itemIndex) => (
            <Box
              key={`accordion-item-${itemIndex}`}
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
              />
              <TextField
                label="Content"
                value={item.content}
                onChange={(e) => handleItemChange(itemIndex, "content", e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddItem}>
            Add Item
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AccordionBlock;
