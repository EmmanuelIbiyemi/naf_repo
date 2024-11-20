import { Box, TextField, Select, MenuItem, Checkbox } from "@mui/material";
import { Field, FieldProps } from "formik";

const Step1Content = () => {
  return (
    <Box
      sx={{
        ">div": { marginBottom: ".5rem" },
        label: { display: "inline-block", marginBottom: ".5rem" },
      }}
    >
      <Box
        sx={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}
      >
        <Box>
          <label htmlFor="">Name</label>
          <Field name="name">
            {({ field, meta }: FieldProps) => (
              <TextField
                {...field}
                fullWidth
                error={!!meta.error && meta.touched}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Box>

        <Box>
          <label htmlFor="">Type</label>
          <Field name="type">
            {({ field }: FieldProps) => (
              <Select {...field} fullWidth>
                <MenuItem value="graded">Graded</MenuItem>
                <MenuItem value="ungraded">Ungraded</MenuItem>
              </Select>
            )}
          </Field>
        </Box>
      </Box>

      <Box>
        <label htmlFor="">Instructions</label>
        <Field name="instructions">
          {({ field, meta }: FieldProps) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={3}
              error={!!meta.error && meta.touched}
              helperText={meta.touched && meta.error}
            />
          )}
        </Field>
      </Box>

      <Box
      // sx={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}
      >
        <Box>
          <label htmlFor="">Time Allowed</label>
          <Field name="time_allowed">
            {({ field, meta }: FieldProps) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                error={!!meta.error && meta.touched}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Box>
        {/* <Box>
          <label htmlFor="">Obtainable Score</label>
          <Field name="obtainable_score">
            {({ field, meta }: FieldProps) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                error={!!meta.error && meta.touched}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Box> */}
      </Box>

      <Box
        sx={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}
      >
        <Box>
          <label htmlFor="">Start Date</label>
          <Field name="start_date">
            {({ field, meta }: FieldProps) => (
              <TextField
                {...field}
                type="date"
                fullWidth
                error={!!meta.error && meta.touched}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Box>
        <Box>
          <label htmlFor="">Expiration Date</label>
          <Field name="expiry_date">
            {({ field, meta }: FieldProps) => (
              <TextField
                {...field}
                type="date"
                fullWidth
                error={!!meta.error && meta.touched}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Field name="show_result">
          {({ field, form }: FieldProps) => (
            <Checkbox
              {...field}
              id="show_result"
              onClick={(ev) =>
                form.setFieldValue(
                  "show_result",
                  ev.currentTarget.value == "on"
                )
              }
            />
          )}
        </Field>
        <label htmlFor="show_result" style={{ margin: 0 }}>
          Show Results
        </label>
      </Box>
    </Box>
  );
};

export default Step1Content;
