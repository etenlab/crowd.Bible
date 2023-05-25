import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as PauseBlue } from './svg-sources/pause-blue.svg';
import { ReactComponent as PauseDark } from './svg-sources/pause-dark.svg';
import { ReactComponent as PauseGray } from './svg-sources/pause-gray.svg';
import { ReactComponent as PauseRed } from './svg-sources/pause-red.svg';
import { ReactComponent as PauseWhite } from './svg-sources/pause-white.svg';
import { DiColors } from './colors';

export function DiPause(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Pause = PauseDark;
  if (color) {
    switch (color) {
      case 'blue':
        Pause = PauseBlue;
        break;
      case 'gray':
        Pause = PauseGray;
        break;
      case 'red':
        Pause = PauseRed;
        break;
      case 'white':
        Pause = PauseWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Pause />
    </SvgIcon>
  );
}
