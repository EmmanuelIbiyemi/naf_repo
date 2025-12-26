import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import {
  SemesterCombinedType,
  SemesterCreateType,
  SemesterType,
} from "../../../../types/semesters";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";

type Props = {
  semester?: SemesterCombinedType;
  actions: {
    submit: (semester: SemesterCombinedType) => Promise<void>;
    cancel: () => void;
  };
};

const SemesterForm = ({ actions, semester }: Props) => {
  const { session_id } = useParams();

  const initialValues: SemesterCreateType | SemesterType = {
    id: (semester as SemesterType)?.id || 0,
    name: semester?.name || "",
    session_id: +(session_id || 0),
    end_date: semester?.end_date
      ? dayjs(semester.end_date).format("YYYY-MM-DD")
      : "",
    start_date: semester?.start_date
      ? dayjs(semester.start_date).format("YYYY-MM-DD")
      : "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    start_date: Yup.string().required("Required"),
    end_date: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: SemesterCombinedType) => {
    await actions.submit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
    >
      {({ isValid, dirty }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {semester ? "Update Semester" : "Add Semester"}
          </Typography>

          <Box>
            <label htmlFor="name">Semester Name</label>
            <Field id="name" name="name" />
          </Box>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="start_date">Start Date</label>
              <Field id="start_date" name="start_date" type="date" />
            </Box>
            <Box>
              <label htmlFor="end_date">End Date</label>
              <Field id="end_date" name="end_date" type="date" />
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
              {semester ? "Update Semester" : "Add Semester"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SemesterForm;
