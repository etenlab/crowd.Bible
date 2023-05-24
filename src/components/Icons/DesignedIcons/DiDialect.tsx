import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as DialectBlue } from './svg-sources/dialect-blue.svg';
import { ReactComponent as DialectDark } from './svg-sources/dialect-dark.svg';
import { ReactComponent as DialectGray } from './svg-sources/dialect-gray.svg';
import { ReactComponent as DialectRed } from './svg-sources/dialect-red.svg';
import { ReactComponent as DialectWhite } from './svg-sources/dialect-white.svg';
import { DiColors } from './colors';

export function DiDialect(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Dialect = DialectDark;
  if (color) {
    switch (color) {
      case 'blue':
        Dialect = DialectBlue;
        break;
      case 'gray':
        Dialect = DialectGray;
        break;
      case 'red':
        Dialect = DialectRed;
        break;
      case 'white':
        Dialect = DialectWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Dialect />
    </SvgIcon>
  );
}
