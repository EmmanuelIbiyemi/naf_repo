import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { ChangeEvent } from "react";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";

export type Score = {
  id?: number;
  min_score: number;
  max_score: number;
  name: string;
  remark: string;
  program_id: number;
};

type Props = {
  score?: Score;
  actions: {
    submit: (score: Score) => Promise<void>;
    cancel: () => void;
  };
};

const ScoreForm = ({ actions, score }: Props) => {
  const { data: faculties } = useGetFacultiesQuery({ page: 1, per_page: 1000 });
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();

  const initialValues: Score & { faculty_id: number; department_id: number } = {
    id: score?.id || undefined,
    min_score: score?.min_score || 0,
    max_score: score?.max_score || 0,
    name: score?.name || "",
    remark: score?.remark || "",
    faculty_id: 0,
    department_id: 0,
    program_id: score?.program_id || 0,
  };

  const validationSchema = Yup.object({
    min_score: Yup.number().required("Minimum score is required"),
    max_score: Yup.number()
      .required("Maximum score is required")
      .moreThan(
        Yup.ref("min_score"),
        "Maximum score must be greater than minimum score"
      ),
    name: Yup.string().required("Name is required"),
    remark: Yup.string().required("Remark is required"),
    program_id: Yup.number().required("Program ID is required"),
  });

  const handleSubmit = async (values: Score) => {
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
        await getDepartments({
          faculty_id: +target.value,
          page: 1,
          per_page: 1000,
        }).unwrap();
      } else if (target.name === "department_id") {
        await getPrograms({
          department_id: +target.value,
          page: 1,
          per_page: 1000,
        }).unwrap();
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
      {({ isValid, dirty, errors, touched, setFieldValue }) => (
        <Form className={formStyles.modal_form}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ marginTop: "1rem", textAlign: "center" }}
          >
            {score ? "Update Score" : "Add Score"}
          </Typography>

          <Box>
            <label htmlFor="name">Name</label>
            <Field id="name" name="name" />
            {errors.name && touched.name && <div>{errors.name}</div>}
          </Box>
          <Box>
            <label htmlFor="min_score">Minimum Score</label>
            <Field id="min_score" name="min_score" type="number" />
            {errors.min_score && touched.min_score && (
              <div>{errors.min_score}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="max_score">Maximum Score</label>
            <Field id="max_score" name="max_score" type="number" />
            {errors.max_score && touched.max_score && (
              <div>{errors.max_score}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="remark">Remark</label>
            <Field id="remark" name="remark" as="textarea" />
            {errors.remark && touched.remark && <div>{errors.remark}</div>}
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
              {score ? "Update Score" : "Add Score"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ScoreForm;
