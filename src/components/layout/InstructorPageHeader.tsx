import { Box, Button, SxProps, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";

type Props = {
  heading?: string;
  subHeading?: string;
  button?: {
    text: string;
    action: () => void;
  };
  additionalButton?: {
    text: string;
    action: () => void;
    isLoading?: boolean;
  };
};

const InstructorPageHeader = ({
  button,
  additionalButton,
  heading,
  subHeading,
}: Props) => {
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
            {heading && subHeading ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h4" sx={{ fontSize: "1.4rem" }}>
                  {heading}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  {subHeading}
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Form>
      </Formik>
      <Box sx={formGroupStyles}>
        {button ? (
          <Button
            onClick={button.action}
            variant="contained"
            sx={{
              bgcolor: "#fff",
              color: "primary.main",
              textTransform: "capitalize",
            }}
          >
            {button.text}
          </Button>
        ) : null}
        {additionalButton ? (
          <Box sx={formGroupStyles}>
            <Button
              onClick={additionalButton.action}
              variant="contained"
              sx={{ textTransform: "capitalize" }}
              disabled={additionalButton?.isLoading ?? false}
            >
              {additionalButton.text}
            </Button>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default InstructorPageHeader;

const formGroupStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  gap: 2,
};
