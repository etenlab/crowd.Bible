import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as CrossBlue } from './svg-sources/cross-blue.svg';
import { ReactComponent as CrossDark } from './svg-sources/cross-dark.svg';
import { ReactComponent as CrossGray } from './svg-sources/cross-gray.svg';
import { ReactComponent as CrossRed } from './svg-sources/cross-red.svg';
import { ReactComponent as CrossWhite } from './svg-sources/cross-white.svg';
import { DiColors } from './colors';

export function DiCross(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Cross = CrossDark;
  if (color) {
    switch (color) {
      case 'blue':
        Cross = CrossBlue;
        break;
      case 'gray':
        Cross = CrossGray;
        break;
      case 'red':
        Cross = CrossRed;
        break;
      case 'white':
        Cross = CrossWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Cross />
    </SvgIcon>
  );
}
