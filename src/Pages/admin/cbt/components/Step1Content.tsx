import { Box, TextField, Checkbox, SxProps } from "@mui/material";
import { Field, FieldProps, useFormikContext } from "formik";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { CreateQuiz2 } from "../../../../types/quizzes";

const Step1Content = () => {
  const form = useFormikContext<CreateQuiz2>();
  const getPickerValue = (value?: string) => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  };
  return (
    <Box sx={containerStyles}>
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
        <label htmlFor="">Instructions</label>
        <Field name="instructions">
          {({ field, meta }: FieldProps) => (
            <TextField
              {...field}
              fullWidth
              multiline
              rows={2}
              error={!!meta.error && meta.touched}
              helperText={meta.touched && meta.error}
            />
          )}
        </Field>
      </Box>

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

      <Box
        sx={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box>
            <label htmlFor="start_date">Start Date</label>
            <DateTimePicker
              sx={{ width: "100%" }}
              value={getPickerValue(form?.values.start_date)}
              onChange={(value) =>
                form.setFieldValue("start_date", value ? value.toISOString() : "")
              }
            />
          </Box>
          <Box>
            <label htmlFor="expiry_date">End Date</label>
            <DateTimePicker
              sx={{ width: "100%" }}
              value={getPickerValue(form?.values.expiry_date)}
              onChange={(value) =>
                form.setFieldValue(
                  "expiry_date",
                  value ? value.toISOString() : ""
                )
              }
            />
          </Box>
        </LocalizationProvider>
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

const containerStyles: SxProps = {
  display: "grid",
  gap: "1rem",
  ">div": { marginBottom: ".5rem" },
  label: { display: "inline-block", marginBottom: ".5rem" },
  input: { padding: "0.5rem 1rem" },
};
