import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ViewLineBreakBlue } from './svg-sources/view-line-break-blue.svg';
import { ReactComponent as ViewLineBreakDark } from './svg-sources/view-line-break-dark.svg';
import { ReactComponent as ViewLineBreakGray } from './svg-sources/view-line-break-gray.svg';
import { ReactComponent as ViewLineBreakRed } from './svg-sources/view-line-break-red.svg';
import { ReactComponent as ViewLineBreakWhite } from './svg-sources/view-line-break-white.svg';
import { DiColors } from './colors';

export function DiViewLineBreak(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let ViewLineBreak = ViewLineBreakDark;
  if (color) {
    switch (color) {
      case 'blue':
        ViewLineBreak = ViewLineBreakBlue;
        break;
      case 'gray':
        ViewLineBreak = ViewLineBreakGray;
        break;
      case 'red':
        ViewLineBreak = ViewLineBreakRed;
        break;
      case 'white':
        ViewLineBreak = ViewLineBreakWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <ViewLineBreak />
    </SvgIcon>
  );
}
