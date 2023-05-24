import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as TargetBlue } from './svg-sources/target-blue.svg';
import { ReactComponent as TargetDark } from './svg-sources/target-dark.svg';
import { ReactComponent as TargetGray } from './svg-sources/target-gray.svg';
import { ReactComponent as TargetRed } from './svg-sources/target-red.svg';
import { ReactComponent as TargetWhite } from './svg-sources/target-white.svg';
import { DiColors } from './colors';

export function DiTarget(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Target = TargetDark;
  if (color) {
    switch (color) {
      case 'blue':
        Target = TargetBlue;
        break;
      case 'gray':
        Target = TargetGray;
        break;
      case 'red':
        Target = TargetRed;
        break;
      case 'white':
        Target = TargetWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Target />
    </SvgIcon>
  );
}
