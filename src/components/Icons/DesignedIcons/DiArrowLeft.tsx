import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ArrowLeftBlue } from './svg-sources/arrow-left-blue.svg';
import { ReactComponent as ArrowLeftDark } from './svg-sources/arrow-left-dark.svg';
import { ReactComponent as ArrowLeftGray } from './svg-sources/arrow-left-gray.svg';
import { ReactComponent as ArrowLeftRed } from './svg-sources/arrow-left-red.svg';
import { ReactComponent as ArrowLeftWhite } from './svg-sources/arrow-left-white.svg';
import { DiColors } from './colors';

export function DiArrowLeft(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let ArrowLeft = ArrowLeftDark;
  if (color) {
    switch (color) {
      case 'blue':
        ArrowLeft = ArrowLeftBlue;
        break;
      case 'gray':
        ArrowLeft = ArrowLeftGray;
        break;
      case 'red':
        ArrowLeft = ArrowLeftRed;
        break;
      case 'white':
        ArrowLeft = ArrowLeftWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <ArrowLeft />
    </SvgIcon>
  );
}
