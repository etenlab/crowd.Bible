import {
  MuiMaterial,
  Autocomplete,
  Typography,
  colors,
} from '@eten-lab/ui-kit';

const { Stack } = MuiMaterial;

export function LangugeSelectionBox() {
  return (
    <Stack
      sx={{ padding: '20px', gap: '12px', background: colors['light-blue'] }}
    >
      <Typography variant="h2" sx={{ color: colors.dark }}>
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
