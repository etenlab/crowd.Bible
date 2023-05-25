import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as MicroBlue } from './svg-sources/micro-blue.svg';
import { ReactComponent as MicroDark } from './svg-sources/micro-dark.svg';
import { ReactComponent as MicroGray } from './svg-sources/micro-gray.svg';
import { ReactComponent as MicroRed } from './svg-sources/micro-red.svg';
import { ReactComponent as MicroWhite } from './svg-sources/micro-white.svg';
import { DiColors } from './colors';

export function DiMicro(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Micro = MicroDark;
  if (color) {
    switch (color) {
      case 'blue':
        Micro = MicroBlue;
        break;
      case 'gray':
        Micro = MicroGray;
        break;
      case 'red':
        Micro = MicroRed;
        break;
      case 'white':
        Micro = MicroWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Micro />
    </SvgIcon>
  );
}
