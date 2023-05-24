import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as SourceBlue } from './svg-sources/source-blue.svg';
import { ReactComponent as SourceDark } from './svg-sources/source-dark.svg';
import { ReactComponent as SourceGray } from './svg-sources/source-gray.svg';
import { ReactComponent as SourceRed } from './svg-sources/source-red.svg';
import { ReactComponent as SourceWhite } from './svg-sources/source-white.svg';
import { DiColors } from './colors';

export function DiSource(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Source = SourceDark;
  if (color) {
    switch (color) {
      case 'blue':
        Source = SourceBlue;
        break;
      case 'gray':
        Source = SourceGray;
        break;
      case 'red':
        Source = SourceRed;
        break;
      case 'white':
        Source = SourceWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Source />
    </SvgIcon>
  );
}
