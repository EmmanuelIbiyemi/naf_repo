import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import debounce from "lodash/debounce";
import { useLazyGetCoursesQuery } from "../store/api/courses.api";
import { CourseType } from "../types/courses";

interface CourseDropdownProps {
  label?: string;
  value?: CourseType | CourseType[] | null;
  onChange: (value: CourseType | CourseType[] | null) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  name?: string;
  semester?: string;
}

const CourseDropdown: React.FC<CourseDropdownProps> = ({
  label = "Course",
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
  placeholder = "Select a course",
  required = false,
  multiple = false,
  name = "course",
  semester,
}) => {
  const [trigger, { isFetching }] = useLazyGetCoursesQuery();
  const [options, setOptions] = useState<CourseType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadCourses = async (searchTerm: string, pageNum: number) => {
    try {
      const params: any = {
        page: pageNum,
        per_page: 20,
      };
      
      if (searchTerm) {
        params.name = searchTerm;
      }
      
      if (semester) {
        params.semester = semester;
      }

      const result = await trigger(params).unwrap();

      const newOptions = result.data || [];

      if (pageNum === 1) {
        setOptions(newOptions);
      } else {
        setOptions((prev) => [...prev, ...newOptions]);
      }

      setHasMore(
        result.pagination ? pageNum < result.pagination.pages : false
      );
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const debouncedLoadCourses = useCallback(
    debounce((searchTerm: string) => {
      setPage(1);
      loadCourses(searchTerm, 1);
    }, 500),
    [semester]
  );

  useEffect(() => {
    loadCourses("", 1);
  }, [semester]);

  const handleInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
    debouncedLoadCourses(newInputValue);
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    const isNearBottom = listboxNode.scrollHeight - position < 50;

    if (isNearBottom && hasMore && !isFetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadCourses(inputValue, nextPage);
    }
  };

  return (
    <Autocomplete
      multiple={multiple}
      id={name}
      disabled={disabled}
      value={value}
      onChange={(_event, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option: CourseType) => `${option.code} - ${option.name}` || ""}
      isOptionEqualToValue={(option: CourseType, value: CourseType) =>
        option.id === value.id
      }
      loading={isFetching}
      ListboxProps={{
        onScroll: handleScroll,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isFetching ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option: CourseType) => (
        <Box component="li" {...props} key={option.id}>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {option.code}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.name}
            </Typography>
          </Box>
        </Box>
      )}
      renderTags={
        multiple
          ? (value: CourseType[], getTagProps) =>
              value.map((option: CourseType, index: number) => (
                <Chip
                  variant="outlined"
                  label={option.code}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
          : undefined
      }
      noOptionsText={
        isFetching ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <Typography>No courses found</Typography>
        )
      }
    />
  );
};

export default CourseDropdown;
