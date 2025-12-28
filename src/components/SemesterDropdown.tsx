import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import debounce from "lodash/debounce";
import { useLazyGetSemestersQuery } from "../store/api/semesters.api";
import { SemesterType } from "../types/semesters";

interface SemesterDropdownProps {
  label?: string;
  value?: SemesterType | null;
  onChange: (value: SemesterType | null) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
  sessionId?: number;
}

const SemesterDropdown: React.FC<SemesterDropdownProps> = ({
  label = "Semester",
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
  placeholder = "Select a semester",
  required = false,
  name = "semester",
  sessionId,
}) => {
  const [trigger, { isFetching }] = useLazyGetSemestersQuery();
  const [options, setOptions] = useState<SemesterType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadSemesters = async (searchTerm: string, pageNum: number) => {
    try {
      const params: any = {
        page: pageNum,
        per_page: 20,
      };

      if (searchTerm) {
        params.search_term = searchTerm;
      }

      if (sessionId) {
        params.session_id = sessionId;
      }

      const result = await trigger(params).unwrap();

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
      console.error("Error loading semesters:", error);
    }
  };

  const debouncedLoadSemesters = useCallback(
    debounce((searchTerm: string) => {
      setPage(1);
      loadSemesters(searchTerm, 1);
    }, 500),
    [sessionId]
  );

  useEffect(() => {
    loadSemesters("", 1);
  }, [sessionId]);

  const handleInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
    debouncedLoadSemesters(newInputValue);
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    const isNearBottom = listboxNode.scrollHeight - position < 50;

    if (isNearBottom && hasMore && !isFetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadSemesters(inputValue, nextPage);
    }
  };

  return (
    <Autocomplete
      id={name}
      disabled={disabled}
      value={value}
      onChange={(_event, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option: SemesterType) => option.name || ""}
      isOptionEqualToValue={(option: SemesterType, value: SemesterType) =>
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
      renderOption={(props, option: SemesterType) => (
        <Box component="li" {...props} key={option.id}>
          {option.name}
        </Box>
      )}
      noOptionsText={
        isFetching ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <Typography>No semesters found</Typography>
        )
      }
    />
  );
};

export default SemesterDropdown;
