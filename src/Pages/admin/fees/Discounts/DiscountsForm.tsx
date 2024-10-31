import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";

export type Discount = {
  id?: number;
  condition: number;
  gpa: string;
  discount_percentage: string;
  description: string;
};

type Props = {
  discount?: Discount
  actions: {
    submit: (discount: Discount) => Promise<void>;
    cancel: () => void;
  };
};

const DiscountForm = ({ actions, discount }: Props) => {

  const initialValues: Discount = {
    id: discount?.id || undefined,
    condition: discount?.condition || 0,
    gpa: discount?.gpa || "",
    discount_percentage: discount?.discount_percentage || "",
    description: discount?.description || "",
  };

  const validationSchema = Yup.object({
    condition: Yup.number().required("Condition is required"),
    gpa: Yup.string().required("GPA is required"),
    discount_percentage: Yup.string().required("Discount percentage is required"),
    description: Yup.string().required("Description is required"),
  });

  const handleSubmit = async (values: Discount) => {
    await actions.submit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, errors, touched }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {discount ? "Update Discount" : "Add Discount"}
          </Typography>
          <Box>
            <label htmlFor="condition">Condition</label>
            <Field id="condition" name="condition" type="number" />
            {errors.condition && touched.condition && <div>{errors.condition}</div>}
          </Box>
          <Box>
            <label htmlFor="gpa">GPA</label>
            <Field id="gpa" name="gpa" />
            {errors.gpa && touched.gpa && <div>{errors.gpa}</div>}
          </Box>
          <Box>
            <label htmlFor="discount_percentage">Discount Percentage</label>
            <Field id="discount_percentage" name="discount_percentage" />
            {errors.discount_percentage && touched.discount_percentage && <div>{errors.discount_percentage}</div>}
          </Box>
          <Box>
            <label htmlFor="description">Description</label>
            <Field id="description" name="description" as="textarea" />
            {errors.description && touched.description && <div>{errors.description}</div>}
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
              {discount ? "Update Discount" : "Add Discount"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default DiscountForm;