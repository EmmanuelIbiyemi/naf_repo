import { Search } from "@mui/icons-material";
import { Box, Button, SxProps } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

const PageHeader = () => {
  const initialValues = {
    filter: "",
    keyword: "",
  };

  const validationSchema = Yup.object({
    filter: Yup.string().optional(),
    keyword: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: unknown) => {
    console.log(values);
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        padding: "var(--padding)",
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Box sx={formGroupStyles}>
            <Box sx={fieldStyles}>
              <Field as="select" name="filter">
                <option value="">Add filter</option>
                <option value="1">option</option>
                <option value="2">option</option>
                <option value="3">option</option>
              </Field>
            </Box>
            <Box sx={searchFieldStyles}>
              <Search />
              <Field name="keyword" placeholder="Search..." />
            </Box>
          </Box>
        </Form>
      </Formik>
      <Box sx={formGroupStyles}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#fff",
            color: "primary.main",
            textTransform: "capitalize",
          }}
        >
          Export CSV
        </Button>
        <Button variant="contained" sx={{ textTransform: "capitalize" }}>
          Add Courses
        </Button>
      </Box>
    </Box>
  );
};

export default PageHeader;

const fieldStyles: SxProps = {
  bgcolor: "#fff",
  border: "1px solid rgba(204, 204, 204, 0.6)",
  display: "inline-flex",

  "input, select": {
    border: "none",
    borderRadius: "var(--border-radius)",
    padding: ".8rem",
  },

  "select, svg": {
    color: "rgba(138, 138, 138, 1)",
  },
};

const searchFieldStyles: SxProps = {
  ...fieldStyles,
  alignItems: "center",
  paddingInline: ".8rem",

  input: {
    outline: "none",
    width: "400px",
  },
};

const formGroupStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  gap: "1rem",

  button: {
    border: "1px solid rgba(204, 204, 204, 0.6)",
    boxShadow: "none",
    padding: ".6rem 2rem",
  },
};
