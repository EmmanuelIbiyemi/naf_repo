import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { FieldHelperProps, useField } from "formik";
import { Box, MenuItem } from "@mui/material";

type Props<T> = {
  name: keyof T;
  label: string;
  options: string[];
  handleChange: (
    event: SelectChangeEvent,
    helpers: FieldHelperProps<unknown>
  ) => void;
};

export default function FormikSelect<T>({
  name,
  label,
  options,
  handleChange,
}: Props<T>) {
  const [field, meta, helpers] = useField(name as string);

  return (
    <FormControl fullWidth>
      <label htmlFor={name.toString()}>{label}</label>
      <Select
        sx={{ padding: 0, ".MuiSelect-select": { padding: 0 } }}
        multiple
        name={name.toString()}
        value={field.value || []}
        onChange={(event) => handleChange(event, helpers)}
        input={<OutlinedInput id="select-multiple-chip" />}
        renderValue={(selected) => {
          return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value: string) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          );
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </FormControl>
  );
}
