import React from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { Level } from '../../../../types/levels';
import { useGetLevelsQuery } from '../../../../store/api/levels.api';

interface LevelSelectorProps {
  value: string | null;
  onChange: (levelId: string | null) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ value, onChange }) => {
  const { data: levelsData, isLoading, error } = useGetLevelsQuery(null);

  if (isLoading) return <div>Loading levels...</div>;
  if (error) return <div>Error loading levels</div>;

  const handleLevelChange = (_event: React.SyntheticEvent, newValue: Level | null) => {
    onChange(newValue?.id ? newValue.id.toString() : null);
  };

  return (
    <Box>
      <Autocomplete
        options={levelsData?.data ?? []}
        value={levelsData?.data.find(level => level.id?.toString() === value) ?? null}
        onChange={handleLevelChange}
        getOptionLabel={(option: Level) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Level"
          />
        )}
      />
    </Box>
  );
};

export default LevelSelector;