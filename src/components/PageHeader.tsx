import { ArrowBack, Search } from "@mui/icons-material";
import { Box, Button, SxProps } from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch } from "../store/hooks";
import { setKeyword } from "../store/app.slice";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
  }, [location]);

  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        padding: "var(--padding)",
      }}
    >
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ paddingLeft: ".5rem" }}
        >
          <ArrowBack sx={{ marginRight: ".4rem" }} /> Back
        </Button>
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
      </Box>
      {button ? (
        <Box sx={formGroupStyles}>
          {secondaryButton ? (
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
          ) : null}
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
