import React, { useState, useEffect } from 'react';
import { useField } from 'formik';
import { Autocomplete, TextField, Chip, Box, Typography } from '@mui/material';
import { CourseType } from '../../../../types/courses';
import { useGetCoursesQuery } from '../../../../store/api/courses.api';

interface StudentCourseSelectorProps {
  name: string;
}

const StudentCourseSelector: React.FC<StudentCourseSelectorProps> = ({ name }) => {
  const [field, meta, helpers] = useField(name);
  const { data: coursesData, isLoading, error } = useGetCoursesQuery(null);
  const [inputValue, setInputValue] = useState('');

  const [selectedCourses, setSelectedCourses] = useState<CourseType[]>(field.value || []);

  useEffect(() => {
    helpers.setValue(selectedCourses);
  }, [selectedCourses, helpers]);

  if (isLoading) return <Typography>Loading courses...</Typography>;
  if (error) return <Typography color="error">Error loading courses</Typography>;

  const handleCourseChange = (_event: React.SyntheticEvent, value: CourseType[]) => {
    setSelectedCourses(value);
  };

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  return (
    <Box>
      <Autocomplete
        multiple
        id={name}
        options={coursesData?.data || []}
        value={selectedCourses}
        onChange={handleCourseChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        getOptionLabel={(option: CourseType) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Courses"
            error={meta.touched && Boolean(meta.error)}
            helperText={meta.touched && meta.error}
          />
        )}
        renderTags={(value: CourseType[], getTagProps) =>
          value.map((option: CourseType, index: number) => (
            <Chip
              variant="outlined"
              label={option.name}
              {...getTagProps({ index })}
              key={option.id}
            />
          ))
        }
      />
    </Box>
  );
};

export default StudentCourseSelector;