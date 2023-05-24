import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as AttachBlue } from './svg-sources/attach-blue.svg';
import { ReactComponent as AttachDark } from './svg-sources/attach-dark.svg';
import { ReactComponent as AttachGray } from './svg-sources/attach-gray.svg';
import { ReactComponent as AttachRed } from './svg-sources/attach-red.svg';
import { ReactComponent as AttachWhite } from './svg-sources/attach-white.svg';
import { DiColors } from './colors';

export function DiAttach(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Attach = AttachDark;
  if (color) {
    switch (color) {
      case 'blue':
        Attach = AttachBlue;
        break;
      case 'gray':
        Attach = AttachGray;
        break;
      case 'red':
        Attach = AttachRed;
        break;
      case 'white':
        Attach = AttachWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Attach />
    </SvgIcon>
  );
}
