import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ReadBlue } from './svg-sources/read-blue.svg';
import { ReactComponent as ReadDark } from './svg-sources/read-dark.svg';
import { ReactComponent as ReadGray } from './svg-sources/read-gray.svg';
import { ReactComponent as ReadRed } from './svg-sources/read-red.svg';
import { ReactComponent as ReadWhite } from './svg-sources/read-white.svg';
import { DiColors } from './colors';

export function DiRead(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Read = ReadDark;
  if (color) {
    switch (color) {
      case 'blue':
        Read = ReadBlue;
        break;
      case 'gray':
        Read = ReadGray;
        break;
      case 'red':
        Read = ReadRed;
        break;
      case 'white':
        Read = ReadWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Read />
    </SvgIcon>
  );
}
