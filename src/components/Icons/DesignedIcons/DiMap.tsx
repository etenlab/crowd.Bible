import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { ReactComponent as MapBlue } from './svg-sources/map-blue.svg';
import { ReactComponent as MapDark } from './svg-sources/map-dark.svg';
import { ReactComponent as MapGray } from './svg-sources/map-gray.svg';
import { ReactComponent as MapRed } from './svg-sources/map-red.svg';
import { ReactComponent as MapWhite } from './svg-sources/map-white.svg';
import { DiColors } from './colors';

export function DiMap(
  props: Omit<SvgIconProps, 'color'> & { color?: DiColors },
) {
  const { color, ...rest } = props;
  let Map = MapDark;
  if (color) {
    switch (color) {
      case 'blue':
        Map = MapBlue;
        break;
      case 'gray':
        Map = MapGray;
        break;
      case 'red':
        Map = MapRed;
        break;
      case 'white':
        Map = MapWhite;
        break;
      default:
        break;
    }
  }
  return (
    <SvgIcon {...rest}>
      <Map />
    </SvgIcon>
  );
}
