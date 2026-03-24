import { ArrowBack, Search } from "@mui/icons-material";
import { Box, Button, SxProps } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../store/hooks";
import { setKeyword } from "../store/app.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

type ButtonType = {
  text: string;
  action: () => void;
  disabled?: boolean;
};

type Props = {
  button?: ButtonType;
  secondaryButton?: ButtonType;
  tertiaryButton?: ButtonType;
};

const PageHeader = ({ button, secondaryButton, tertiaryButton }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = {
    keyword: "",
  };

  const validationSchema = Yup.object({});

  const handleSubmit = async (value: typeof initialValues) => {
    dispatch(setKeyword(value.keyword));
  };

  useEffect(() => {
    dispatch(setKeyword("")); // clear search field on page change
  }, [location, dispatch]);

  return (
    <Box
      sx={{
        alignItems: { xs: "stretch", lg: "center" },
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        gap: "1rem",
        justifyContent: "space-between",
        padding: "var(--padding)",
      }}
    >
      <Box sx={headerPrimaryStyles}>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ paddingLeft: ".5rem", flexShrink: 0, whiteSpace: "nowrap" }}
        >
          <ArrowBack sx={{ marginRight: ".4rem" }} /> Back
        </Button>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Box sx={searchFormStyles}>
              <Box sx={searchFieldStyles}>
                <Search />
                <Field name="keyword" placeholder="Search..." />
              </Box>
            </Box>
          </Form>
        </Formik>
      </Box>
      {button ? (
        <Box sx={actionGroupStyles}>
          {tertiaryButton ? (
            <Button
              onClick={tertiaryButton.action}
              variant="contained"
              sx={secondaryButtonStyles}
              disabled={tertiaryButton.disabled}
            >
              {tertiaryButton.text}
            </Button>
          ) : null}
          {secondaryButton ? (
            <Button
              onClick={secondaryButton.action}
              variant="contained"
              sx={secondaryButtonStyles}
              disabled={secondaryButton.disabled}
            >
              {secondaryButton.text}
            </Button>
          ) : null}
          <Button
            onClick={button.action}
            variant="contained"
            sx={primaryButtonStyles}
            disabled={button.disabled}
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
  display: "flex",
  minWidth: 0,
  paddingInline: ".8rem",
  input: {
    minWidth: 0,
    outline: "none",
    width: "100%",
  },
};

const formGroupStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  gap: "1rem",
};

const headerPrimaryStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  flex: 1,
  flexWrap: { xs: "wrap", lg: "nowrap" },
  gap: "1rem",
  minWidth: 0,
};

const searchFormStyles: SxProps = {
  ...formGroupStyles,
  flex: 1,
  minWidth: { xs: "100%", md: 0 },
};

const actionGroupStyles: SxProps = {
  alignItems: "center",
  display: "flex",
  flexShrink: 0,
  flexWrap: "wrap",
  gap: "0.75rem",
  justifyContent: { xs: "flex-start", lg: "flex-end" },
};

const secondaryButtonStyles: SxProps = {
  bgcolor: "#fff",
  color: "primary.main",
  minHeight: 48,
  minWidth: 150,
  px: 2.5,
  textTransform: "capitalize",
  whiteSpace: "nowrap",
};

const primaryButtonStyles: SxProps = {
  minHeight: 48,
  minWidth: 150,
  px: 2.5,
  textTransform: "capitalize",
  whiteSpace: "nowrap",
};
