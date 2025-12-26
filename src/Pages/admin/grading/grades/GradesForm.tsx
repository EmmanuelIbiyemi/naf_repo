import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { ChangeEvent, useEffect } from "react";

export type Grade = {
  id?: number;
  point: number;
  min_point?: number | null;
  max_point?: number | null;
  remark?: string | null;
  name: string;
  program_id: number;
};

type Props = {
  grade?: Grade;
  defaults?: {
    faculty_id: number;
    department_id: number;
    program_id: number;
  };
  actions: {
    submit: (grade: Grade) => Promise<void>;
    cancel: () => void;
  };
};

const GradeForm = ({ actions, grade, defaults }: Props) => {
  const { data: faculties } = useGetFacultiesQuery({
    page: 1,
    per_page: 1000,
  });
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const initialFacultyId = defaults?.faculty_id ?? 0;
  const initialDepartmentId = defaults?.department_id ?? 0;
  const initialProgramId = grade?.program_id ?? defaults?.program_id ?? 0;

  const initialValues: Grade & { faculty_id: number; department_id: number } = {
    id: grade?.id || undefined,
    name: grade?.name || "",
    point: grade?.point || 0,
    min_point: grade?.min_point ?? null,
    max_point: grade?.max_point ?? null,
    remark: grade?.remark ?? "",
    faculty_id: initialFacultyId,
    department_id: initialDepartmentId,
    program_id: initialProgramId,
  };

  useEffect(() => {
    const loadDefaults = async () => {
      try {
        if (initialFacultyId) {
          await getDepartments({
            faculty_id: initialFacultyId,
            page: 1,
            per_page: 1000,
          }).unwrap();
        }
        if (initialDepartmentId) {
          await getPrograms({
            department_id: initialDepartmentId,
            page: 1,
            per_page: 1000,
          }).unwrap();
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadDefaults();
  }, [
    getDepartments,
    getPrograms,
    initialDepartmentId,
    initialFacultyId,
  ]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    point: Yup.number()
      .required("Point is required")
      .min(0, "Point must be a positive number"),
    min_point: Yup.number()
      .nullable()
      .min(0, "Min point must be a positive number"),
    max_point: Yup.number()
      .nullable()
      .when("min_point", (min_point: number, schema: any) =>
        min_point !== null && min_point !== undefined
          ? schema.min(min_point, "Max point must be greater than or equal to min point")
          : schema
      ),
    remark: Yup.string().nullable(),
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
      enableReinitialize
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
            <label htmlFor="min_point">Min Point (optional)</label>
            <Field id="min_point" name="min_point" type="number" />
            {errors.min_point && touched.min_point && <div>{errors.min_point}</div>}
          </Box>
          <Box>
            <label htmlFor="max_point">Max Point (optional)</label>
            <Field id="max_point" name="max_point" type="number" />
            {errors.max_point && touched.max_point && <div>{errors.max_point}</div>}
          </Box>
          <Box>
            <label htmlFor="point">Point</label>
            <Field id="point" name="point" type="number" />
            {errors.point && touched.point && <div>{errors.point}</div>}
          </Box>
          <Box>
            <label htmlFor="remark">Remark (optional)</label>
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
              <option value={0}>select faculty</option>
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
              <option value={0}>select department</option>
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
              <option value={0}>select program</option>
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
