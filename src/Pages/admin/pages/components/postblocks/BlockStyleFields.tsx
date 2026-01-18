import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from "@mui/material";
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
const columnWidthOptions: Array<{ label: string; value: BlockSettings["columnWidth"] }> = [
  { label: "1/2", value: "1/2" },
  { label: "1/3", value: "1/3" },
  { label: "2/3", value: "2/3" },
  { label: "1/4", value: "1/4" },
  { label: "3/4", value: "3/4" },
];

const BlockStyleFields = ({ block, blocks, setPage }: Props) => {
  const settings = block.settings || {};
  const rowOptions = Array.from(
    new Set(
      blocks
        .map((b) => b.settings?.rowId)
        .filter((rowId): rowId is string => Boolean(rowId))
    )
  );

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

  const handleCreateRow = () => {
    const newRowId = `row-${Math.random().toString(36).slice(2, 8)}`;
    updateSettings({ layout: "row", rowId: newRowId });
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
          value={settings.layout || "stack"}
          onChange={(event) => {
            const newLayout = event.target.value as BlockSettings["layout"];
            const patch: Partial<BlockSettings> = { layout: newLayout };
            if (newLayout === "row" && !settings.rowId) {
              patch.rowId = `row-${Math.random().toString(36).slice(2, 8)}`;
            }
            updateSettings(patch);
          }}
          size="small"
        >
          <MenuItem value="stack">Stacked</MenuItem>
          <MenuItem value="row">Row (horizontal)</MenuItem>
        </Select>
      </FormControl>
      {settings.layout === "row" ? (
        <Box sx={{ display: "grid", gap: "0.75rem" }}>
          <Box sx={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr auto" }}>
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={settings.rowId || ""}
                onChange={(event) => updateSettings({ rowId: event.target.value })}
                size="small"
              >
                <MenuItem value="">Select a row</MenuItem>
                {rowOptions.map((rowId) => (
                  <MenuItem key={rowId} value={rowId}>
                    {rowId}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" size="small" onClick={handleCreateRow}>
              New Row
            </Button>
          </Box>
          <FormControl fullWidth>
            <Select
              value={settings.columnWidth || "1/2"}
              onChange={(event) =>
                updateSettings({
                  columnWidth: event.target.value as BlockSettings["columnWidth"],
                })
              }
              size="small"
            >
              {columnWidthOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : null}
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
