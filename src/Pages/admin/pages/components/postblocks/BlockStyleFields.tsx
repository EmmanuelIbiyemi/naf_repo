import { Box, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
import { BlockSettings, BlockType } from "../../../../../types/blocks";
import { PostType } from "../../../../../types/posts";

type Props = {
  block: BlockType;
  blocks: BlockType[];
  setPage: React.Dispatch<React.SetStateAction<PostType>>;
};

const widthOptions: Array<{ label: string; value: BlockSettings["contentWidth"] }> = [
  { label: "Narrow", value: "narrow" },
  { label: "Default", value: "default" },
  { label: "Wide", value: "wide" },
  { label: "Full", value: "full" },
];

const backgroundPalette = ["#0b1f38", "#0f172a", "#111827", "#f8fafc", "#ffffff", "#d8a92a"];
const textPalette = ["#ffffff", "#e2e8f0", "#f8fafc", "#0f172a", "#0b1f38", "#111827"];
const BlockStyleFields = ({ block, blocks, setPage }: Props) => {
  const settings = block.settings || {};

  const updateSettings = (patch: Partial<BlockSettings>) => {
    setPage((prev) => {
      if (!prev) return prev;
      const updatedBlocks = prev.blocks.map((b) =>
        b.randomId === block.randomId
          ? { ...b, settings: { ...(b.settings || {}), ...patch } }
          : b
      );

      return { ...prev, blocks: updatedBlocks };
    });
  };

  const handleNumberChange = (key: keyof BlockSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsed = value === "" ? undefined : Number(value);
    updateSettings({ [key]: Number.isFinite(parsed) ? parsed : undefined } as Partial<BlockSettings>);
  };

  return (
    <Box
      sx={{
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
        display: "grid",
        gap: "0.75rem",
        marginTop: "1rem",
        paddingTop: "1rem",
      }}
    >
      <Typography variant="subtitle2">Appearance</Typography>
      <FormControl fullWidth>
        <Select
          value={settings.containerStyle || "normal"}
          onChange={(event) => {
            const nextStyle = event.target.value as BlockSettings["containerStyle"];
            updateSettings({ containerStyle: nextStyle });
          }}
          size="small"
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="card">Card</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <Select
          value={settings.contentWidth || "default"}
          onChange={(event) =>
            updateSettings({ contentWidth: event.target.value as BlockSettings["contentWidth"] })
          }
          size="small"
        >
          {widthOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ColorPickerRow
        label="Background"
        value={settings.backgroundColor || ""}
        placeholder="#0b1f38"
        palette={backgroundPalette}
        onChange={(value) => updateSettings({ backgroundColor: value })}
      />
      <ColorPickerRow
        label="Text color"
        value={settings.textColor || ""}
        placeholder="#ffffff"
        palette={textPalette}
        onChange={(value) => updateSettings({ textColor: value })}
      />
      <FormControl fullWidth>
        <Select
          value={settings.textAlign || "left"}
          onChange={(event) =>
            updateSettings({ textAlign: event.target.value as BlockSettings["textAlign"] })
          }
          size="small"
        >
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="right">Right</MenuItem>
        </Select>
      </FormControl>
      <Box sx={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "1fr 1fr" }}>
        <TextField
          label="Padding top (rem)"
          size="small"
          type="number"
          inputProps={{ min: 0 }}
          value={settings.paddingTop ?? ""}
          onChange={handleNumberChange("paddingTop")}
        />
        <TextField
          label="Padding bottom (rem)"
          size="small"
          type="number"
          inputProps={{ min: 0 }}
          value={settings.paddingBottom ?? ""}
          onChange={handleNumberChange("paddingBottom")}
        />
      </Box>
    </Box>
  );
};

export default BlockStyleFields;

type ColorPickerRowProps = {
  label: string;
  value: string;
  placeholder: string;
  palette: string[];
  onChange: (value: string) => void;
};

const ColorPickerRow = ({ label, value, placeholder, palette, onChange }: ColorPickerRowProps) => {
  return (
    <Box sx={{ display: "grid", gap: "0.5rem" }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box sx={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr auto" }}>
        <TextField
          size="small"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Box
          sx={{
            alignItems: "center",
            display: "grid",
            gridAutoFlow: "column",
            gap: "0.35rem",
          }}
        >
          {palette.map((color) => (
            <Box
              key={color}
              role="button"
              aria-label={`${label} ${color}`}
              onClick={() => onChange(color)}
              sx={{
                backgroundColor: color,
                border: "1px solid rgba(0, 0, 0, 0.12)",
                borderRadius: "6px",
                cursor: "pointer",
                height: "26px",
                width: "26px",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
