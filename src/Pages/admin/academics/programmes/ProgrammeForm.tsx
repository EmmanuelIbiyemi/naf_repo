import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { Programme } from "../../../../types/programmes";

type Props = {
  programme?: Programme;
  actions: {
    submit: (programme: Programme) => Promise<void>;
    cancel: () => void;
  };
};

const ProgrammeForm = ({ actions, programme }: Props) => {

  const initialValues: Programme = {
    id: programme?.id || 0,
    name: programme?.name || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: Programme) => {
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
            {programme ? "Update Programme" : "Add Programme"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr",
            }}
          >
            <Box>
              <label htmlFor="name">Programme Name</label>
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
              {programme ? "Update Programme" : "Add Programme"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProgrammeForm;
