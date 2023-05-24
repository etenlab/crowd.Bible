import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as MoreBlue } from './svg-sources/more-blue.svg';
import { ReactComponent as MoreDark } from './svg-sources/more-dark.svg';
import { ReactComponent as MoreGray } from './svg-sources/more-gray.svg';
import { ReactComponent as MoreRed } from './svg-sources/more-red.svg';
import { ReactComponent as MoreWhite } from './svg-sources/more-white.svg';
import { DiColors } from './colors';

export function DiMore(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let More = MoreDark;
  if (color) {
    switch (color) {
      case 'blue':
        More = MoreBlue;
        break;
      case 'gray':
        More = MoreGray;
        break;
      case 'red':
        More = MoreRed;
        break;
      case 'white':
        More = MoreWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <More />
    </SvgIcon>
  );
}
