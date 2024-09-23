import { Box, TextField, Typography } from "@mui/material";
import { ErrorMessage, useFormikContext } from "formik";
import { SelectHTMLAttributes } from "react";

type Props<T> = {
  name: keyof T;
  label: string;
  type?: string;
  placeholder?: string;
} & SelectHTMLAttributes<HTMLInputElement>;

export const FormikTextField = <T,>({ label, name, type }: Props<T>) => {
  const formik = useFormikContext<T>();
  return (
    <Box sx={textFieldStyles}>
      <TextField
        fullWidth
        id={`form-id-${name}`}
        name={name}
        label={label}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && Boolean(formik.errors[name] || "")}
        type={type}
        helperText={formik.touched[name] && formik.errors[name]?.toString()}
      />
      <Typography sx={errorMsgStyles}>
        <ErrorMessage name="name" component="div" />
      </Typography>
    </Box>
  );
};

const textFieldStyles = {
  width: "100%",
  input: {
    borderRadius: "var(--border-radius)",
    border: "2px solid #dfeaf2",
    padding: "0.8rem 1rem",
    width: "inherit",
  },
};

const errorMsgStyles = {
  color: "red",
};
