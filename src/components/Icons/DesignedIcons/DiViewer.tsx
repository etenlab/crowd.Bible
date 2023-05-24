import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as ViewerBlue } from './svg-sources/viewer-blue.svg';
import { ReactComponent as ViewerDark } from './svg-sources/viewer-dark.svg';
import { ReactComponent as ViewerGray } from './svg-sources/viewer-gray.svg';
import { ReactComponent as ViewerRed } from './svg-sources/viewer-red.svg';
import { ReactComponent as ViewerWhite } from './svg-sources/viewer-white.svg';
import { DiColors } from './colors';

export function DiViewer(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Viewer = ViewerDark;
  if (color) {
    switch (color) {
      case 'blue':
        Viewer = ViewerBlue;
        break;
      case 'gray':
        Viewer = ViewerGray;
        break;
      case 'red':
        Viewer = ViewerRed;
        break;
      case 'white':
        Viewer = ViewerWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Viewer />
    </SvgIcon>
  );
}
