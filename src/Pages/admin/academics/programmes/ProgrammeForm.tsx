import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { Programme } from "../../../../types/programmes";
import { useParams } from "react-router-dom";

type Props = {
  programme?: Programme;
  actions: {
    submit: (programme: Programme) => Promise<void>;
    cancel: () => void;
  };
};

const ProgrammeForm = ({ actions, programme }: Props) => {
  const { department_id } = useParams();

  const initialValues: Programme = {
    id: programme?.id || 0,
    name: programme?.name || "",
    department_id: +(department_id || 0),
    department: undefined
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    department_id: Yup.number()
      .required("Required")
      .notOneOf([0], "Department ID cannot be 0"),
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
