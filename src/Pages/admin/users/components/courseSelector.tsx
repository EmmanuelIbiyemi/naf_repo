import React, { useEffect } from "react";
import { useField } from "formik";
import { Box } from "@mui/material";
import { CourseType } from "../../../../types/courses";
import CourseDropdown from "../../../../components/CourseDropdown";

interface StudentCourseSelectorProps {
  name: string;
}

const StudentCourseSelector: React.FC<StudentCourseSelectorProps> = ({
  name,
}) => {
  const [field, meta, helpers] = useField(name);

  useEffect(() => {
    if (!field.value) {
      helpers.setValue([]);
    }
  }, []);

  const handleCourseChange = (value: CourseType | CourseType[] | null) => {
    helpers.setValue(value || []);
  };

  return (
    <Box>
      <CourseDropdown
        name={name}
        label="Courses"
        multiple
        value={field.value || []}
        onChange={handleCourseChange}
        error={meta.touched && Boolean(meta.error)}
        helperText={meta.touched && meta.error ? String(meta.error) : ""}
      />
    </Box>
  );
};

export default StudentCourseSelector;
