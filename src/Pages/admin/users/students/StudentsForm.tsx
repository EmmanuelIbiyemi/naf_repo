import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Box, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import formStyles from "../../../../components/form/form.module.scss";
import { StudentCreateType, StudentType } from "../../../../types/students";
import StudentCourseSelector from "../components/courseSelector";
import { ChangeEvent } from "react";
import { useGetFacultiesQuery } from "../../../../store/api/faculties.api";
import { useGetDepartmentsMMutation } from "../../../../store/api/departments.api";
import { useGetProgrammesMMutation } from "../../../../store/api/programmes.api";
import { useGetLevelsMMutation } from "../../../../store/api/levels.api";

type Props = {
  student?: StudentType;
  actions: {
    submit: (student: StudentType) => Promise<void>;
    cancel: () => void;
  };
};

const StudentForm = ({ actions, student }: Props) => {
  const { data: faculties } = useGetFacultiesQuery(null);
  const [getDepartments, departmentsState] = useGetDepartmentsMMutation();
  const [getPrograms, programsState] = useGetProgrammesMMutation();
  const [getLevels, levelsState] = useGetLevelsMMutation();

  const initialValues: StudentCreateType & {
    faculty_id: number;
    department_id: number;
    program_id: number;
  } = {
    id: student?.id || undefined,
    first_name: student?.first_name || "",
    last_name: student?.last_name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    courses: student?.courses || [],
    address: student?.address || "",
    photo: student?.photo || "",
    faculty_id: 0,
    department_id: 0,
    program_id: 0,
    level_id: student?.level_id || 0,
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    level_id: Yup.number().required("Level is required"),
    courses: Yup.array().min(1, "At least one course is required"),
  });

  const handleSubmit = async (values: StudentCreateType) => {
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
      } else if (target.name === "program_id") {
        await getLevels(+target.value).unwrap();
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
            {student ? "Update Student" : "Add Student"}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <Box>
              <label htmlFor="first_name">First Name</label>
              <Field id="first_name" name="first_name" />
              {errors.first_name && touched.first_name && (
                <div>{errors.first_name}</div>
              )}
            </Box>
            <Box>
              <label htmlFor="last_name">Last Name</label>
              <Field id="last_name" name="last_name" />
              {errors.last_name && touched.last_name && (
                <div>{errors.last_name}</div>
              )}
            </Box>
          </Box>
          <Box>
            <label htmlFor="email">Email</label>
            <Field id="email" name="email" type="email" />
            {errors.email && touched.email && <div>{errors.email}</div>}
          </Box>
          <Box>
            <label htmlFor="phone">Phone</label>
            <Field id="phone" name="phone" />
            {errors.phone && touched.phone && <div>{errors.phone}</div>}
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
            <label htmlFor="programme">Programme</label>
            <Field
              id="programme"
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
              <option value="">select programme</option>
              {programsState.data?.data.map((pro) => (
                <option key={pro.name} value={pro.id}>
                  {pro.name}
                </option>
              ))}
            </Field>
            {errors.program_id && touched.program_id && (
              <div>{errors.program_id}</div>
            )}
          </Box>
          <Box>
            <label htmlFor="level">Level</label>
            <Field
              id="level"
              name="level_id"
              as="select"
              style={{
                width: "100%",
                padding: ".5rem",
                borderRadius: "var(--border-radius)",
              }}
            >
              <option value="">select level</option>
              {levelsState.data?.data.map((pro) => (
                <option key={pro.name} value={pro.id}>
                  {pro.name}
                </option>
              ))}
            </Field>
            {errors.level_id && touched.level_id && (
              <div>{errors.level_id}</div>
            )}
          </Box>
          <Box>
            <StudentCourseSelector name="courses" />
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
              {student ? "Update Student" : "Add Student"}
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default StudentForm;
