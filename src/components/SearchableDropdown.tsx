import React, { useState, useEffect, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import debounce from "lodash/debounce";

export interface DropdownOption {
  id: number | string;
  label: string;
  [key: string]: any;
}

interface SearchableDropdownProps {
  label: string;
  value?: DropdownOption | DropdownOption[] | null;
  onChange: (value: DropdownOption | DropdownOption[] | null) => void;
  fetchOptions: (
    searchTerm: string,
    page: number
  ) => Promise<{ data: any[]; hasMore?: boolean }>;
  getOptionLabel: (option: any) => string;
  getOptionValue: (option: any) => number | string;
  multiple?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  initialOptions?: any[];
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  value,
  onChange,
  fetchOptions,
  getOptionLabel,
  getOptionValue,
  multiple = false,
  disabled = false,
  error = false,
  helperText,
  placeholder,
  required = false,
  initialOptions = [],
}) => {
  const [options, setOptions] = useState<any[]>(initialOptions);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch options based on search term
  const loadOptions = async (searchTerm: string, pageNum: number) => {
    setLoading(true);
    try {
      const result = await fetchOptions(searchTerm, pageNum);
      const newOptions = result.data.map((item: any) => ({
        id: getOptionValue(item),
        label: getOptionLabel(item),
        ...item,
      }));

      if (pageNum === 1) {
        setOptions(newOptions);
      } else {
        setOptions((prev) => [...prev, ...newOptions]);
      }

      setHasMore(result.hasMore !== false);
    } catch (error) {
      console.error("Error loading options:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedLoadOptions = useCallback(
    debounce((searchTerm: string) => {
      setPage(1);
      loadOptions(searchTerm, 1);
    }, 500),
    [fetchOptions]
  );

  // Initial load
  useEffect(() => {
    if (initialOptions.length === 0) {
      loadOptions("", 1);
    }
  }, []);

  // Handle input change (search)
  const handleInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
    debouncedLoadOptions(newInputValue);
  };

  // Handle value change
  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: any | any[] | null
  ) => {
    onChange(newValue);
  };

  // Handle scroll to load more
  const handleScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const listboxNode = event.currentTarget;
    const position = listboxNode.scrollTop + listboxNode.clientHeight;
    const isNearBottom = listboxNode.scrollHeight - position < 50;

    if (isNearBottom && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(inputValue, nextPage);
    }
  };

  return (
    <Autocomplete
      multiple={multiple}
      disabled={disabled}
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option: DropdownOption) => option.label || ""}
      isOptionEqualToValue={(option: DropdownOption, value: DropdownOption) =>
        option.id === value.id
      }
      loading={loading}
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
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option: DropdownOption) => (
        <Box component="li" {...props} key={option.id}>
          {option.label}
        </Box>
      )}
      noOptionsText={
        loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <Typography>No options found</Typography>
        )
      }
    />
  );
};

export default SearchableDropdown;
