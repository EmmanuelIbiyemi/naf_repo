import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { LevelType } from "../../../../types/levels";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

type Props = {
  level?: LevelType;
  actions: {
    submit: (level: LevelType) => Promise<void>;
    cancel: () => void;
  };
};

const LevelForm = ({ actions, level }: Props) => {
  const location = useLocation();

  useEffect(() => {
    console.log(location.state);
  }, [location]);

  const initialValues: LevelType = {
    id: level?.id || 0,
    name: level?.name || "",
    program_id: level?.program_id || location.state.programme_id,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    program_id: Yup.number().not([0]).required("Required"),
  });

  const handleSubmit = async (values: LevelType) => {
    if (values.id == 0) delete values.id;
    await actions.submit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {level ? "Update Level" : "Add Level"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr",
            }}
          >
            <Box>
              <label htmlFor="name">Level Name</label>
              <Field id="name" name="name" />
            </Box>
          </Box>
          <Box className={formStyles.btn_group}>
            <Button
              onClick={() => actions.cancel()}
              className={formStyles.cancel_btn}
              variant="contained"
            >
              Cancel
            </Button>
            <LoadingButton
              className={formStyles.submit_btn}
              type="submit"
              variant="contained"
              disabled={!(isValid && dirty)}
            >
              {level ? "Update Level" : "Add Level"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default LevelForm;
