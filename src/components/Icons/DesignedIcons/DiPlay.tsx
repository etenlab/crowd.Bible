import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as PlayBlue } from './svg-sources/play-blue.svg';
import { ReactComponent as PlayDark } from './svg-sources/play-dark.svg';
import { ReactComponent as PlayGray } from './svg-sources/play-gray.svg';
import { ReactComponent as PlayRed } from './svg-sources/play-red.svg';
import { ReactComponent as PlayWhite } from './svg-sources/play-white.svg';
import { DiColors } from './colors';

export function DiPlay(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Play = PlayDark;
  if (color) {
    switch (color) {
      case 'blue':
        Play = PlayBlue;
        break;
      case 'gray':
        Play = PlayGray;
        break;
      case 'red':
        Play = PlayRed;
        break;
      case 'white':
        Play = PlayWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Play />
    </SvgIcon>
  );
}
