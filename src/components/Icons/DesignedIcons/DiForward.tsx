import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ForwardBlue } from './svg-sources/forward-blue.svg';
import { ReactComponent as ForwardDark } from './svg-sources/forward-dark.svg';
import { ReactComponent as ForwardGray } from './svg-sources/forward-gray.svg';
import { ReactComponent as ForwardRed } from './svg-sources/forward-red.svg';
import { ReactComponent as ForwardWhite } from './svg-sources/forward-white.svg';
import { DiColors } from './colors';

export function DiForward(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Forward = ForwardDark;
  if (color) {
    switch (color) {
      case 'blue':
        Forward = ForwardBlue;
        break;
      case 'gray':
        Forward = ForwardGray;
        break;
      case 'red':
        Forward = ForwardRed;
        break;
      case 'white':
        Forward = ForwardWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Forward />
    </SvgIcon>
  );
}
