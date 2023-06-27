import React, { Fragment } from 'react';
import { MuiMaterial, Checkbox } from '@eten-lab/ui-kit';

const { FormControl, FormControlLabel, FormLabel, Divider, FormGroup } =
  MuiMaterial;

type Item = {
  id: string;
  checked: boolean;
  label: string;
};

export type CheckboxListProps = {
  withUnderline?: boolean;
  underlineColor?: string;
  items: Item[];
  label?: string;
  onChange(event: React.SyntheticEvent, newValue: boolean, id: string): void;
};

export function CheckboxList({
  withUnderline = false,
  underlineColor,
  items,
  label,
  onChange,
}: CheckboxListProps) {
  const sxObj = underlineColor
    ? { borderColor: `${underlineColor} !important` }
    : {};

  return (
    <FormControl fullWidth>
      {label ? <FormLabel color="gray">{label}</FormLabel> : null}
      <FormGroup>
        {items.map(({ id, checked, label }) => (
          <Fragment key={label}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event, newValue) => {
                    onChange(event, newValue, id);
                  }}
                />
              }
              label={label}
              sx={{ padding: '3px 0' }}
            />
            {withUnderline ? <Divider sx={{ ...sxObj }} /> : null}
          </Fragment>
        ))}
      </FormGroup>
    </FormControl>
  );
}
