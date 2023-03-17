import {
  MuiMaterial,
  Autocomplete,
  Typography,
  useColorModeContext,
} from '@eten-lab/ui-kit';

const { Stack } = MuiMaterial;

export function LangugeSelectionBox() {
  const { getColor } = useColorModeContext();

  return (
    <Stack
      sx={{ padding: '20px', gap: '12px', background: getColor('light-blue') }}
    >
      <Typography variant="h2" color="text.dark">
        Documents
      </Typography>
      <Autocomplete
        label="Choose Source Language"
        options={['English', 'Spain', 'Germany']}
      />
      <Autocomplete
        label="Choose Target Language"
        options={['English', 'Spain', 'Germany']}
      />
    </Stack>
  );
}
