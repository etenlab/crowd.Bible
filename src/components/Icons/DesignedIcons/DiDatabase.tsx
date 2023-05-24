import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as DatabaseBlue } from './svg-sources/database-blue.svg';
import { ReactComponent as DatabaseDark } from './svg-sources/database-dark.svg';
import { ReactComponent as DatabaseGray } from './svg-sources/database-gray.svg';
import { ReactComponent as DatabaseRed } from './svg-sources/database-red.svg';
import { ReactComponent as DatabaseWhite } from './svg-sources/database-white.svg';
import { DiColors } from './colors';

export function DiDatabase(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Database = DatabaseDark;
  if (color) {
    switch (color) {
      case 'blue':
        Database = DatabaseBlue;
        break;
      case 'gray':
        Database = DatabaseGray;
        break;
      case 'red':
        Database = DatabaseRed;
        break;
      case 'white':
        Database = DatabaseWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Database />
    </SvgIcon>
  );
}
