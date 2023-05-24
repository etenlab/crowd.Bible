import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as CheckBlue } from './svg-sources/check-blue.svg';
import { ReactComponent as CheckDark } from './svg-sources/check-dark.svg';
import { ReactComponent as CheckGray } from './svg-sources/check-gray.svg';
import { ReactComponent as CheckRed } from './svg-sources/check-red.svg';
import { ReactComponent as CheckWhite } from './svg-sources/check-white.svg';
import { DiColors } from './colors';

export function DiCheck(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Check = CheckDark;
  if (color) {
    switch (color) {
      case 'blue':
        Check = CheckBlue;
        break;
      case 'gray':
        Check = CheckGray;
        break;
      case 'red':
        Check = CheckRed;
        break;
      case 'white':
        Check = CheckWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Check />
    </SvgIcon>
  );
}
