import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as RemoveBlue } from './svg-sources/remove-blue.svg';
import { ReactComponent as RemoveDark } from './svg-sources/remove-dark.svg';
import { ReactComponent as RemoveGray } from './svg-sources/remove-gray.svg';
import { ReactComponent as RemoveRed } from './svg-sources/remove-red.svg';
import { ReactComponent as RemoveWhite } from './svg-sources/remove-white.svg';
import { DiColors } from './colors';

export function DiRemove(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Remove = RemoveDark;
  if (color) {
    switch (color) {
      case 'blue':
        Remove = RemoveBlue;
        break;
      case 'gray':
        Remove = RemoveGray;
        break;
      case 'red':
        Remove = RemoveRed;
        break;
      case 'white':
        Remove = RemoveWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Remove />
    </SvgIcon>
  );
}
