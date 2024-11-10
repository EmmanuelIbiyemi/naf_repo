import { Search } from "@mui/icons-material";
import { Box, Button, SxProps } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

type Props = {
  button?: {
    text: string;
    action: () => void;
  };
  secondaryButton?: {
    text: string;
    action: () => void;
  };
};

const PageHeader = ({ button, secondaryButton }: Props) => {
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
            <Box sx={searchFieldStyles}>
              <Search />
              <Field name="keyword" placeholder="Search..." />
            </Box>
          </Box>
        </Form>
      </Formik>
      {button ? (
        <Box sx={formGroupStyles}>
          {
            secondaryButton ? (
              <Button
                onClick={secondaryButton.action}
                variant="contained"
                sx={{
                  bgcolor: "#fff",
                  color: "primary.main",
                  textTransform: "capitalize",
                }}
              >
                {secondaryButton.text}
              </Button>
            ) : null
            // <Button
            //   variant="contained"
            //   sx={{
            //     bgcolor: "#fff",
            //     color: "primary.main",
            //     textTransform: "capitalize",
            //   }}
            // >
            //   Export CSV
            // </Button>
          }
          <Button
            onClick={button.action}
            variant="contained"
            sx={{ textTransform: "capitalize" }}
          >
            {button.text}
          </Button>
        </Box>
      ) : null}
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
};
