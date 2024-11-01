import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { ChangeEvent } from "react";

export type Grade = {
  id?: number;
  point: number;
  name: string;
  program_id: number;
};

type Props = {
  grade?: Grade;
  actions: {
    submit: (grade: Grade) => Promise<void>;
    cancel: () => void;
  };
};

const GradeForm = ({ actions, grade }: Props) => {
  const { data: faculties } = useGetFacultiesQuery(null);
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();

  const initialValues: Grade & { faculty_id: number; department_id: number } = {
    id: grade?.id || undefined,
    name: grade?.name || "",
    point: grade?.point || 0,
    faculty_id: 0,
    department_id: 0,
    program_id: grade?.program_id || 0,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    point: Yup.number()
      .required("Point is required")
      .min(0, "Point must be a positive number"),
    program_id: Yup.number()
      .required("Program ID is required")
      .positive("Program ID must be a positive number"),
  });

  const handleSubmit = async (values: Grade) => {
    await actions.submit(values);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: number,
      shouldValidate?: boolean
    ) => void
  ) => {
    const { target } = e;

    setFieldValue(target.name, +target.value);
    try {
      if (target.name === "faculty_id") {
        await getDepartments(+target.value).unwrap();
      } else if (target.name === "department_id") {
        await getPrograms(+target.value).unwrap();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid, dirty, errors, setFieldValue, touched }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {grade ? "Update Grade" : "Add Grade"}
          </Typography>
          <Box>
            <label htmlFor="name">Name</label>
            <Field id="name" name="name" />
            {errors.name && touched.name && <div>{errors.name}</div>}
          </Box>
          <Box>
            <label htmlFor="point">Point</label>
            <Field id="point" name="point" type="number" />
            {errors.point && touched.point && <div>{errors.point}</div>}
          </Box>
          <Box>
            <label htmlFor="faculty">Faculty</label>
            <Field
              id="faculty"
              name="faculty_id"
              as="select"
              style={{
                width: "100%",
                padding: ".5rem",
                borderRadius: "var(--border-radius)",
              }}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                handleChange(ev, setFieldValue)
              }
            >
              <option value="">select faculty</option>
              {faculties?.data.map((fac) => (
                <option key={fac.name} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </Field>
            {errors.faculty_id && touched.faculty_id && (
              <div>{errors.faculty_id}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="department">Department</label>
            <Field
              id="department"
              name="department_id"
              as="select"
              style={{
                width: "100%",
                padding: ".5rem",
                borderRadius: "var(--border-radius)",
              }}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                handleChange(ev, setFieldValue)
              }
            >
              <option value="">select department</option>
              {departmentsState.data?.data.map((dep, i) => (
                <option key={dep.name + i} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </Field>
            {errors.department_id && touched.department_id && (
              <div>{errors.department_id}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="program">Program</label>
            <Field
              id="program"
              name="program_id"
              as="select"
              style={{
                width: "100%",
                padding: ".5rem",
                borderRadius: "var(--border-radius)",
              }}
              onChange={(ev: ChangeEvent<HTMLInputElement>) =>
                handleChange(ev, setFieldValue)
              }
            >
              <option value="">select program</option>
              {programsState.data?.data.map((dep, i) => (
                <option key={dep.name + i} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </Field>
            {errors.program_id && touched.program_id && (
              <div>{errors.program_id}</div>
            )}
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
              {grade ? "Update Grade" : "Add Grade"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default GradeForm;
