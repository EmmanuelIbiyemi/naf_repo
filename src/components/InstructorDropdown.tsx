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
import { useLazyGetInstructorsQuery } from "../store/api/instructors.api";
import { InstructorType } from "../types/instructors";

interface InstructorDropdownProps {
  label?: string;
  value?: InstructorType | InstructorType[] | null;
  onChange: (value: InstructorType | InstructorType[] | null) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  multiple?: boolean;
  name?: string;
}

const InstructorDropdown: React.FC<InstructorDropdownProps> = ({
  label = "Instructor",
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
  placeholder = "Select an instructor",
  required = false,
  multiple = false,
  name = "instructor",
}) => {
  const [trigger, { isFetching }] = useLazyGetInstructorsQuery();
  const [options, setOptions] = useState<InstructorType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadInstructors = async (searchTerm: string, pageNum: number) => {
    try {
      const result = await trigger({
        search_term: searchTerm,
        page: pageNum,
        per_page: 20,
      }).unwrap();

      const newOptions = result.data || [];

      if (pageNum === 1) {
        setOptions(newOptions);
      } else {
        setOptions((prev) => [...prev, ...newOptions]);
      }

      setHasMore(
        (result as any).pagination ? pageNum < (result as any).pagination.pages : false
      );
    } catch (error) {
      console.error("Error loading instructors:", error);
    }
  };

  const debouncedLoadInstructors = useCallback(
    debounce((searchTerm: string) => {
      setPage(1);
      loadInstructors(searchTerm, 1);
    }, 500),
    []
  );

  useEffect(() => {
    loadInstructors("", 1);
  }, []);

  const handleInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
    debouncedLoadInstructors(newInputValue);
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    const isNearBottom = listboxNode.scrollHeight - position < 50;

    if (isNearBottom && hasMore && !isFetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadInstructors(inputValue, nextPage);
    }
  };

  const getInstructorLabel = (instructor: InstructorType) => {
    return `${instructor.first_name} ${instructor.last_name}`;
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
      getOptionLabel={getInstructorLabel}
      isOptionEqualToValue={(option: InstructorType, value: InstructorType) =>
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
      renderOption={(props, option: InstructorType) => (
        <Box component="li" {...props} key={option.id}>
          <Box>
            <Typography variant="body2">
              {getInstructorLabel(option)}
            </Typography>
            {option.email && (
              <Typography variant="caption" color="text.secondary">
                {option.email}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      renderTags={
        multiple
          ? (value: InstructorType[], getTagProps) =>
              value.map((option: InstructorType, index: number) => (
                <Chip
                  variant="outlined"
                  label={getInstructorLabel(option)}
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
          <Typography>No instructors found</Typography>
        )
      }
    />
  );
};

export default InstructorDropdown;
