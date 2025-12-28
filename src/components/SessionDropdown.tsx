import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import debounce from "lodash/debounce";
import { useLazyGetSessionsQuery } from "../store/api/sessions.api";
import { SessionType } from "../types/sessions";

interface SessionDropdownProps {
  label?: string;
  value?: SessionType | null;
  onChange: (value: SessionType | null) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  name?: string;
}

const SessionDropdown: React.FC<SessionDropdownProps> = ({
  label = "Session",
  value,
  onChange,
  disabled = false,
  error = false,
  helperText,
  placeholder = "Select a session",
  required = false,
  name = "session",
}) => {
  const [trigger, { isFetching }] = useLazyGetSessionsQuery();
  const [options, setOptions] = useState<SessionType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadSessions = async (searchTerm: string, pageNum: number) => {
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
        result.pagination ? pageNum < result.pagination.pages : false
      );
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
  };

  const debouncedLoadSessions = useCallback(
    debounce((searchTerm: string) => {
      setPage(1);
      loadSessions(searchTerm, 1);
    }, 500),
    []
  );

  useEffect(() => {
    loadSessions("", 1);
  }, []);

  const handleInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
    debouncedLoadSessions(newInputValue);
  };

  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    const isNearBottom = listboxNode.scrollHeight - position < 50;

    if (isNearBottom && hasMore && !isFetching) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadSessions(inputValue, nextPage);
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
      getOptionLabel={(option: SessionType) => option.name || ""}
      isOptionEqualToValue={(option: SessionType, value: SessionType) =>
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
      renderOption={(props, option: SessionType) => (
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
          <Typography>No sessions found</Typography>
        )
      }
    />
  );
};

export default SessionDropdown;
