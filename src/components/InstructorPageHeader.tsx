import { Box, Button, SxProps, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";

type Props = {
  button?: {
    text: string;
    action: () => void;
    heading: string;
    subHeading: string;
  };
  additionalButton?: {
    text: string;
    action: () => void;
    heading: string;
    subHeading: string;
  };
};

const InstructorPageHeader = ({ button, additionalButton }: Props) => {
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
            {/* <Box sx={fieldStyles}>
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
            </Box> */}
            {button || additionalButton ? (
              <Box>
                <Typography variant="h4" sx={{ fontSize: "1.4rem" }}>
                  {button?.heading || additionalButton?.heading}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {button?.subHeading || additionalButton?.subHeading}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Form>
      </Formik>
      {button ? (
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
          <Button
            onClick={button.action}
            variant="contained"
            sx={{ textTransform: "capitalize" }}
          >
            {button.text}
          </Button>
        </Box>
      ) : null}
      {additionalButton ? (
        <Box sx={formGroupStyles}>
          <Button
            onClick={additionalButton.action}
            variant="contained"
            sx={{ textTransform: "capitalize" }}
          >
            {additionalButton.text}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
};

export default InstructorPageHeader;

// const fieldStyles: SxProps = {
//   bgcolor: "#fff",
//   border: "1px solid rgba(204, 204, 204, 0.6)",
//   display: "inline-flex",

//   "input, select": {
//     border: "none",
//     borderRadius: "var(--border-radius)",
//     padding: ".8rem",
//   },

//   "select, svg": {
//     color: "rgba(138, 138, 138, 1)",
//   },
// };

// const searchFieldStyles: SxProps = {
//   ...fieldStyles,
//   alignItems: "center",
//   paddingInline: ".8rem",

//   input: {
//     outline: "none",
//     width: "400px",
//   },
// };

const formGroupStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  gap: "1rem",
};
