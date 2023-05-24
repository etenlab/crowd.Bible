import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ToggleOffBlue } from './svg-sources/toggle-off-blue.svg';
import { ReactComponent as ToggleOffDark } from './svg-sources/toggle-off-dark.svg';
import { ReactComponent as ToggleOffGray } from './svg-sources/toggle-off-gray.svg';
import { ReactComponent as ToggleOffRed } from './svg-sources/toggle-off-red.svg';
import { ReactComponent as ToggleOffWhite } from './svg-sources/toggle-off-white.svg';
import { DiColors } from './colors';

export function DiToggleOff(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let ToggleOff = ToggleOffDark;
  if (color) {
    switch (color) {
      case 'blue':
        ToggleOff = ToggleOffBlue;
        break;
      case 'gray':
        ToggleOff = ToggleOffGray;
        break;
      case 'red':
        ToggleOff = ToggleOffRed;
        break;
      case 'white':
        ToggleOff = ToggleOffWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <ToggleOff />
    </SvgIcon>
  );
}
